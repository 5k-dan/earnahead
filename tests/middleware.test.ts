// @vitest-environment node
import {expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
vi.mock('@supabase/ssr',()=>({createServerClient:()=>({auth:{getUser:async()=>({})}})}));
import {middleware} from '../middleware';
it('rejects cross-origin writes before session handling',async()=>{expect((await middleware(new NextRequest('http://localhost/api/profile',{method:'POST',headers:{origin:'https://other.example'}}))).status).toBe(403);});
it('bounds declared request size',async()=>{expect((await middleware(new NextRequest('http://localhost/api/profile',{method:'POST',headers:{'content-length':'20000'}}))).status).toBe(413);});
it('prevents shared caching of private pages',async()=>{expect((await middleware(new NextRequest('http://localhost/profile'))).headers.get('Cache-Control')).toBe('private, no-store');});
