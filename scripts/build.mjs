import {readFile,writeFile,mkdir,rm,cp} from 'node:fs/promises';
import {LEGAL_PAGES} from '../worker/legal.mjs';
import {manifest,openapi} from '../worker/core.mjs';

const appOrigin='https://asterscreen.toastyrice32.chatgpt.site';
const domain='vrfkyc.alicelabs.site';
const html=await readFile('worker/landing.html','utf8');
const core=(await readFile('worker/core.mjs','utf8')).replace("import {LEGAL_PAGES} from './legal.mjs';",'');
const entry=(await readFile('worker/entry.mjs','utf8')).replace(/^import .*;\n/gm,'');
const bundle=core+'\nconst LEGAL_PAGES = '+JSON.stringify(LEGAL_PAGES)+';\nconst html = '+JSON.stringify(html)+';\n'+entry;
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',bundle);
await writeFile('worker/index.js',bundle);
await cp('.openai/hosting.json','dist/.openai/hosting.json');

await rm('pages',{recursive:true,force:true});await mkdir('pages',{recursive:true});
const staticHtml=html.replace('name="vrfkyc-runtime" content="server"','name="vrfkyc-runtime" content="static"').replace('1. Choose a person or company. 2. Sign in with ChatGPT using your email. 3. Review and save a report.', '1. Choose a person or company. 2. Open the fictional example. 3. Review and save the report. Sign in to the secure workspace for your account.').replace('</head>','<link rel="canonical" href="https://'+domain+'/"></head>');
await writeFile('pages/index.html',staticHtml);
await writeFile('pages/.nojekyll','');
await writeFile('pages/CNAME',domain+'\n');
for(const [path,content] of Object.entries(LEGAL_PAGES))if(path.endsWith('.html'))await writeFile('pages'+path,content);
await writeFile('pages/openapi.json',JSON.stringify(openapi(appOrigin),null,2));
await writeFile('pages/manifest.json',JSON.stringify(manifest(appOrigin,{VRFKYC_AUTH_MODE:'sites'}),null,2));
await writeFile('pages/robots.txt','User-agent: *\nAllow: /\nSitemap: https://'+domain+'/sitemap.xml\n');
const paths=['/',...Object.keys(LEGAL_PAGES).filter(p=>p.endsWith('.html'))];
await writeFile('pages/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>https://'+domain+p+'</loc></url>').join('')+'</urlset>');
await writeFile('pages/404.html','<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · VRFKYC</title><body style="font:18px/1.7 system-ui;max-width:640px;margin:12vh auto;padding:24px;background:#f5f8f6;color:#17302c"><h1>That page is not here.</h1><p>Return to VRFKYC or open your secure workspace.</p><p><a href="./">VRFKYC home</a> · <a href="'+appOrigin+'/#workspace">Secure workspace</a></p><small>AliceLabs LLC</small></body></html>');
console.log('Built Worker and isolated GitHub Pages output (pages/).');
