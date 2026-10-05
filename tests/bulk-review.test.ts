import {NextRequest} from 'next/server';
// @vitest-environment node
import {beforeEach,expect,it,vi} from 'vitest';
const mock=vi.hoisted(()=>({user:null as null|{id:string;app_metadata:{role?:string}},rows:[] as Record<string,unknown>[],ids:[] as string[],update:vi.fn(),error:null as null|{message:string}}));
vi.mock('@/lib/server',()=>({
 serverDb:()=>({
  auth:{getUser:async()=>({data:{user:mock.user}})},
  from:()=>({
   select:()=>({eq:()=>({order:()=>({limit:()=>({gt:async()=>({data:mock.rows,error:mock.error}),then:(resolve:(v:unknown)=>unknown)=>Promise.resolve({data:mock.rows,error:mock.error}).then(resolve)})})})}),
   update:(value:unknown)=>{
    mock.update(value);
    return {in:(_field:string,ids:string[])=>{
     mock.ids=ids;
     return {eq:()=>({select:async()=>({data:ids.map(id=>({id})),error:mock.error})})};
    }};
   }
  })
 })
}));
import {POST} from '../app/api/admin/bulk-approve/route';
const valid={id:'one',opportunity_type:'PLASMA',source_url:'https://provider.example/terms',minimum_age:18,maximum_age:null,compensation_min:null,compensation_max:null,review_status:'PENDING_REVIEW'};
beforeEach(()=>{mock.user={id:'admin',app_metadata:{role:'admin'}};mock.rows=[];mock.ids=[];mock.error=null;vi.clearAllMocks();});
it('rejects participants and guests before querying or updating',async()=>{mock.user=null;expect((await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}))).status).toBe(403);mock.user={id:'participant',app_metadata:{}};expect((await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}))).status).toBe(403);expect(mock.update).not.toHaveBeenCalled();});
it('approves only sourced valid pending listings',async()=>{mock.rows=[valid,{...valid,id:'missing',source_url:null},{...valid,id:'google',review_status:'NEEDS_SOURCE'},{...valid,id:'egg',opportunity_type:'EGG',minimum_age:18}];const response=await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}));expect(await response.json()).toEqual({approved:1,skipped:3,nextCursor:null});expect(mock.ids).toEqual(['one']);});
it('leaves published terms and compensation untouched',async()=>{mock.rows=[valid];await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}));expect(mock.update).toHaveBeenCalledWith({review_status:'APPROVED',active:true,verified:true,source_checked_at:expect.any(String)});expect(mock.rows[0].compensation_min).toBeNull();});
it('reports an empty queue without issuing updates',async()=>{expect(await(await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}))).json()).toEqual({approved:0,skipped:0,nextCursor:null});expect(mock.update).not.toHaveBeenCalled();});
it('does not hide database failures behind a success response',async()=>{mock.error={message:'Database unavailable'};expect((await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}))).status).toBe(500);expect(mock.update).not.toHaveBeenCalled();});
it('splits hundreds of UUIDs into bounded update requests',async()=>{mock.rows=Array.from({length:442},(_,i)=>({...valid,id:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`}));const result=await(await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}))).json();expect(result.approved).toBe(442);expect(mock.update).toHaveBeenCalledTimes(9);expect(mock.ids).toHaveLength(42);});

it('advances past a full page of incomplete rows rather than getting stuck',async()=>{mock.rows=Array.from({length:1000},(_,i)=>({...valid,id:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,source_url:null}));const result=await(await POST(new NextRequest("http://localhost/api/admin/bulk-approve",{method:"POST",body:"{}"}))).json();expect(result.approved).toBe(0);expect(result.nextCursor).toBe(mock.rows[999].id);expect(mock.update).not.toHaveBeenCalled();});
