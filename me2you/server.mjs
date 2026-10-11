import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = new URL('./', import.meta.url);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;const name=pathname==='/'?'index.html':pathname.slice(1);if(!['index.html','app.js','style.css','model.js'].includes(name)){res.writeHead(404);res.end('Not found');return;}const data=await readFile(new URL(name,root));res.writeHead(200,{'Content-Type':types[name.slice(name.lastIndexOf('.'))]+'; charset=utf-8','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(500);res.end('Unable to load app');}});
server.listen(Number(process.env.PORT||3100),'127.0.0.1',()=>console.log('Me 2 You preview: http://localhost:'+ (process.env.PORT||3100)));
