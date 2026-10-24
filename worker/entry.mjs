import {handle,SECURITY} from './core.mjs';
import html from './landing.html';

export default {
 async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(['GET','HEAD'].includes(request.method)&&['/','/index.html','/site'].includes(path))return new Response(request.method==='HEAD'?null:html,{headers:{...SECURITY,'Content-Type':'text/html; charset=utf-8'}});
  if(path==='/robots.txt')return new Response('User-agent: *\nAllow: /\nDisallow: /api/screen\nDisallow: /api/context\n',{headers:{'Content-Type':'text/plain'}});
  if(path==='/favicon.ico')return new Response(null,{status:204});
  return handle(request,env);
 }
};
