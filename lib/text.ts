// Repair known UTF-8 punctuation decoded as Windows-1252. Leave other text intact.
const replacements:[string,string][]=[
 ['\u00c2\u00b7','\u00b7'],['\u00c2\u00ae','\u00ae'],['\u00c2\u00a0',' '],['\u00c2\u00a9','\u00a9'],
 ['\u00e2\u20ac\u201c','\u2013'],['\u00e2\u20ac\u201d','\u2014'],['\u00e2\u20ac\u2122','\u2019'],['\u00e2\u20ac\u02dc','\u2018'],
 ['\u00e2\u20ac\u0153','\u201c'],['\u00e2\u20ac\u009d','\u201d'],['\u00e2\u20ac\u00a6','\u2026']
];
export function repairText(value:string):string{
 let result=value;
 for(let pass=0;pass<2;pass++)for(const [broken,correct] of replacements)result=result.split(broken).join(correct);
 return result;
}
