import {expect,it} from 'vitest';
import {repairText} from '../lib/text';
it('repairs known punctuation encoding errors',()=>{expect(repairText('Plasma Â· Smyrna')).toBe('Plasma · Smyrna');expect(repairText('LumasonÂ®')).toBe('Lumason®');});
it('preserves correct punctuation, accented names, and ordinary text',()=>{const title='Ângela · José ® research';expect(repairText(title)).toBe(title);expect(repairText('')).toBe('');});
it('is idempotent',()=>{const fixed=repairText('Donor Â· Atlanta');expect(repairText(fixed)).toBe(fixed);});
