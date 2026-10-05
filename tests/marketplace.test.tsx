import {render,screen} from '@testing-library/react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({user:null as null|{id:string;app_metadata:{role?:string}},loading:false,name:'Your account',initial:'Y',signOut:vi.fn()}));
vi.mock('@/components/auth-provider',()=>({useAuth:()=>state}));
vi.mock('@/lib/supabase',()=>({configured:false,browserDb:vi.fn()}));
vi.mock('@/components/opportunity-map',()=>({OpportunityMap:()=>null}));
import {Marketplace} from '../components/marketplace';
function mount(){render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><Marketplace page="explore"/></QueryClientProvider>);}
it('keeps the original hero and the updated search button',()=>{mount();expect(screen.getByRole('heading',{name:/Extra income/})).toBeInTheDocument();expect(screen.getByRole('textbox',{name:'Search location'})).toBeInTheDocument();expect(screen.getByRole('button',{name:'Search'})).toHaveClass('search-submit');});
beforeEach(()=>{state.user=null;state.loading=false;state.name='Your account';state.initial='Y';});
it('renders the actual signed-in sidebar without the guest prompt',()=>{state.user={id:'u',app_metadata:{}};state.name='Alex';state.initial='A';mount();expect(screen.getByText('Signed in')).toBeInTheDocument();expect(screen.getByText('Alex')).toBeInTheDocument();expect(screen.queryByText('Sign in to get started')).not.toBeInTheDocument();expect(screen.getByText('Sign out')).toBeInTheDocument();});
it('shows the guest prompt only when signed out',()=>{mount();expect(screen.getByText('Sign in to get started')).toBeInTheDocument();expect(screen.queryByText('Sign out')).not.toBeInTheDocument();});
it('shows a loading label while checking the account',()=>{state.loading=true;mount();expect(screen.getByText('Checking session')).toBeInTheDocument();expect(screen.queryByText('Sign in to get started')).not.toBeInTheDocument();});
it('only exposes admin navigation for an admin account',()=>{state.user={id:'u',app_metadata:{role:'admin'}};mount();expect(screen.getByText('Review listings →')).toHaveAttribute('href','/admin');});
it('does not expose admin navigation to participants',()=>{state.user={id:'u',app_metadata:{}};mount();expect(screen.queryByText('Review listings →')).not.toBeInTheDocument();});
