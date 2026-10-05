import {expect,it} from 'vitest';
import {compensationDisplay} from '../lib/opportunities';
const blank={compensation_min:null,compensation_max:null,compensation_basis:null,opportunity_type:'PLASMA',source_url:'https://www.cslplasma.com/faq'};
it('labels reviewed variable-rate providers without inventing a number',()=>expect(compensationDisplay(blank)).toBe('Rate varies by center'));
it('keeps unknown and research sources unpublished',()=>{expect(compensationDisplay({...blank,source_url:'https://example.com'})).toBe('Not published');expect(compensationDisplay({...blank,opportunity_type:'CLINICAL_TRIAL'})).toBe('Not published');});
it('shows full cycle starting pay while retaining its lower bound',()=>expect(compensationDisplay({...blank,opportunity_type:'EGG',compensation_min:10000,compensation_basis:'TOTAL_PROGRAM'})).toBe('From $10000 / full cycle'));
it('retains explicit visit ranges instead of using the variable label',()=>expect(compensationDisplay({...blank,compensation_min:100,compensation_max:300,compensation_basis:'PER_VISIT'})).toBe('$100–$300 / visit'));
