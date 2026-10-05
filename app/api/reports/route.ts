import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {serverDb} from '@/lib/server';
const schema=z.object({opportunityId:z.string().uuid(),reason:z.enum(['SOURCE','COMPENSATION','LOCATION','CLOSED','OTHER'])}).strict();
export async function POST(req:NextRequest){if(req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'Invalid origin.'},{status:403});const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'Sign in required.'},{status:401});const input=schema.safeParse(await req.json().catch(()=>null));if(!input.success)return NextResponse.json({error:'Choose a report reason.'},{status:400});const {error}=await db.from('listing_reports').insert({opportunity_id:input.data.opportunityId,reporter_id:user.id,reason:input.data.reason});if(error&&error.code!=='23505')return NextResponse.json({error:'Report unavailable.'},{status:500});return NextResponse.json({received:true});}
