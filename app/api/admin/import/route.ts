import {NextRequest,NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
import {importPage} from '@/lib/import-service';
export const maxDuration=60;
export async function POST(req:NextRequest){
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user||user.app_metadata.role!=='admin')return NextResponse.json({error:'Administrator access required.'},{status:403});
 return importPage(db,await req.json().catch(()=>null));
}