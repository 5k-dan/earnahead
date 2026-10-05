// @vitest-environment node
import {beforeEach,describe,expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
const mock=vi.hoisted(()=>({user:null as null|{id:string;app_metadata:{role?:string}},rpc:vi.fn(),upsert:vi.fn(),update:vi.fn(),single:vi.fn()}));
vi.mock('@/lib/supabase',()=>({configured:true}));
vi.mock('@/lib/server',()=>({serverDb:()=>({auth:{getUser:async()=>({data:{user:mock.user}})},rpc:mock.rpc,from:()=>({upsert:mock.upsert,select:()=>({eq:()=>({single:mock.single})}),update:(value:unknown)=>({eq:()=>mock.update(value)})})})}));
import {GET as search} from '../app/api/opportunities/route';
import {POST as profile} from '../app/api/profile/route';
import {POST as review} from '../app/api/admin/review/route';
const request=(path:string,body:unknown)=>new NextRequest(`http://localhost:3000${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
beforeEach(()=>{vi.clearAllMocks();mock.user=null;mock.rpc.mockResolvedValue({data:[],error:null});mock.upsert.mockResolvedValue({error:null});mock.update.mockResolvedValue({error:null});mock.single.mockResolvedValue({data:{opportunity_type:'EGG'},error:null});});
describe('opportunity API',()=>{
 it('rejects invalid locations before database access',async()=>{const response=await search(new NextRequest('http://localhost:3000/api/opportunities?lat=95&lon=0'));expect(response.status).toBe(400);expect(mock.rpc).not.toHaveBeenCalled();});
 it('passes validated coordinates and radius to PostGIS',async()=>{const response=await search(new NextRequest('http://localhost:3000/api/opportunities?lat=33.749&lon=-84.388&radius=50&type=PLASMA'));expect(response.status).toBe(200);expect(mock.rpc).toHaveBeenCalledWith('nearby_opportunities',{search_latitude:33.749,search_longitude:-84.388,radius_miles:50,kind:'PLASMA'});});
 it('returns a database failure rather than a misleading empty result',async()=>{mock.rpc.mockResolvedValue({data:null,error:{message:'Unavailable'}});expect((await search(new NextRequest('http://localhost:3000/api/opportunities?lat=0&lon=0'))).status).toBe(500);});
});
describe('profile API',()=>{
 const input={name:'Alex',dob:'2000-01-01',city:'Atlanta',preferences:[]};
 it('requires a session',async()=>expect((await profile(request('/api/profile',input))).status).toBe(401));
 it('uses authenticated ownership and rejects forged ownership fields',async()=>{mock.user={id:'real-user',app_metadata:{}};expect((await profile(request('/api/profile',{...input,user_id:'another-user'}))).status).toBe(400);expect(mock.upsert).not.toHaveBeenCalled();});
 it('saves only basic permitted fields with session ownership',async()=>{mock.user={id:'real-user',app_metadata:{}};expect((await profile(request('/api/profile',input))).status).toBe(200);expect(mock.upsert).toHaveBeenCalledWith({user_id:'real-user',...input});});
 it('rejects impossible dates before writing',async()=>{mock.user={id:'real-user',app_metadata:{}};expect((await profile(request('/api/profile',{...input,dob:'2000-02-30'}))).status).toBe(400);expect(mock.upsert).not.toHaveBeenCalled();});
});
describe('admin review authorization',()=>{
 const id='ea000000-0000-4000-8000-000000000010';const terms={source_url:'https://provider.example/terms',minimum_age:21,maximum_age:null,compensation_min:null,compensation_max:null};
 it.each([null,{id:'participant',app_metadata:{}}])('rejects non-admin %#',async user=>{mock.user=user;expect((await review(request('/api/admin/review',{id,terms}))).status).toBe(403);expect(mock.update).not.toHaveBeenCalled();});
 it('uses stored listing type rather than a client-supplied type',async()=>{mock.user={id:'admin',app_metadata:{role:'admin'}};expect((await review(request('/api/admin/review',{id,terms:{...terms,opportunity_type:'PLASMA',minimum_age:18}}))).status).toBe(400);expect(mock.update).not.toHaveBeenCalled();});
 it('keeps missing compensation null when publishing',async()=>{mock.user={id:'admin',app_metadata:{role:'admin'}};expect((await review(request('/api/admin/review',{id,terms}))).status).toBe(200);expect(mock.update).toHaveBeenCalledWith({...terms,review_status:'APPROVED',active:true,verified:true,source_checked_at:expect.any(String)});});
 it('hides rejected listings',async()=>{mock.user={id:'admin',app_metadata:{role:'admin'}};expect((await review(request('/api/admin/review',{id,action:'reject'}))).status).toBe(200);expect(mock.update).toHaveBeenCalledWith({review_status:'REJECTED',active:false,verified:false});});
 it('rejects invalid IDs and missing sources',async()=>{mock.user={id:'admin',app_metadata:{role:'admin'}};expect((await review(request('/api/admin/review',{id:'not-a-uuid',terms}))).status).toBe(400);expect((await review(request('/api/admin/review',{id,terms:{...terms,source_url:''}}))).status).toBe(400);});
});
