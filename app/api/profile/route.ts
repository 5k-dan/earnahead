import {NextRequest,NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
import {profileSchema} from '@/lib/validation';
export async function POST(req:NextRequest){const parsed=profileSchema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Invalid profile fields.'},{status:400});const db=await serverDb();const {data}=await db.auth.getUser();if(!data.user)return NextResponse.json({error:'Sign in first.'},{status:401});const {error}=await db.from('user_profiles').upsert({user_id:data.user.id,...parsed.data});return NextResponse.json(error?{error:error.message}:{ok:true},{status:error?400:200});}
