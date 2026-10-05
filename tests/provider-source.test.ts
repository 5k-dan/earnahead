import {expect,it} from 'vitest';
import {publishedProviderTerms,providerFor} from '../lib/provider-source';
const age='<p>CSL Plasma: between the ages of 18 to 74.</p>';
it('extracts only a published age range and never generalizes promotional pay',()=>expect(publishedProviderTerms('CSL Plasma','PLASMA',age,'Paid via debit card. New donors up to $999 locally.')).toMatchObject({minimum_age:18,maximum_age:74,compensation_min:null,compensation_max:null}));
it('rejects unknown providers and incorrect listing types',()=>{expect(providerFor('Unknown clinic CSL Plasma nearby','PLASMA')).toBeUndefined();expect(providerFor('CSL Plasma','EGG')).toBeUndefined();});
it('requires live age and payment evidence',()=>{expect(publishedProviderTerms('CSL Plasma','PLASMA','CSL Plasma welcome','payment')).toBeNull();expect(publishedProviderTerms('CSL Plasma','PLASMA',age,'Welcome')).toBeNull();});
it('does not extract text hidden in scripts',()=>expect(publishedProviderTerms('CSL Plasma','PLASMA',`<script>${age}</script>`,'payment')).toBeNull());
it('keeps an unpublished maximum age null',()=>expect(publishedProviderTerms('BioLife Plasma Services','PLASMA','BioLife 18 years old or older','Donor compensation')).toMatchObject({minimum_age:18,maximum_age:null,source_url:'https://www.biolifeplasma.com/donation-process/who-can-donate'}));
