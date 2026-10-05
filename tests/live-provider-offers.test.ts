import {afterEach,expect,it,vi} from 'vitest';
vi.mock('next/cache',()=>({unstable_cache:(fn:unknown)=>fn}));
import {liveProviderOffer} from '../lib/live-provider-offers';
const url='https://www.biolifeplasma.com/locations/pennsylvania/camp-hill';
const external=`official-location:${url}:136 S 32nd St`;
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
it('refreshes the center amount and ignores banners, referral fees and scripts',async()=>{vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-07'));const fetcher=vi.fn().mockResolvedValue({ok:true,text:async()=>'<script>New donors can get up to $999 in their first month donating.</script><p>New Donors Get up to $800!</p><p>Buddy Bonus $50.</p><p>New donors can get up to $650 in their first month donating.</p>'});vi.stubGlobal('fetch',fetcher);const offer=await liveProviderOffer(external,'unknown','PLASMA');expect(offer?.maximum).toBe(650);expect(offer?.kind).toBe('NEW_DONOR');expect(fetcher).toHaveBeenCalledWith(url,expect.objectContaining({redirect:'error'}));});
it('hides expired prices when the source cannot be confirmed',async()=>{vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-05'));vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('Unavailable')));expect(await liveProviderOffer(external,'unknown','PLASMA')).toBeNull();});
it('does not fetch arbitrary URLs from external identifiers',async()=>{const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);expect(await liveProviderOffer('official-location:https://evil.example/locations/a:street','unknown','PLASMA')).toBeNull();expect(fetcher).not.toHaveBeenCalled();});
