import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {serverDb} from '@/lib/server';
import {z} from 'zod';
export async function GET(req:NextRequest){
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user||user.app_metadata.role!=='admin')return NextResponse.json({error:'Administrator access required.'},{status:403});
 const input=z.object({accountsPage:z.coerce.number().int().min(1).max(10000).default(1),eventsPage:z.coerce.number().int().min(1).max(10000).default(1)}).strict().safeParse(Object.fromEntries(req.nextUrl.searchParams));if(!input.success)return NextResponse.json({error:'Invalid page.'},{status:400});
 const {accountsPage,eventsPage}=input.data;const {data:events,error}=await db.from('activity_events').select('id,user_id,event,created_at').gte('created_at',new Date(Date.now()-90*86400000).toISOString()).order('created_at',{ascending:false}).order('id').range((eventsPage-1)*50,eventsPage*50);
 let accounts: {id:string;email:string|null;created_at:string;confirmed:boolean}[]=[];let accountsError:string|null=null;let moreAccounts=false;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(url&&key){const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});const result=await admin.auth.admin.listUsers({page:accountsPage,perPage:50});if(result.error)accountsError='Account list is unavailable.';else{accounts=result.data.users.map(row=>({id:row.id,email:row.email??null,created_at:row.created_at,confirmed:!!row.email_confirmed_at}));moreAccounts=!!result.data.nextPage;}}else accountsError='Account list requires the server-side Supabase service role key.';
 return NextResponse.json({accounts,accountsError,moreAccounts,events:(events??[]).slice(0,50),moreEvents:(events?.length??0)>50,eventsError:error?'Apply the activity log migration to enable logs.':null},{headers:{'Cache-Control':'private, no-store'}});
}
