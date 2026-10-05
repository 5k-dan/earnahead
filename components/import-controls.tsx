'use client';
import {useEffect,useRef,useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshCw} from 'lucide-react';
export function ImportControls({userId}:{userId:string}){
 const cache=useQueryClient();const running=useRef(false);const started=useRef(false);const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');const [lastSync,setLastSync]=useState('');
 const key=`earnahead:imports:${userId}:atlanta`;
 async function sync(){
  if(running.current)return;running.current=true;setBusy(true);setStatus('Fetching source-backed Atlanta listings…');let count=0,existing=0;const warnings:string[]=[];
  async function request(source:string,pageToken?:string){const response=await fetch('/api/admin/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source,pageToken})});const data=await response.json();count+=data.imported??0;existing+=data.existing??0;if(!response.ok)throw new Error(data.error??'Import failed.');return data;}
  try{
   try{await request('donations');}catch(error){warnings.push(error instanceof Error?error.message:'Donation import failed.');}
   let token:string|undefined;try{token=localStorage.getItem(key+':cursor')??undefined;}catch{}
   let pages=0;
   do{const page=await request('trials',token);token=page.nextPageToken;try{if(token)localStorage.setItem(key+':cursor',token);else localStorage.removeItem(key+':cursor');}catch{}setStatus(`Saved ${count} new listings · ${existing} already imported · checking next registry page…`);pages++;}while(token&&pages<100);
   if(token)warnings.push('More registry pages remain. Click Sync listings to continue.');
   if(!warnings.length){const now=new Date().toISOString();setLastSync(now);try{localStorage.setItem(key,now);}catch{}}
   setStatus(`${count} new listings saved for review. ${existing} existing listings kept.${warnings.length?' '+warnings.join(' '):' Sync complete.'}`);
  }catch(error){setStatus(`${count} listings saved. ${error instanceof Error?error.message:'Sync interrupted.'} Click Sync listings to retry.`);}
  finally{running.current=false;setBusy(false);void cache.invalidateQueries({queryKey:['review-queue']});}
 }
 useEffect(()=>{if(started.current)return;started.current=true;let previous='';try{previous=localStorage.getItem(key)??'';}catch{}setLastSync(previous);if(!previous||!Number.isFinite(Date.parse(previous))||Date.now()-Date.parse(previous)>86400000)void sync();},[key]); // One daily sync when the reviewer opens this page.
 return <section className="import-panel"><div><h2>Atlanta source sync</h2><p>Automatically imports when you open this page, at most once a day after a successful sync. New listings stay in review.</p><small>{lastSync?`Last completed: ${new Date(lastSync).toLocaleString()}`:'No completed sync on this browser yet.'}</small></div><button className="primary" disabled={busy} onClick={()=>void sync()}><RefreshCw size={17}/>{busy?'Syncing…':'Sync listings'}</button><p role="status">{status}</p><small>ClinicalTrials.gov is fetched live. Donation programs use the five previously sourced Atlanta-area provider records; provider terms still need review.</small></section>;
}
