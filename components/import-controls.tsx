'use client';
import {useEffect,useRef,useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshCw} from 'lucide-react';
export function ImportControls({userId}:{userId:string}){
 const cache=useQueryClient();const running=useRef(false);const started=useRef(false);const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');const [lastSync,setLastSync]=useState('');
 const key=`earnahead:imports:${userId}:nationwide-v1`;
 async function sync(){
  if(running.current)return;running.current=true;setBusy(true);setStatus('Fetching source-backed US listings…');let count=0,existing=0;const warnings:string[]=[];
  async function request(source:string,pageToken?:string){const response=await fetch('/api/admin/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source,pageToken,scope:'nationwide'})});const data=await response.json();count+=data.imported??0;existing+=data.existing??0;if(!response.ok)throw new Error(data.error??'Import failed.');return data;}
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
 return <section className={`import-panel ${busy?'is-syncing':''}`} aria-busy={busy}><div><h2>Nationwide source sync</h2><p>New source-backed listings are saved for review. Sync runs when you open this page after a day, or whenever you start it.</p><small>{lastSync?`Last completed: ${new Date(lastSync).toLocaleString()}`:'No completed sync on this browser yet.'}</small></div><button className="primary" disabled={busy} onClick={()=>void sync()}><RefreshCw className={busy?'sync-spinner':''} aria-hidden="true" size={17}/>{busy?'Syncing…':'Sync listings'}</button>{busy&&<div className="sync-progress" role="progressbar" aria-label="Syncing source listings"><span/></div>}<p role="status" aria-live="polite">{status}</p><small>Keep this page open while syncing. ClinicalTrials.gov is fetched live. Nationwide studies are imported for review. Donation terms currently cover sourced Atlanta-area providers; use the facility importer to expand coverage.</small></section>;
}
