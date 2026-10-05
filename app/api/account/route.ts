import {NextRequest,NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
export async function DELETE(req:NextRequest){
 if(req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 const {data:{user},error}=await (await serverDb()).auth.getUser();if(error||!user)return NextResponse.json({error:'Sign in required.'},{status:401});
 const body=await req.json().catch(()=>null);if(body?.confirmation!=='DELETE')return NextResponse.json({error:'Type DELETE to confirm.'},{status:400});
 const result=await (await serverDb()).rpc('delete_own_account');if(result.error)return NextResponse.json({error:'Account deletion is unavailable. Contact support.'},{status:500});return NextResponse.json({deleted:true});
}
