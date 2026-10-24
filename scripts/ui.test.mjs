import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
import {handle,LEGAL_VERSION,accountStatus} from '../worker/core.mjs';
import {testEnv,userRequest} from './helpers/d1.mjs';

async function ui(runtime){
 const html=await readFile(runtime==='static'?'pages/index.html':'worker/landing.html','utf8');
 const nodes=new Map();
 function node(selector){
  if(!nodes.has(selector))nodes.set(selector,{value:({'#mode':'demo','#provider':'csl','#name':'Alex Morgan'})[selector]||'',textContent:'',innerHTML:'',checked:false,disabled:false,dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},addEventListener(){},showModal(){this.open=true},close(){this.open=false},click(){this.onclick?.()},content:selector.includes('vrfkyc-runtime')?runtime:'https://asterscreen.toastyrice32.chatgpt.site'});
  return nodes.get(selector);
 }
 const env=testEnv();let calls=0;
 const document={querySelector:node,querySelectorAll:()=>[],createElement:()=>node('download')};
 const context=vm.createContext({document,console,crypto,URL,Blob,Date,JSON,navigator:{clipboard:{writeText:async()=>{}}},setTimeout:()=>0,location:{origin:'https://vrfkyc.alicelabs.site',protocol:'https:',assign(){}},window:{open:()=>null},fetch:async(path,options={})=>{
  calls++;
  if(runtime==='static')throw Error('Static demo unexpectedly called a server');
  return handle(userRequest(path,options.body?JSON.parse(options.body):undefined,'test-ui',options.method||'GET'),env);
 }});
 new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]).runInContext(context);
 await vm.runInContext('refreshAccount()',context);
 return {context,node,env,calls:()=>calls};
}
const submit={preventDefault(){}};

test('custom-domain Pages demo runs locally, preserves unknown-name status and links to secure login',async()=>{
 const a=await ui('static');
 await a.node('#screenform').onsubmit(submit);
 assert.equal(vm.runInContext('record.status',a.context),'fictional_candidates');
 assert.equal(a.node('#authnav').href,'https://asterscreen.toastyrice32.chatgpt.site/#workspace');
 a.node('#name').value='Unknown Subject';await a.node('#screenform').onsubmit(submit);
 assert.equal(vm.runInContext('record.status',a.context),'not_screened');
 assert.equal(a.calls(),0);
 assert.equal(a.node('#screenbutton').disabled,false);
});

test('new user can review and accept terms through the UI before the first successful search',async()=>{
 const a=await ui('server');await a.node('#screenform').onsubmit(submit);
 assert.equal(a.node('#dialogtitle').textContent,'Review the beta terms before searching');
 assert.equal(vm.runInContext('record',a.context),null);
 await a.node('#termsform').onsubmit(submit);
 assert.equal((await accountStatus(userRequest('/api/account',undefined,'test-ui','GET'),a.env)).acceptedTerms,false);
 a.node('#termsconsent').checked=true;await a.node('#termsform').onsubmit(submit);
 const accepted=await accountStatus(userRequest('/api/account',undefined,'test-ui','GET'),a.env);
 assert.equal(accepted.acceptedTerms,true);assert.equal(accepted.termsVersion,LEGAL_VERSION);assert.equal(accepted.usage.used,0);assert.ok(accepted.acceptedAt);
 await a.node('#screenform').onsubmit(submit);
 assert.equal(vm.runInContext('record.status',a.context),'fictional_candidates');
 assert.equal((await accountStatus(userRequest('/api/account',undefined,'test-ui','GET'),a.env)).usage.used,1);
});

test('static output contains only public pages and all local document links resolve',async()=>{
 const names=await readdir('pages');assert.equal(names.includes('worker'),false);assert.equal(names.includes('db'),false);
 assert.equal((await readFile('pages/CNAME','utf8')).trim(),'vrfkyc.alicelabs.site');
 for(const name of names.filter(n=>n.endsWith('.html'))){
  const html=(await readFile('pages/'+name,'utf8')).split('<script>')[0];
  for(const m of html.matchAll(/href="([^"#]+\.html)"/g))assert.ok(names.includes(m[1]),name+' links to missing '+m[1]);
 }
 const html=await readFile('pages/index.html','utf8');
 assert.ok(html.includes('href="privacy.html"'));assert.ok(html.includes('href="terms.html"'));
 assert.ok(html.includes('name="vrfkyc-runtime" content="static"'));
});
