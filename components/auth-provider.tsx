'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {useQuery,useQueryClient} from '@tanstack/react-query';
import {browserDb,configured} from '@/lib/supabase';
type AuthState={user:User|null;loading:boolean;name:string;initial:string;signOut:()=>Promise<void>};
const AuthContext=createContext<AuthState>({user:null,loading:true,name:'Your account',initial:'Y',signOut:async()=>{}});
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(configured);const cache=useQueryClient();
 useEffect(()=>{if(!configured)return;const db=browserDb();let active=true;let revision=0;let identity:string|null=null;void db.auth.getUser().then(({data})=>{if(active&&revision===0){identity=data.user?.id??null;setUser(data.user);setLoading(false);}}).catch(()=>{if(active&&revision===0)setLoading(false);});const {data:{subscription}}=db.auth.onAuthStateChange((_event,session)=>{if(!active)return;revision++;const next=session?.user??null;if(identity!==next?.id){cache.clear();identity=next?.id??null;}setUser(next);setLoading(false);});return()=>{active=false;subscription.unsubscribe();};},[cache]);
 const {data:profile}=useQuery({queryKey:['identity',user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await browserDb().from('user_profiles').select('name').eq('user_id',user!.id).maybeSingle();if(error)throw error;return data;}});
 const name=profile?.name||user?.user_metadata?.full_name||user?.email?.split('@')[0]||'Your account';
 async function signOut(){const {error}=await browserDb().auth.signOut();if(error)throw error;setUser(null);cache.clear();window.location.href='/explore';}
 return <AuthContext.Provider value={{user,loading,name,initial:name.slice(0,1).toUpperCase(),signOut}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
