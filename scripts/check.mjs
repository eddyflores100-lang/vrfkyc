import {readdirSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
for(const folder of ['worker','scripts'])for(const file of readdirSync(folder))if(/\.(mjs|js)$/.test(file))execFileSync(process.execPath,['--check',folder+'/'+file]);
for(const file of ['worker/landing.html','pages/index.html'])for(const m of readFileSync(file,'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
console.log('JavaScript and inline scripts parse successfully.');
