import {NextResponse} from 'next/server';
import type {SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {usStates} from './us-states';
const responseSchema=z.object({places:z.array(z.object({id:z.string().min(1),displayName:z.object({text:z.string().min(1)}),formattedAddress:z.string(),location:z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180)})})).default([])});
export async function importPlaces(db:SupabaseClient,state:unknown,kind:'PLASMA'|'SPERM'|'EGG'='PLASMA'){
 const parsed=z.enum(usStates).safeParse(state);if(!parsed.success)return NextResponse.json({error:'Choose a US state.'},{status:400});
 const key=process.env.GOOGLE_PLACES_API_KEY;if(!key)return NextResponse.json({error:'Facility imports need GOOGLE_PLACES_API_KEY in hosting settings. No facilities have been imported.'},{status:503});
 let imported=0,existing=0;
 try{
  for(const [query,type] of [['plasma donation center','PLASMA'],['sperm bank','SPERM'],['egg donor program','EGG']].filter(([,type])=>type===kind)){
   const response=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.location'},body:JSON.stringify({textQuery:`${query} in ${parsed.data}, United States`,regionCode:'US',pageSize:20}),signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw new Error('Facility source is unavailable.');
   const page=responseSchema.parse(await response.json());
   for(const place of page.places){
    const lookup=await db.from('opportunities').select('id').eq('data_source','GOOGLE_PLACES').eq('external_id',place.id).maybeSingle();if(lookup.error)throw lookup.error;if(lookup.data){existing++;continue;}
    const facility=await db.from('locations').insert({name:place.displayName.text,address:place.formattedAddress,position:`SRID=4326;POINT(${place.location.longitude} ${place.location.latitude})`}).select('id').single();if(facility.error)throw facility.error;
    const result=await db.from('opportunities').insert({title:place.displayName.text,location_id:facility.data.id,opportunity_type:type,minimum_age:type==='EGG'?21:18,compensation_min:null,compensation_max:null,source_url:null,data_source:'GOOGLE_PLACES',external_id:place.id,review_status:'NEEDS_SOURCE',active:false,verified:false});
    if(result.error){await db.from('locations').delete().eq('id',facility.data.id);if(result.error.code==='23505'){existing++;continue;}throw result.error;}
    imported++;
   }
  }
  return NextResponse.json({imported,existing});
 }catch{return NextResponse.json({error:'Facility import interrupted. Retry to resume; existing records will be skipped.',imported,existing},{status:502});}
}
