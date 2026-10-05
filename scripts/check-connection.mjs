import {createClient} from '@supabase/supabase-js';
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false}});
const {data,error}=await db.rpc('nearby_opportunities',{search_latitude:33.749,search_longitude:-84.388,radius_miles:50,kind:null});
if(error)throw new Error(`Database radius-search check failed: ${error.message}`);
if(!Array.isArray(data))throw new Error('Radius search did not return an array.');
console.log(`Supabase connection and Atlanta PostGIS query passed. ${data.length} public listings.`);
for(const table of ['user_profiles','saved_opportunities','applications','earnings']){const {data:rows,error:readError}=await db.from(table).select('*').limit(1);if(readError)throw new Error(`${table}: ${readError.message}`);if(rows.length)throw new Error(`Anonymous access unexpectedly returned private ${table} records.`);console.log(`Anonymous ${table} read returned no private rows.`);}
