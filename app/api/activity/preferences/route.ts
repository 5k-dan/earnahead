import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {serverDb} from '@/lib/server';
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'Invalid origin.'},{status:403});
 const parsed=z.object({enabled:z.boolean()}).strict().safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Invalid preference.'},{status:400});
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'Sign in required.'},{status:401});
 const {error}=await db.rpc('set_activity_consent',{allow_tracking:parsed.data.enabled});return error?NextResponse.json({error:'Preference could not be saved.'},{status:503}):NextResponse.json({enabled:parsed.data.enabled});
}
