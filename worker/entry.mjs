import {handle,SECURITY} from './core.mjs';
import html from './landing.html';
import faviconSvg from '../assets/favicon.svg';
import faviconIco from '../assets/favicon.ico';
import appleTouchIcon from '../assets/apple-touch-icon.png';

const icons={
 '/favicon.svg':[faviconSvg,'image/svg+xml'],
 '/favicon.ico':[faviconIco,'image/x-icon'],
 '/apple-touch-icon.png':[appleTouchIcon,'image/png']
};

export default {
 async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(['GET','HEAD'].includes(request.method)&&['/','/index.html','/site'].includes(path))return new Response(request.method==='HEAD'?null:html,{headers:{...SECURITY,'Content-Type':'text/html; charset=utf-8'}});
  if(path==='/robots.txt')return new Response('User-agent: *\nAllow: /\nDisallow: /api/screen\nDisallow: /api/context\n',{headers:{'Content-Type':'text/plain'}});
  if(['GET','HEAD'].includes(request.method)&&Object.hasOwn(icons,path)){
   const [body,type]=icons[path];
   return new Response(request.method==='HEAD'?null:body,{headers:{...SECURITY,'Content-Type':type,'Cache-Control':'public, max-age=86400'}});
  }
  return handle(request,env);
 }
};
