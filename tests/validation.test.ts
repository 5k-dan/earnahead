import {describe,it,expect} from 'vitest';
import {profileSchema,reviewSchema,searchSchema} from '../lib/validation';
const profile={name:' Alex ',dob:'2000-01-01',city:' Atlanta ',preferences:['PLASMA']};
const listing={source_url:'https://provider.example/terms',minimum_age:18,maximum_age:null,compensation_min:null,compensation_max:null,opportunity_type:'PLASMA'};
describe('profile validation',()=>{
 it('trims basic fields',()=>expect(profileSchema.parse(profile).name).toBe('Alex'));
 it.each(['2000-02-30','2000-13-01','not-a-date','2999-01-01','2000-1-1'])('rejects invalid DOB %s',dob=>expect(profileSchema.safeParse({...profile,dob}).success).toBe(false));
 it.each(['health','diagnosis','medications'])('rejects health field %s',field=>expect(profileSchema.safeParse({...profile,[field]:'private'}).success).toBe(false));
 it('allows leap-day DOB',()=>expect(profileSchema.safeParse({...profile,dob:'2000-02-29'}).success).toBe(true));
 it('rejects blank names and unknown interests',()=>{expect(profileSchema.safeParse({...profile,name:'  '}).success).toBe(false);expect(profileSchema.safeParse({...profile,preferences:['DIAGNOSIS']}).success).toBe(false);});
});
describe('review rules',()=>{
 it('preserves unpublished compensation as null',()=>expect(reviewSchema.parse(listing).compensation_min).toBeNull());
 it.each(['','javascript:alert(1)','ftp://example.com'])('rejects unsupported source %s',source_url=>expect(reviewSchema.safeParse({...listing,source_url}).success).toBe(false));
 it('rejects underage listings and reversed ranges',()=>{for(const patch of [{minimum_age:17},{minimum_age:20,opportunity_type:'EGG'},{maximum_age:17},{compensation_min:100,compensation_max:50},{compensation_min:-1}])expect(reviewSchema.safeParse({...listing,...patch}).success).toBe(false);});
 it('accepts 21+ egg listings and zero published payment',()=>expect(reviewSchema.safeParse({...listing,opportunity_type:'EGG',minimum_age:21,compensation_min:0}).success).toBe(true));
});
describe('radius validation',()=>{
 it('coerces query strings and supplies radius default',()=>expect(searchSchema.parse({lat:'33.749',lon:'-84.388'}).radius).toBe(25));
 it.each([{lat:91,lon:0},{lat:0,lon:181},{lat:0,lon:0,radius:0},{lat:0,lon:0,radius:101},{lat:'bad',lon:0},{lat:0,lon:0,type:'MADE_UP'},{lat:'',lon:0},{lat:null,lon:0},{lat:'Infinity',lon:0}])('rejects out-of-bounds query %#',input=>expect(searchSchema.safeParse(input).success).toBe(false));
});
