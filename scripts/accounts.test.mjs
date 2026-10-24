import test from 'node:test';
import assert from 'node:assert/strict';
import {handle,withAccountQuota,accountStatus,quotaWindow} from '../worker/core.mjs';
import {testDB,testEnv,userRequest,identityHeaders,accept} from './helpers/d1.mjs';
const query={name:'Alex Morgan',type:'person',mode:'demo'};
test('anonymous searches are blocked and identity headers are ignored outside Sites auth mode',async()=>{
 assert.equal((await handle(new Request('https://vrf.example/api/screen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(query)}),testEnv())).status,401);
 assert.equal((await handle(userRequest('/api/screen',query),{DB:testDB()})).status,401);
 const account=await(await handle(new Request('https://vrf.example/api/account'),testEnv())).json();assert.equal(account.authenticated,false);assert.ok(account.signInUrl.startsWith('/signin-with-chatgpt?'));
});
test('terms acceptance is explicit, versioned and cannot grant a paid plan',async()=>{
 const env=testEnv();assert.equal((await handle(userRequest('/api/screen',query),env)).status,428);
 for(const input of [{plan:'business_pro'},{audience:'business',limit:100},{acceptTerms:true,version:'old'},{acceptTerms:false,version:'2026-10-23'}])assert.equal((await handle(userRequest('/api/account',input),env)).status,400);
 await accept(handle,env);const account=await accountStatus(userRequest('/api/account',undefined,'user-1','GET'),env);assert.equal(account.acceptedTerms,true);assert.equal(account.usage.used,0);
 const row=env.DB.sqlite.prepare('SELECT * FROM vrf_accounts').get();assert.equal(row.terms_version,'2026-10-23');assert.equal(row.use_purpose,'commercial');assert.ok(row.accepted_at);assert.equal(JSON.stringify(row).includes('example.test'),false);
});
test('five REST/MCP searches share a durable counter; sixth and audience switching are blocked',async()=>{
 const env=testEnv();await accept(handle,env);
 for(let i=0;i<4;i++)assert.equal((await handle(userRequest('/api/screen',query),env)).status,200);
 const rpc={jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'screen_demo',arguments:{name:'Alex Morgan',type:'person'}}};
 const fifth=await(await handle(userRequest('/api/mcp',rpc),env)).json();assert.equal(fifth.result.isError,false);assert.equal(fifth.result.structuredContent.usage.used,5);
 assert.equal((await handle(userRequest('/api/account',{audience:'developer'}),env)).status,200);
 assert.equal((await handle(userRequest('/api/screen',query),env)).status,429);
 const sixth=await(await handle(userRequest('/api/mcp',rpc),env)).json();assert.equal(sixth.result.isError,true);assert.equal(JSON.parse(sixth.result.content[0].text).httpStatus,429);
 assert.equal(env.DB.sqlite.prepare('SELECT used FROM vrf_monthly_usage').get().used,5);
});
test('parallel requests cannot exceed five and quota survives handler recreation',async()=>{
 const db=testDB(),env=testEnv(db);await accept(handle,env);
 const results=await Promise.all(Array.from({length:20},()=>handle(userRequest('/api/screen',query),env)));
 assert.equal(results.filter(r=>r.status===200).length,5);assert.equal(results.filter(r=>r.status===429).length,15);
 assert.equal((await handle(userRequest('/api/screen',query),testEnv(db))).status,429);
});
test('provider errors and not_screened reports return their credit',async()=>{
 const env=testEnv();await accept(handle,env);
 const unknown=await(await handle(userRequest('/api/screen',{...query,name:'Unknown Name'}),env)).json();assert.equal(unknown.status,'not_screened');assert.equal(unknown.usage.used,0);
 const fail=await handle(userRequest('/api/screen',{name:'Example',type:'person'}),{...env,CSL_API_KEY:'test'},async()=>{throw Error('timeout')});assert.equal(fail.status,502);
 const account=await accountStatus(userRequest('/api/account',undefined,'user-1','GET'),env);assert.equal(account.usage.used,0);
});
test('account deletion, sign-out and changing audiences do not reset current-month usage',async()=>{
 const env=testEnv();await accept(handle,env);for(let i=0;i<5;i++)await handle(userRequest('/api/screen',query),env);
 const deleted=await handle(userRequest('/api/account',undefined,'user-1','DELETE'),env);assert.equal(deleted.status,200);assert.equal(env.DB.sqlite.prepare('SELECT COUNT(*) n FROM vrf_accounts').get().n,0);
 await accept(handle,env);assert.equal((await handle(userRequest('/api/screen',query),env)).status,429);
});
test('UTC calendar reset handles year boundaries and gives another user a separate allowance',async()=>{
 assert.equal(quotaWindow(new Date('2026-12-31T23:59:59Z')).resetsAt,'2027-01-01T00:00:00.000Z');
 const env=testEnv();await accept(handle,env);await accept(handle,env,'user-2');const req=userRequest('/api/screen',query);
 for(let i=0;i<5;i++)await withAccountQuota(req,env,async()=>({status:'fictional_candidates'}),new Date('2026-12-31T23:59:59Z'));
 await assert.rejects(withAccountQuota(req,env,async()=>({status:'fictional_candidates'}),new Date('2026-12-31T23:59:59Z')),e=>e.status===429);
 assert.equal((await withAccountQuota(req,env,async()=>({status:'fictional_candidates'}),new Date('2027-01-01T00:00:00Z'))).usage.used,1);
 assert.equal((await handle(userRequest('/api/screen',query,'user-2'),env)).status,200);
});
test('missing database, cross-origin account mutation and disabled live data fail closed',async()=>{
 assert.equal((await handle(userRequest('/api/screen',query),{VRFKYC_AUTH_MODE:'sites'})).status,503);
 const env=testEnv();await accept(handle,env);const req=userRequest('/api/account',{audience:'business'});req.headers.set('Origin','https://evil.example');assert.equal((await handle(req,env)).status,403);
 let calls=0;const r=await handle(userRequest('/api/screen',{name:'Example',type:'person'}),{...env,VRFKYC_LIVE_DATA_ENABLED:'false',CSL_API_KEY:'test'},async()=>{calls++;return new Response('{}')});assert.equal(r.status,503);assert.equal(calls,0);assert.equal((await accountStatus(userRequest('/api/account',undefined,'user-1','GET'),env)).usage.used,0);
});
