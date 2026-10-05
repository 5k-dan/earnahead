'use client';
import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {useAuth} from './auth-provider';
export function AreaImport({lat,lon}:{lat:number;lon:number}){
 const {user}=useAuth();const cache=useQueryClient();const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');
 if(user?.app_metadata.role!=='admin')return null;
 async function run(){if(busy)return;setBusy(true);let count=0;const key=`earnahead:area-import:${user?.id}:${lat}:${lon}`;try{let token:string|undefined;try{token=localStorage.getItem(key)??undefined;}catch{}let pages=0;do{setStatus(`Importing nearby studies… ${count} new listings saved.`);const response=await fetch('/api/admin/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source:'trials',scope:'nearby',lat,lon,pageToken:token})});const data=await response.json();if(!response.ok)throw new Error(data.error??'Import failed.');count+=data.imported??0;token=data.nextPageToken;try{if(token)localStorage.setItem(key,token);else localStorage.removeItem(key);}catch{}pages++;}while(token&&pages<100);setStatus(`${count} new nearby listings saved for review. ${token?'More pages remain; run again to continue.':'Open Review listings to check and approve their sources.'}`);void cache.invalidateQueries({queryKey:['review-queue']});}catch(error){setStatus(`${count} listings saved. ${error instanceof Error?error.message:'Import failed.'}`);}finally{setBusy(false);}}
 return <div className="area-import"><p>Admin: expand coverage around this search location.</p><button className="primary" disabled={busy} onClick={()=>void run()}>{busy?'Importing…':'Import nearby studies for review'}</button>{busy&&<div className="sync-progress" role="progressbar" aria-label="Importing nearby studies"><span/></div>}<p role="status">{status}</p><small>Searches ClinicalTrials.gov within 50 miles. Payment is not confirmed; new listings stay hidden until reviewed.</small></div>;
}
