import {createClient} from '@supabase/supabase-js';
const [lat,lon]=process.argv.slice(2).map(Number);
if(!Number.isFinite(lat)||!Number.isFinite(lon)||!process.env.GOOGLE_PLACES_API_KEY)throw new Error('Set GOOGLE_PLACES_API_KEY and pass latitude longitude.');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{global:{headers:{Authorization:`Bearer ${process.env.IMPORTER_ACCESS_TOKEN}`}}});
for(const [query,type] of [['plasma donation center','PLASMA'],['sperm bank','SPERM'],['egg donor program','EGG']]) {
 const response=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':process.env.GOOGLE_PLACES_API_KEY,'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.location'},body:JSON.stringify({textQuery:query,locationBias:{circle:{center:{latitude:lat,longitude:lon},radius:50000}}})});
 if(!response.ok)throw new Error(`Places returned ${response.status}`);
 for(const place of (await response.json()).places??[]) { const {data:exists,error:lookupError}=await db.from('opportunities').select('id').eq('data_source','GOOGLE_PLACES').eq('external_id',place.id).maybeSingle();if(lookupError)throw lookupError;if(exists)continue;
 const {data:facility,error}=await db.from('locations').insert({name:place.displayName.text,address:place.formattedAddress,position:`SRID=4326;POINT(${place.location.longitude} ${place.location.latitude})`}).select('id').single();if(error)throw error;
 const {error:insertError}=await db.from('opportunities').insert({title:place.displayName.text,location_id:facility.id,opportunity_type:type,minimum_age:type==='EGG'?21:18,data_source:'GOOGLE_PLACES',external_id:place.id,compensation_min:null,compensation_max:null,source_url:null,review_status:'NEEDS_SOURCE',active:false,verified:false});if(insertError)throw insertError;
 }
}
console.log('Facilities imported as NEEDS_SOURCE. No pay rates inferred.');
