'use client';
import {useState} from 'react';
import {useAuth} from './auth-provider';
export function AccountDeletion(){
 const {signOut,user}=useAuth();const [confirmation,setConfirmation]=useState('');const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');
 return <section className="profile-panel account-danger"><h2>Delete your account</h2><p>This permanently deletes your account, profile, saved items, applications, earnings, and listing reports. Public provider listings remain. Type DELETE to confirm.</p><form onSubmit={async e=>{
  e.preventDefault();setBusy(true);
  try{
   const response=await fetch('/api/account',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({confirmation})});if(!response.ok)throw new Error();
   try{if(user){for(let index=localStorage.length-1;index>=0;index--){const key=localStorage.key(index);if(key&&(key===`earnahead:search:${user.id}`||key.startsWith(`earnahead:imports:${user.id}:`)))localStorage.removeItem(key);}}await signOut();}finally{window.location.assign('/explore');}
  }catch{setStatus('Account deletion failed. Please try again or contact support.');setBusy(false);}
 }}><label>Confirmation<input autoComplete="off" value={confirmation} onChange={e=>setConfirmation(e.target.value)} required pattern="DELETE"/></label><button className="primary" disabled={busy||confirmation!=='DELETE'}>{busy?'Deleting…':'Permanently delete account'}</button></form><p role="status">{status}</p></section>;
}
