import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
export async function GET(req:NextRequest){
 const input=z.string().trim().min(2).max(100).safeParse(req.nextUrl.searchParams.get('q'));
 if(!input.success)return NextResponse.json({error:'Enter a city or US ZIP code.'},{status:400});
 try{
 if(/^\d{5}$/.test(input.data)){const response=await fetch(`https://api.zippopotam.us/us/${input.data}`,{next:{revalidate:86400},signal:AbortSignal.timeout(10000)});if(!response.ok)return NextResponse.json({error:'ZIP code not found.'},{status:404});const data=await response.json();return NextResponse.json({places:data.places.map((p:Record<string,string>)=>({name:`${p['place name']}, ${p['state abbreviation']}`,lat:Number(p.latitude),lon:Number(p.longitude)}))});}
 const apiKey=process.env.OPEN_METEO_API_KEY;
 if(process.env.NODE_ENV==='production'&&!apiKey)return NextResponse.json({error:'City search is not configured. Enter a US ZIP code or use your current location.'},{status:503});
 const url=new URL(apiKey?'https://customer-geocoding-api.open-meteo.com/v1/search':'https://geocoding-api.open-meteo.com/v1/search');if(apiKey)url.searchParams.set('apikey',apiKey);url.searchParams.set('name',input.data);url.searchParams.set('count','6');url.searchParams.set('language','en');url.searchParams.set('countryCode','US');
 const response=await fetch(url,{next:{revalidate:86400},signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error();const data=await response.json();return NextResponse.json({places:(data.results??[]).map((p:{name:string;admin1:string;latitude:number;longitude:number})=>({name:`${p.name}, ${p.admin1}`,lat:p.latitude,lon:p.longitude}))});
 }catch{return NextResponse.json({error:'Location search is unavailable. Use your current location or coordinates.'},{status:503});}
}
