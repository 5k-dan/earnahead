import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server';
import { configured } from '@/lib/supabase';
import { searchSchema } from '@/lib/validation';
export async function GET(req:NextRequest) {
 if(!configured) return NextResponse.json({items:[],setup:true});
 const parsed=searchSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
 if(!parsed.success) return NextResponse.json({error:'Choose a location to search.'},{status:400});
 const {lat,lon,radius,type}=parsed.data;
 const {data,error}=await (await serverDb()).rpc('nearby_opportunities',{search_latitude:lat,search_longitude:lon,radius_miles:radius,kind:type??null});
 if(error)return NextResponse.json({error:error.message},{status:500});
 if(!data?.length)return NextResponse.json({items:[]});
 const {data:metadata}=await (await serverDb()).from('opportunities').select('*,organizations(name),locations(name,address)').in('id',data.map((row:{id:string})=>row.id));
 const byId=new Map((metadata??[]).map(row=>{const org=Array.isArray(row.organizations)?row.organizations[0]:row.organizations;const place=Array.isArray(row.locations)?row.locations[0]:row.locations;return [row.id,{compensation_basis:row.compensation_basis,source_checked_at:row.source_checked_at,organization_name:org?.name,facility_name:place?.name,address:place?.address}];}));
 return NextResponse.json({items:data.map((row:{id:string})=>({...row,...byId.get(row.id)}))});
}


