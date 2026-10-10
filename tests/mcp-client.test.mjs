import test from 'node:test';
import assert from 'node:assert/strict';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {handle} from '../src/lib/vrfkyc/core.mjs';
test('official MCP SDK initializes, calls demo, reads resources and retrieves prompts',async()=>{
 const client=new Client({name:'vrfkyc-compat-check',version:'1.0'});
 const transport=new StreamableHTTPClientTransport(new URL('https://vrf.example/mcp'),{fetch:async(input,init)=>handle(new Request(input,init),{})});
 await client.connect(transport);
 try {
  assert.equal((await client.listTools()).tools.length,10);
  assert.equal((await client.callTool({name:'screen_demo',arguments:{name:'Alex Morgan',type:'person'}})).structuredContent.status,'fictional_candidates');
  assert.equal((await client.readResource({uri:'vrfkyc://sources'})).contents.length,1);
  assert.equal((await client.listPrompts()).prompts.length,1);
  assert.equal((await client.getPrompt({name:'review_counterparty'})).messages.length,1);
 }finally{await client.close()}
});
