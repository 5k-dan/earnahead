import {expect,it} from 'vitest';
import {groupOpportunities,Opportunity} from '../lib/opportunities';
const row:Opportunity={id:'one',title:'A real study',opportunity_type:'CLINICAL_TRIAL',compensation_min:null,compensation_max:null,minimum_age:18,maximum_age:null,source_url:'https://clinicaltrials.gov/study/NCT00000001',distance_miles:15,latitude:33,longitude:-84};
it('groups facility listings while keeping the nearest as the main card',()=>{const result=groupOpportunities([row,{...row,id:'two',distance_miles:5}]);expect(result).toHaveLength(1);expect(result[0].id).toBe('two');expect(result[0].nearbyLocations.map(r=>r.id)).toEqual(['two','one']);});
it('does not merge unrelated studies that happen to share a title',()=>expect(groupOpportunities([row,{...row,id:'two',source_url:'https://clinicaltrials.gov/study/NCT00000002'}])).toHaveLength(2));
it('keeps different age requirements and payment units separate',()=>{expect(groupOpportunities([row,{...row,id:'two',minimum_age:21}])).toHaveLength(2);expect(groupOpportunities([row,{...row,id:'two',compensation_basis:'PER_MONTH'}])).toHaveLength(2);});
it('removes repeated IDs within a group',()=>expect(groupOpportunities([row,row])[0].nearbyLocations).toHaveLength(1));
it('does not mutate source order',()=>{const rows=[row,{...row,id:'two',distance_miles:3}];groupOpportunities(rows);expect(rows[0].id).toBe('one');});
it('returns no cards for an empty result',()=>expect(groupOpportunities([])).toEqual([]));
