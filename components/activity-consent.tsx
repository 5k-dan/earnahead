'use client';
import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {useAuth} from './auth-provider';
import {useActivityPreference} from './activity-tracking';
export function ActivityConsent(){
 const {user}=useAuth();const query=useActivityPreference();const cache=useQueryClient();const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');if(!user)return null;
 return <section className="profile-panel"><h2>Optional usage analytics</h2><p>Help improve EarnAhead by sharing basic actions, such as opening a listing or clicking a bookmark. We do not record which medical listing you viewed, search text, precise location, health information, or form contents. Administrators can see these actions associated with your account for up to 90 days.</p><label className="checkbox-label"><input type="checkbox" checked={query.data===true} disabled={busy||query.isPending||query.isError} onChange={async e=>{const enabled=e.target.checked;setBusy(true);try{const response=await fetch('/api/activity/preferences',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled})});if(!response.ok)throw new Error();cache.setQueryData(['activity-preference',user.id],enabled);setStatus(enabled?'Usage analytics enabled.':'Usage analytics disabled; previously recorded optional actions removed.');}catch{setStatus('Could not save your preference. Try again.');}finally{setBusy(false);}}}/>Share basic usage activity (off by default)</label><p>Turning this off removes previous optional action logs. Basic account creation records support account administration.</p>{query.isError&&<p>Optional analytics are currently unavailable.</p>}<p role="status" aria-live="polite">{busy?'Saving…':status}</p></section>;
}
