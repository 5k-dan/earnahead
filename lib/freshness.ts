export function freshnessLabel(value:string|null|undefined,now=Date.now()){
 const timestamp=value?Date.parse(value):NaN;
 if(!Number.isFinite(timestamp))return 'Source check date not recorded';
 const days=Math.max(0,Math.floor((now-timestamp)/86400000));
 return days>30?`Source checked ${days} days ago · confirm current terms`:`Source checked ${days===0?'today':`${days} days ago`}`;
}
