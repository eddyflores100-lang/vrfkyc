import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve,sep} from 'node:path';
execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
const worker=(await import('../dist/server/index.js')).default;
const portFlag=process.argv.indexOf('--port');
const port=Number((portFlag>=0?process.argv[portFlag+1]:null)||process.env.PORT||3000);
const staticOnly=process.argv.includes('--pages');
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost:'+port);
  if(staticOnly){
   const path=resolve('pages','.'+(url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname));
   if(!path.startsWith(resolve('pages')+sep))throw Error('Invalid path');
   let data;try{data=await readFile(path)}catch{res.writeHead(404);res.end('Not found');return}
   const type=path.endsWith('.svg')?'image/svg+xml':path.endsWith('.ico')?'image/x-icon':path.endsWith('.png')?'image/png':path.endsWith('.json')?'application/json':path.endsWith('.html')?'text/html; charset=utf-8':'text/plain';
   res.setHeader('Content-Type',type);res.end(data);return;
  }
  const chunks=[];for await(const c of req)chunks.push(c);
  const request=new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});
  // Preview must not trust user-supplied gateway identity headers.
  request.headers.delete('oai-authenticated-user-id');request.headers.delete('oai-authenticated-user-email');
  const response=await worker.fetch(request,{VRFKYC_AUTH_MODE:'sites',VRFKYC_LIVE_DATA_ENABLED:'false'});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview error')}
}).listen(port,'0.0.0.0',()=>console.log('VRFKYC preview on port '+port));
