'use client';
import {useEffect,useState} from 'react';
export function nextSearchRadius(radius:string){return radius==='25'?'50':radius==='50'?'100':null;}
export function useAutoRadius({searchKey,radius,ready,count,setRadius}:{searchKey:string|null;radius:string;ready:boolean;count:number;setRadius:(value:string)=>void}){
 const [expansion,setExpansion]=useState<{key:string;from:string}|null>(null);
 useEffect(()=>{const next=nextSearchRadius(radius);if(!searchKey||!ready||count>0||!next)return;setExpansion(previous=>previous?.key===searchKey?previous:{key:searchKey,from:radius});setRadius(next);},[searchKey,radius,ready,count,setRadius]);
 return expansion?.key===searchKey&&Number(radius)>Number(expansion.from)?`No matching listings within ${expansion.from} miles. Search expanded to ${radius} miles.`:'';
}
