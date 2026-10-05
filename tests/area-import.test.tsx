import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({role:'admin'}));
vi.mock('@/components/auth-provider',()=>({useAuth:()=>({user:{id:'admin',app_metadata:{role:state.role}}})}));
vi.mock('@tanstack/react-query',()=>({useQueryClient:()=>({invalidateQueries:vi.fn()})}));
import {AreaImport} from '../components/area-import';
beforeEach(()=>{state.role='admin';localStorage.clear();vi.unstubAllGlobals();});
it('hides area imports from non-admins',()=>{state.role='participant';render(<AreaImport lat={40.7997} lon={-77.8623}/>);expect(screen.queryByRole('button')).not.toBeInTheDocument();});
it('imports the selected coordinates and leaves publication to review',async()=>{const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({imported:2})});vi.stubGlobal('fetch',fetcher);render(<AreaImport lat={40.7997} lon={-77.8623}/>);fireEvent.click(screen.getByRole('button',{name:'Import nearby studies for review'}));await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('2 new nearby listings saved for review'));expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({source:'trials',scope:'nearby',lat:40.7997,lon:-77.8623});});
