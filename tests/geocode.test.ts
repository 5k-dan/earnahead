// @vitest-environment node
import {beforeEach,afterEach,expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
import {GET} from '../app/api/geocode/route';
const fetchMock=vi.fn();
beforeEach(()=>vi.stubGlobal('fetch',fetchMock));afterEach(()=>{vi.unstubAllGlobals();fetchMock.mockReset();});
it('rejects blank input before sending a provider request',async()=>{expect((await GET(new NextRequest('http://localhost:3000/api/geocode?q='))).status).toBe(400);expect(fetchMock).not.toHaveBeenCalled();});
it('resolves city searches to selectable coordinates',async()=>{fetchMock.mockResolvedValue({ok:true,json:async()=>({results:[{name:'Atlanta',admin1:'Georgia',latitude:33.749,longitude:-84.388}]})});const response=await GET(new NextRequest('http://localhost:3000/api/geocode?q=Atlanta'));expect(await response.json()).toEqual({places:[{name:'Atlanta, Georgia',lat:33.749,lon:-84.388}]});});
it('resolves US ZIP codes through the postal endpoint',async()=>{fetchMock.mockResolvedValue({ok:true,json:async()=>({places:[{'place name':'Atlanta','state abbreviation':'GA',latitude:'33.749',longitude:'-84.388'}]})});const response=await GET(new NextRequest('http://localhost:3000/api/geocode?q=30303'));expect((await response.json()).places[0].name).toBe('Atlanta, GA');expect(fetchMock.mock.calls[0][0]).toBe('https://api.zippopotam.us/us/30303');});
it('handles unknown ZIP codes',async()=>{fetchMock.mockResolvedValue({ok:false});expect((await GET(new NextRequest('http://localhost:3000/api/geocode?q=00000'))).status).toBe(404);});
it('handles empty city results without inventing coordinates',async()=>{fetchMock.mockResolvedValue({ok:true,json:async()=>({})});expect(await(await GET(new NextRequest('http://localhost:3000/api/geocode?q=NoSuchCity'))).json()).toEqual({places:[]});});
it('handles network failures',async()=>{fetchMock.mockRejectedValue(new Error('offline'));expect((await GET(new NextRequest('http://localhost:3000/api/geocode?q=Atlanta'))).status).toBe(503);});
