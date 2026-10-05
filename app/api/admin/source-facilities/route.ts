import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {serverDb} from '@/lib/server';
import {sourceFacilityBatch} from '@/lib/provider-source';
export const maxDuration=60;
export async function POST(req:NextRequest){
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();
 if(!user||user.app_metadata.role!=='admin')return NextResponse.json({error:'Administrator access required.'},{status:403});
 const input=z.object({after:z.string().uuid().optional()}).strict().safeParse(await req.json().catch(()=>null));
 if(!input.success)return NextResponse.json({error:'Invalid source lookup cursor.'},{status:400});
 try{return NextResponse.json(await sourceFacilityBatch(db,input.data.after));}catch{return NextResponse.json({error:'Source lookup interrupted. Retry to continue; completed sources are preserved.'},{status:502});}
}
