import places from './data/us-places.json';
const states:Record<string,string>={AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'};
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const records=(places as [string,string,number,number][]).map(([name,state,lat,lon])=>{const city=name.replace(/ (city and borough|city|town|village|borough|CDP|municipality)$/i,'').replace(/^Urban Honolulu$/,'Honolulu');return {name:`${city}, ${state}`,city:normalize(city),state,lat,lon};});
export function searchUSCities(query:string){
 let city=normalize(query),state:string|undefined;
 for(const [code,name] of Object.entries(states).sort((a,b)=>b[1].length-a[1].length))for(const suffix of [normalize(name),code.toLowerCase()])if(city.endsWith(' '+suffix)){state=code;city=city.slice(0,-suffix.length).trim();break;}
 if(!city)return [];
 const candidates=records.filter(r=>(!state||r.state===state)&&r.city===city);
 const results=candidates.length?candidates:records.filter(r=>(!state||r.state===state)&&r.city.startsWith(city));
 return results.slice(0,6).map(({name,lat,lon})=>({name,lat,lon}));
}
