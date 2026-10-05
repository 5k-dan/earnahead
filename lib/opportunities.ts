import {repairText} from './text';
export type Opportunity={source_checked_at?:string|null;id:string;title:string;opportunity_type:string;compensation_min:number|null;compensation_max:number|null;compensation_basis?:string|null;minimum_age:number;maximum_age:number|null;source_url:string;distance_miles:number;latitude:number;longitude:number;organization_name?:string;facility_name?:string;address?:string};
export type OpportunityGroup=Opportunity&{nearbyLocations:Opportunity[]};
export function groupOpportunities(rows:Opportunity[]):OpportunityGroup[]{
 const groups=new Map<string,Opportunity[]>();
 for(const original of rows){const row={...original,title:repairText(original.title),organization_name:original.organization_name?repairText(original.organization_name):undefined,facility_name:original.facility_name?repairText(original.facility_name):undefined,address:original.address?repairText(original.address):undefined};const key=JSON.stringify([row.source_url,row.title.trim().toLowerCase(),row.opportunity_type,row.compensation_min,row.compensation_max,row.compensation_basis,row.minimum_age,row.maximum_age]);const group=groups.get(key)??[];if(!group.some(r=>r.id===row.id))group.push(row);groups.set(key,group);}
 return [...groups.values()].map(group=>{const nearbyLocations=[...group].sort((a,b)=>a.distance_miles-b.distance_miles);return {...nearbyLocations[0],nearbyLocations};});
}
export const opportunityLabels:Record<string,string>={PLASMA:'Plasma donation',SPERM:'Sperm donor program',EGG:'Egg donor program',CLINICAL_TRIAL:'Clinical trial',RESEARCH_STUDY:'Research study',OTHER:'Medical opportunity'};

export const paymentLabels:Record<string,string>={PER_VISIT:'Per visit',PER_MONTH:'Per month',TOTAL_PROGRAM:'Total program',UNSPECIFIED:'Payment period not published',UNPUBLISHED:'Compensation not published'};
export function paymentCategory(item:Opportunity):string{
 if(item.compensation_min===null&&item.compensation_max===null)return 'UNPUBLISHED';
 return ['PER_VISIT','PER_MONTH','TOTAL_PROGRAM'].includes(item.compensation_basis??'')?item.compensation_basis!:'UNSPECIFIED';
}
export function resultSections(items:OpportunityGroup[],sort:string){
 const categories=[{title:'Donation programs',description:'Compare plasma, sperm, and egg donor programs near you.',types:['PLASMA','SPERM','EGG']},{title:'Clinical trials and research',description:'Recruiting studies. Compensation is only shown when the provider publishes it.',types:['CLINICAL_TRIAL','RESEARCH_STUDY']},{title:'Other medical opportunities',description:'Review the provider’s published terms before applying.',types:['OTHER']}];
 return categories.flatMap(category=>{
  const rows=items.filter(item=>category.types.includes(item.opportunity_type));
  if(!rows.length)return [];
  const keys=sort==='compensation'?Object.keys(paymentLabels):['ALL'];
  return keys.flatMap(key=>{const matching=rows.filter(item=>key==='ALL'||paymentCategory(item)===key).sort((a,b)=>sort==='compensation'?(b.compensation_max??b.compensation_min??-1)-(a.compensation_max??a.compensation_min??-1)||a.distance_miles-b.distance_miles:a.distance_miles-b.distance_miles);return matching.length?[{title:category.title,description:category.description,paymentLabel:key==='ALL'?null:paymentLabels[key],items:matching}]:[];});
 });
}
