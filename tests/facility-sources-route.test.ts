// @vitest-environment node
import {expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
const state=vi.hoisted(()=>({user:null as null|{app_metadata:{role:string}}}));
vi.mock('@/lib/server',()=>({serverDb:async()=>({auth:{getUser:async()=>({data:{user:state.user}})}})}));
const source=vi.hoisted(()=>vi.fn());
vi.mock('@/lib/provider-source',()=>({sourceFacilityBatch:source}));
import {POST} from '../app/api/admin/source-facilities/route';
const req=(body:unknown)=>new NextRequest('http://localhost/api/admin/source-facilities',{method:'POST',body:JSON.stringify(body)});
it('blocks unsigned and non-admin callers before sourcing',async()=>{for(const user of [null,{app_metadata:{role:'participant'}}]){state.user=user;expect((await POST(req({}))).status).toBe(403);}expect(source).not.toHaveBeenCalled();});
it('rejects arbitrary fetch URLs and invalid cursors',async()=>{state.user={app_metadata:{role:'admin'}};expect((await POST(req({url:'http://localhost'}))).status).toBe(400);expect((await POST(req({after:'bad'}))).status).toBe(400);expect(source).not.toHaveBeenCalled();});
