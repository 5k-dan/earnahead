import {render,screen} from '@testing-library/react';
import {expect,it} from 'vitest';
import {NationalDonorPrograms} from '../components/national-donor-programs';
const props={category:'',publishedOnly:false,payment:'ALL',now:Date.parse('2026-10-05')};
it('separates nationwide travel from nearby facilities and links original terms',()=>{render(<NationalDonorPrograms {...props}/>);expect(screen.getByText(/Travel required · All 50 states/)).toBeInTheDocument();expect(screen.getByRole('link')).toHaveAttribute('href','https://www.fairfaxeggbank.com/egg-donor-travel-program/');expect(screen.queryByText(/miles away/)).not.toBeInTheDocument();});
it.each([{category:'PLASMA'},{category:'SPERM'},{publishedOnly:true},{payment:'PER_MONTH'},{now:Date.parse('2026-11-05')}])('respects filters and expires unreviewed sources: %j',override=>{const {container}=render(<NationalDonorPrograms {...props} {...override}/>);expect(container).toBeEmptyDOMElement();});
