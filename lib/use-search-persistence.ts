'use client';
import {useEffect,useRef,useState} from 'react';
import {z} from 'zod';
const schema=z.object({location:z.string().max(150),coords:z.object({lat:z.number().min(-90).max(90),lon:z.number().min(-180).max(180)}).nullable(),radius:z.enum(['10','25','50','100']),discovery:z.enum(['donations','research']).optional(),category:z.enum(['','PLASMA','SPERM','EGG','CLINICAL_TRIAL','RESEARCH_STUDY','OTHER']),view:z.enum(['list','map']),publishedOnly:z.boolean(),payment:z.enum(['ALL','PER_VISIT','PER_MONTH','TOTAL_PROGRAM','UNSPECIFIED','UNPUBLISHED']).optional(),sort:z.enum(['distance','compensation'])});
export type SearchSettings=z.infer<typeof schema>;
function donationFirst(value:SearchSettings):SearchSettings {
 const wasResearch=value.discovery==='research'||['CLINICAL_TRIAL','RESEARCH_STUDY','OTHER'].includes(value.category);
 return wasResearch?{...value,discovery:'donations',category:'',payment:'ALL'}:value;
}
export function useSearchPersistence(userId:string|undefined,value:SearchSettings,restore:(value:SearchSettings)=>void){const key=`earnahead:search:${userId??'guest'}`;const [loaded,setLoaded]=useState('');const callback=useRef(restore);callback.current=restore;
 useEffect(()=>{try{const raw=localStorage.getItem(key);const parsed=raw?schema.safeParse(JSON.parse(raw)):null;callback.current(parsed?.success?donationFirst(parsed.data):{location:'',coords:null,radius:'25',discovery:'donations',category:'',view:'list',publishedOnly:false,sort:'distance'});}catch{callback.current({location:'',coords:null,radius:'25',category:'',view:'list',publishedOnly:false,sort:'distance'});}setLoaded(key);},[key]);
 useEffect(()=>{if(loaded===key)try{localStorage.setItem(key,JSON.stringify(value));}catch{}},[key,loaded,value]);
}
