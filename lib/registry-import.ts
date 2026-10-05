import {createHash} from 'node:crypto';
import {z} from 'zod';
const age=(value:string|undefined,round:(n:number)=>number)=>{const match=value?.match(/^(\d+) (Years|Months|Weeks|Days)$/);if(!match)return null;const divisors:Record<string,number>={Years:1,Months:12,Weeks:52.1786,Days:365.25};return round(Number(match[1])/divisors[match[2]]);};
export const registryStudy=z.object({protocolSection:z.object({identificationModule:z.object({nctId:z.string().regex(/^NCT\d+$/),briefTitle:z.string().min(1)}),statusModule:z.object({overallStatus:z.string()}),sponsorCollaboratorsModule:z.object({leadSponsor:z.object({name:z.string()})}).optional(),eligibilityModule:z.object({minimumAge:z.string().optional(),maximumAge:z.string().optional(),sex:z.string().optional(),eligibilityCriteria:z.string().optional()}).optional(),contactsLocationsModule:z.object({locations:z.array(z.object({facility:z.string().optional(),city:z.string().optional(),state:z.string().optional(),country:z.string().optional(),status:z.string().optional(),geoPoint:z.object({lat:z.number().min(-90).max(90),lon:z.number().min(-180).max(180)}).optional()})).optional()}).optional()})});
export function registryListings(value:unknown,lat?:number,lon?:number){
 const parsed=registryStudy.safeParse(value);if(!parsed.success)return [];
 const p=parsed.data.protocolSection;if(p.statusModule.overallStatus!=='RECRUITING')return [];
 const minimum=Math.max(18,age(p.eligibilityModule?.minimumAge,Math.ceil)??18);const maximum=age(p.eligibilityModule?.maximumAge,Math.floor);if(maximum!==null&&maximum<minimum)return [];
 return (p.contactsLocationsModule?.locations??[]).flatMap(f=>{
  if(!f.geoPoint||f.country!=='United States'||(f.status&&f.status!=='RECRUITING'))return [];
  if(lat!==undefined&&lon!==undefined){const rad=(n:number)=>n*Math.PI/180;const dlat=rad(f.geoPoint.lat-lat),dlon=rad(f.geoPoint.lon-lon);const h=Math.sin(dlat/2)**2+Math.cos(rad(lat))*Math.cos(rad(f.geoPoint.lat))*Math.sin(dlon/2)**2;if(3958.8*2*Math.asin(Math.sqrt(Math.min(1,h)))>50)return [];}
  const fingerprint=createHash('sha256').update(JSON.stringify([f.facility,f.city,f.state,f.geoPoint])).digest('hex').slice(0,20);
  return [{organization:p.sponsorCollaboratorsModule?.leadSponsor.name??'Sponsor not published',facility:f.facility??'Research facility',address:[f.city,f.state,f.country].filter(Boolean).join(', '),lat:f.geoPoint.lat,lon:f.geoPoint.lon,title:p.identificationModule.briefTitle,type:'CLINICAL_TRIAL',min:minimum,max:maximum,payMax:null,basis:null,source:`https://clinicaltrials.gov/study/${p.identificationModule.nctId}`,external:`${p.identificationModule.nctId}:${fingerprint}`,requirements:[p.eligibilityModule?.sex?`Published sex requirement: ${p.eligibilityModule.sex}`:null,p.eligibilityModule?.eligibilityCriteria].filter(Boolean).join('\n')}];
 });
}
