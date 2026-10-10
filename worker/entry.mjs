import landing from '../public/index.html';
import {handle, SECURITY} from '../src/lib/vrfkyc/core.mjs';
export default {async fetch(request,env){const path=new URL(request.url).pathname;if(request.method==='GET'&&(path==='/'||path==='/index.html'))return new Response(landing,{headers:{...SECURITY,'Content-Type':'text/html; charset=utf-8'}});if(path==='/robots.txt')return new Response('User-agent: *\nAllow: /\nDisallow: /api/screen\nDisallow: /api/context\n',{headers:{'Content-Type':'text/plain'}});return handle(request,env)}};
