import {describe,it,expect} from 'vitest';
import {searchUSCities} from '../lib/us-city-search';
describe('Census city search',()=>{
 it('resolves Upper Marlboro in Maryland',()=>{const r=searchUSCities('Upper Marlboro, MD');expect(r).toHaveLength(1);expect(r[0].name).toBe('Upper Marlboro, MD');expect(r[0].lat).toBeGreaterThan(38);expect(r[0].lon).toBeLessThan(-76);});
 it('accepts state names and case',()=>expect(searchUSCities('ATLANTA, Georgia')[0].name).toBe('Atlanta, GA'));
 it('returns choices for ambiguous cities',()=>expect(searchUSCities('Springfield').length).toBeGreaterThan(1));
 it('covers Alaska and Hawaii',()=>{expect(searchUSCities('Anchorage, AK').length).toBeGreaterThan(0);expect(searchUSCities('Honolulu, HI').length).toBeGreaterThan(0);});
 it('does not invent unknown places',()=>expect(searchUSCities('nonexistent place zz')).toEqual([]));
});
