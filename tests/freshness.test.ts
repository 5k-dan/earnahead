import {expect,it} from 'vitest';
import {freshnessLabel} from '../lib/freshness';
it('never invents a source check date',()=>{expect(freshnessLabel(null)).toBe('Source check date not recorded');expect(freshnessLabel('bad-date')).toBe('Source check date not recorded');});
it('marks old source checks and handles future clocks conservatively',()=>{const now=Date.parse('2026-10-05T00:00:00Z');expect(freshnessLabel('2026-08-01T00:00:00Z',now)).toContain('confirm current terms');expect(freshnessLabel('2026-10-06T00:00:00Z',now)).toBe('Source checked today');});
