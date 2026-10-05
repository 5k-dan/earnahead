import {NextResponse} from 'next/server';
import type {SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {usStates} from './us-states';
// Previous importer persisted restricted Places content. Keep paused until a compliant
// independent provider directory or licensed integration replaces that implementation.
export async function importPlaces(_db:SupabaseClient,state:unknown,_kind:'PLASMA'|'SPERM'|'EGG'='PLASMA'){
 if(!z.enum(usStates).safeParse(state).success)return NextResponse.json({error:'Choose a US state.'},{status:400});
 return NextResponse.json({error:'Facility imports are paused while location data licensing is corrected. Use independently sourced provider locations. A Google API key does not remove storage and map-use restrictions.'},{status:503});
}
