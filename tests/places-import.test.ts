// @vitest-environment node
import {expect,it,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
import {importPlaces} from '../lib/places-import';
it('does not fetch or store restricted Places content even with a key',async()=>{const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);vi.stubEnv('GOOGLE_PLACES_API_KEY','test-only');const from=vi.fn();for(const type of ['PLASMA','SPERM','EGG'] as const){const response=await importPlaces({from} as unknown as SupabaseClient,'Georgia',type);expect(response.status).toBe(503);expect((await response.json()).error).toContain('licensing');}expect(fetcher).not.toHaveBeenCalled();expect(from).not.toHaveBeenCalled();vi.unstubAllEnvs();vi.unstubAllGlobals();});
it('still rejects invalid states',async()=>expect((await importPlaces({} as SupabaseClient,'Canada')).status).toBe(400));
