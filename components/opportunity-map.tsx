'use client';
import {useEffect,useRef} from 'react';
import 'leaflet/dist/leaflet.css';
export function OpportunityMap({lat,lon,items,onSelect}:{lat:number;lon:number;items:{id:string;title:string;latitude:number;longitude:number}[];onSelect:(id:string)=>void}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{let disposed=false;let map:import('leaflet').Map|undefined;void import('leaflet').then(L=>{if(disposed||!ref.current)return;map=L.map(ref.current).setView([lat,lon],11);L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILE_URL||'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);items.forEach(item=>{const pin=L.circleMarker([item.latitude,item.longitude],{radius:9,color:'#fff',weight:3,fillColor:'#9875af',fillOpacity:1}).addTo(map!);const label=document.createElement('span');label.textContent=item.title;pin.bindTooltip(label);pin.on('click',()=>onSelect(item.id));});});return()=>{disposed=true;map?.remove();};},[lat,lon,items,onSelect]);
 return <div ref={ref} style={{height:380,borderRadius:14,border:'1px solid #e5dce9',marginBottom:20,zIndex:0}} aria-label="Map of nearby opportunities"/>;
}
