import offers from './data/provider-offers.json';

export type ProviderOffer={kind:string;label:string;note:string;source:string;checkedAt:string;expiresAt:string;maximum:number|null;basis:string|null};
// Offers are reviewed against the original center page, not a provider-wide banner.
export function providerOffer(externalId:string|null|undefined,sourceUrl:string,type:string,now=Date.now()):ProviderOffer|null {
 const key=externalId?.match(/^official-location:(https:\/\/www\.biolifeplasma\.com\/locations\/[^:]+):/)?.[1];
 const offer=(key&&type==='PLASMA'?offers.centers[key as keyof typeof offers.centers]:null)??(type==='EGG'&&sourceUrl==='https://www.fairfaxeggbank.com/egg-donor-requirements/'?offers.fairfaxEgg:type==='PLASMA'&&sourceUrl==='https://www.octapharmaplasma.com/new-donors/'?offers.octapharma:null);
 return offer&&now<=Date.parse(offer.expiresAt)?offer:null;
}
