'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
export function useAutosave<T>(save:(value:T)=>Promise<void>,validate:(value:T)=>boolean,delay=700){
 const [status,setStatus]=useState('');const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);const pending=useRef<{value:T;version:number}|null>(null);const busy=useRef(false);const version=useRef(0);const mounted=useRef(true);const saveRef=useRef(save);const validateRef=useRef(validate);saveRef.current=save;validateRef.current=validate;
 const flush=useCallback(async()=>{if(busy.current||!pending.current)return;const job=pending.current;pending.current=null;busy.current=true;if(mounted.current)setStatus('Saving…');try{await saveRef.current(job.value);if(mounted.current&&job.version===version.current)setStatus('All changes saved');}catch{if(mounted.current&&job.version===version.current)setStatus('Could not save. Edit a field to retry.');}finally{busy.current=false;if(pending.current&&mounted.current)void flush();}},[]);
 const schedule=useCallback((value:T)=>{version.current++;clearTimeout(timer.current);if(!validateRef.current(value)){pending.current=null;setStatus('Complete valid fields to save');return;}pending.current={value,version:version.current};setStatus('Unsaved changes');timer.current=setTimeout(()=>void flush(),delay);},[delay,flush]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;clearTimeout(timer.current);pending.current=null;};},[]);
 return {status,schedule,flush};
}
