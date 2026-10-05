import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publishedCompensation,ageOn,preliminaryAgeMessage} from '../lib/rules.mjs';
test('unpublished compensation is never fabricated',()=>{assert.equal(publishedCompensation(null,null),'Not published');assert.equal(publishedCompensation(null,100),'Up to $100');assert.equal(publishedCompensation(0,null),'$0');});
test('published monthly compensation always retains its payment unit',()=>{assert.equal(publishedCompensation(null,1400,'PER_MONTH'),'Up to $1400 / month');assert.equal(publishedCompensation(null,null,'PER_MONTH'),'Not published');assert.equal(publishedCompensation(50,75,'PER_VISIT'),'$50–$75 / visit');});
test('age changes only on birthday and rejects impossible DOB',()=>{assert.equal(ageOn('2008-10-06',new Date('2026-10-05T12:00:00Z')),17);assert.equal(ageOn('2008-10-05',new Date('2026-10-05T12:00:00Z')),18);assert.equal(ageOn('2008-02-30'),null);});
test('preliminary matching never establishes medical eligibility',()=>{assert.match(preliminaryAgeMessage('2000-01-01',18,null),/Final eligibility is determined by the medical provider/);assert.match(preliminaryAgeMessage('2008-10-06',18,null,new Date('2026-10-05')),/below/);assert.match(preliminaryAgeMessage('2006-10-05',21,null,new Date('2026-10-05')),/below/);assert.match(preliminaryAgeMessage(null,18,null),/date of birth/);});
