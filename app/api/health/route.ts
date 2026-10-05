import {NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(){try{const db=await serverDb();const result=await db.from('opportunities').select('id').limit(1);if(result.error)throw result.error;return NextResponse.json({status:'ok'},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({status:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
