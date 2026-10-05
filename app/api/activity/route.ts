import {NextRequest,NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
import {activityInput} from '@/lib/activity-events';
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'Invalid origin.'},{status:403});
 const input=activityInput.safeParse(await req.json().catch(()=>null));if(!input.success)return NextResponse.json({error:'Invalid activity event.'},{status:400});
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'Sign in required.'},{status:401});
 const {error}=await db.rpc('record_activity_event',{event_name:input.data.event});
 return error?NextResponse.json({error:'Activity logging is unavailable.'},{status:503}):NextResponse.json({received:true});
}
