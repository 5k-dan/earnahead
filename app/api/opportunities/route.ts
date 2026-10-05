import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server';
import { configured } from '@/lib/supabase';
import { searchSchema } from '@/lib/validation';
export async function GET(req:NextRequest) {
 if(!configured) return NextResponse.json({items:[],setup:true});
 const parsed=searchSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
 if(!parsed.success) return NextResponse.json({error:'Choose a location to search.'},{status:400});
 const {lat,lon,radius,type,scope}=parsed.data;
 const db=await serverDb();
 const kinds=scope==='donations'?['PLASMA','SPERM','EGG']:scope==='research'?['CLINICAL_TRIAL','RESEARCH_STUDY']:null;
 if(type&&kinds&&!kinds.includes(type))return NextResponse.json({error:'Choose a category in this discovery tab.'},{status:400});
 const results=await Promise.all((type?[type]:kinds??[null]).map(kind=>db.rpc('nearby_opportunities',{search_latitude:lat,search_longitude:lon,radius_miles:radius,kind})));
 const error=results.find(r=>r.error)?.error;if(error)return NextResponse.json({error:error.message},{status:500});
 const data=results.flatMap(r=>r.data??[]).sort((a,b)=>a.distance_miles-b.distance_miles);
 if(!data?.length)return NextResponse.json({items:[]});
 const metadata=[];
 for(let start=0;start<data.length;start+=50){const response=await db.from('opportunities').select('*,organizations(name),locations(name,address)').in('id',data.slice(start,start+50).map((row:{id:string})=>row.id));if(response.error)return NextResponse.json({error:'Provider details are temporarily unavailable. Please retry.'},{status:503});metadata.push(...response.data??[]);}
 const byId=new Map((metadata??[]).map(row=>{const org=Array.isArray(row.organizations)?row.organizations[0]:row.organizations;const place=Array.isArray(row.locations)?row.locations[0]:row.locations;return [row.id,{compensation_basis:row.compensation_basis,source_checked_at:row.source_checked_at,organization_name:org?.name,facility_name:place?.name,address:place?.address}];}));
 const restricted=new Set(metadata.filter(row=>row.data_source==='GOOGLE_PLACES').map(row=>row.id));
 return NextResponse.json({items:data.filter((row:{id:string})=>!restricted.has(row.id)).map((row:{id:string})=>({...row,...byId.get(row.id)}))});
}


