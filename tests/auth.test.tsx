import {act,render,screen,waitFor} from '@testing-library/react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {beforeEach,describe,expect,it,vi} from 'vitest';
import type {User} from '@supabase/supabase-js';
import {AuthProvider,useAuth} from '../components/auth-provider';
const mock=vi.hoisted(()=>({getUser:vi.fn(),onAuthStateChange:vi.fn(),signOut:vi.fn(),from:vi.fn(),unsubscribe:vi.fn()}));
vi.mock('@/lib/supabase',()=>({configured:true,browserDb:()=>({auth:mock,from:mock.from})}));
const person={id:'user-1',email:'alex@example.com',user_metadata:{},app_metadata:{}} as User;
let listener:(_event:string,session:{user:User}|null)=>void;
function Probe(){const auth=useAuth();return <div><span>{auth.loading?'Loading':auth.user?'Signed in':'Sign in to get started'}</span><b>{auth.name}</b><button onClick={()=>void auth.signOut()}>Sign out</button></div>;}
function mount(){const cache=new QueryClient({defaultOptions:{queries:{retry:false}}});render(<QueryClientProvider client={cache}><AuthProvider><Probe/></AuthProvider></QueryClientProvider>);return cache;}
beforeEach(()=>{vi.clearAllMocks();mock.getUser.mockResolvedValue({data:{user:person}});mock.onAuthStateChange.mockImplementation(cb=>{listener=cb;return{data:{subscription:{unsubscribe:mock.unsubscribe}}};});mock.from.mockReturnValue({select:()=>({eq:()=>({maybeSingle:async()=>({data:{name:'Alex'},error:null})})})});mock.signOut.mockResolvedValue({error:null});});
describe('auth state',()=>{
 it('shows the signed-in name rather than a sign-in prompt',async()=>{mount();expect(await screen.findByText('Signed in')).toBeInTheDocument();expect(await screen.findByText('Alex')).toBeInTheDocument();expect(screen.queryByText('Sign in to get started')).not.toBeInTheDocument();});
 it('updates when the session signs out and clears private cached data',async()=>{const cache=mount();await screen.findByText('Signed in');cache.setQueryData(['private-record'],{secret:true});act(()=>listener('SIGNED_OUT',null));await screen.findByText('Sign in to get started');expect(cache.getQueryData(['private-record'])).toBeUndefined();});
 it('does not erase cached data during token refresh for the same account',async()=>{const cache=mount();await screen.findByText('Signed in');cache.setQueryData(['private-record'],{secret:true});act(()=>listener('TOKEN_REFRESHED',{user:person}));expect(cache.getQueryData(['private-record'])).toEqual({secret:true});});
 it('does not let a stale initial request overwrite a newer sign-out',async()=>{let resolve!:(value:{data:{user:User}})=>void;mock.getUser.mockReturnValue(new Promise(r=>{resolve=r;}));mount();act(()=>listener('SIGNED_OUT',null));await act(async()=>resolve({data:{user:person}}));expect(screen.getByText('Sign in to get started')).toBeInTheDocument();});
 it('clears another account’s cached records on account switch',async()=>{const cache=mount();await screen.findByText('Signed in');cache.setQueryData(['private-record'],{secret:true});act(()=>listener('SIGNED_IN',{user:{...person,id:'user-2'}}));expect(cache.getQueryData(['private-record'])).toBeUndefined();});
 it('finishes loading if network authentication fails',async()=>{mock.getUser.mockRejectedValue(new Error('offline'));mount();await waitFor(()=>expect(screen.getByText('Sign in to get started')).toBeInTheDocument());});
});
