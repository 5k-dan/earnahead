'use client';
import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshCw} from 'lucide-react';
export function FacilitySources(){
 const cache=useQueryClient();const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');
 async function run(){if(busy)return;setBusy(true);let total=0,skipped=0,after:string|undefined;
  try{do{setStatus(`Checking official provider sources… ${total} listings prepared.`);const response=await fetch('/api/admin/source-facilities',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({after})});const result=await response.json();if(!response.ok)throw new Error(result.error);total+=result.sourced;skipped+=result.skipped;after=result.nextCursor??undefined;}while(after);setStatus(`${total} source-complete listings prepared for Approve all. ${skipped} need manual sources or could not be confirmed.`);}catch(error){setStatus(error instanceof Error?error.message:'Source lookup failed.');}finally{setBusy(false);void cache.invalidateQueries({queryKey:['review-queue']});}
 }
 return <section className="import-panel" aria-busy={busy}><div><h2>Find official provider terms</h2><p>Automatically checks supported plasma, sperm, and egg providers and saves published preliminary terms. Location-specific promotions are not used as general pay rates. Other providers remain hidden for manual review.</p></div><button className="primary" disabled={busy} onClick={()=>void run()}><RefreshCw size={16} className={busy?'sync-spinner':''}/>{busy?'Checking sources…':'Find provider sources'}</button>{busy&&<div className="sync-progress" role="progressbar" aria-label="Checking provider sources"><span/></div>}<p role="status">{status}</p><small>Keep this page open. Review prepared sources, then use Approve all to publish.</small></section>;
}
