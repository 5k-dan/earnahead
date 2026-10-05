// @vitest-environment node
import {beforeEach,expect,it,vi} from 'vitest';
const mock=vi.hoisted(()=>({cookies:vi.fn(),create:vi.fn(),set:vi.fn()}));
vi.mock('next/headers',()=>({cookies:mock.cookies}));
vi.mock('@supabase/ssr',()=>({createServerClient:mock.create}));
import {serverDb} from '../lib/server';
beforeEach(()=>{vi.clearAllMocks();mock.cookies.mockResolvedValue({getAll:()=>[{name:'session',value:'test-cookie'}],set:mock.set});mock.create.mockReturnValue({auth:{}});});
it('awaits Next.js asynchronous cookie storage before creating the session client',async()=>{await serverDb();const options=mock.create.mock.calls[0][2];expect(options.cookies.getAll()).toEqual([{name:'session',value:'test-cookie'}]);});
it('persists refreshed cookies from route handlers',async()=>{await serverDb();const options=mock.create.mock.calls[0][2];options.cookies.setAll([{name:'session',value:'updated',options:{httpOnly:true}}]);expect(mock.set).toHaveBeenCalledWith('session','updated',{httpOnly:true});});
it('tolerates read-only cookie stores on server-rendered pages',async()=>{mock.set.mockImplementation(()=>{throw new Error('Read-only');});await serverDb();expect(()=>mock.create.mock.calls[0][2].cookies.setAll([{name:'session',value:'updated',options:{}}])).not.toThrow();});
