// @vitest-environment node
import {beforeEach,expect,it,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
import {importPlaces} from '../lib/places-import';
const insert=vi.fn();
const db={from:(table:string)=>table==='locations'?{insert:()=>({select:()=>({single:async()=>({data:{id:'location'},error:null})})})}:{select:()=>({eq:()=>({eq:()=>({maybeSingle:async()=>({data:null,error:null})})})}),insert:async(value:unknown)=>{insert(value);return {error:null};}}} as unknown as SupabaseClient;
beforeEach(()=>{vi.clearAllMocks();vi.unstubAllEnvs();vi.unstubAllGlobals();});
it('requires a valid state and a private provider key',async()=>{const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);vi.stubEnv('GOOGLE_PLACES_API_KEY','');expect((await importPlaces(db,'Canada')).status).toBe(400);expect((await importPlaces(db,'Alaska')).status).toBe(503);expect(fetcher).not.toHaveBeenCalled();});
it('keeps facility discoveries hidden, with null compensation and egg minimum age 21',async()=>{vi.stubEnv('GOOGLE_PLACES_API_KEY','test-only');const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({places:[{id:'published-id',displayName:{text:'Real source facility'},formattedAddress:'Source address',location:{latitude:40,longitude:-100}}]})});vi.stubGlobal('fetch',fetcher);for(const kind of ['PLASMA','SPERM','EGG'] as const)expect((await importPlaces(db,'Hawaii',kind)).status).toBe(200);expect(insert).toHaveBeenCalledTimes(3);for(const [record] of insert.mock.calls)expect(record).toMatchObject({compensation_min:null,compensation_max:null,source_url:null,review_status:'NEEDS_SOURCE',active:false,verified:false});expect(insert.mock.calls[2][0].minimum_age).toBe(21);expect(JSON.parse(fetcher.mock.calls[0][1].body).textQuery).toContain('Hawaii');});
