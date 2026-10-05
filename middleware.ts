import {createServerClient,type CookieOptions} from '@supabase/ssr';
import {NextRequest,NextResponse} from 'next/server';
export async function middleware(request:NextRequest){
 const path=request.nextUrl.pathname;
 if(path.startsWith('/api/')&&!['GET','HEAD','OPTIONS'].includes(request.method)){
  const origin=request.headers.get('origin');if((origin&&origin!==request.nextUrl.origin)||request.headers.get('sec-fetch-site')==='cross-site')return NextResponse.json({error:'Cross-site requests are not allowed.'},{status:403});
  const size=Number(request.headers.get('content-length')??0);if(size>16384)return NextResponse.json({error:'Request too large.'},{status:413});
 }
 let response=NextResponse.next({request});
 if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){
  const db=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>request.cookies.getAll(),setAll:(values:{name:string;value:string;options:CookieOptions}[])=>{values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
  await db.auth.getUser();
 }
 if(path.startsWith('/api/')||['/profile','/dashboard','/earnings','/admin','/organization','/reset-password','/onboarding'].includes(path))response.headers.set('Cache-Control','private, no-store');
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
