import {beforeEach} from 'node:test';
import {LEGAL_VERSION} from '../../worker/core.mjs';
let clientAddress;
beforeEach(()=>{clientAddress=crypto.randomUUID()});
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

export function testDB(){
 const sqlite=new DatabaseSync(':memory:');
 const dir=fileURLToPath(new URL('../../drizzle/',import.meta.url));
 for(const name of readdirSync(dir).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(dir+'/'+name,'utf8'));
 const db={prepare(sql){return {bind(...args){const statement=sqlite.prepare(sql);return {async first(){return statement.get(...args)??null},async run(){const info=statement.run(...args);return {success:true,meta:{changes:Number(info.changes)}}},async all(){return {success:true,results:statement.all(...args)}}}}}},withSession(){return db},sqlite};
 return db;
}
export const identityHeaders=(id='user-1')=>({'cf-connecting-ip':clientAddress||'test-client','oai-authenticated-user-id':id,'oai-authenticated-user-email':id+'@example.test'});
export const testEnv=(db=testDB())=>({DB:db,VRFKYC_AUTH_MODE:'sites',VRFKYC_LIVE_DATA_ENABLED:'true'});
export const userRequest=(path,data,id='user-1',method='POST')=>new Request('https://vrf.example'+path,{method,headers:{'Content-Type':'application/json',...identityHeaders(id)},...(data===undefined?{}:{body:JSON.stringify(data)})});
export async function accept(handle,env,id='user-1'){
 const r=await handle(userRequest('/api/account',{acceptTerms:true,version:LEGAL_VERSION},id),env);
 if(r.status!==200)throw Error(await r.text());
}
