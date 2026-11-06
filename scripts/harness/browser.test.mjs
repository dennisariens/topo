import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runBrowserChecks} from './browser.mjs';
test('missing pinned tooling fails closed and still writes summary', async()=>{
 const out=await mkdtemp(join(tmpdir(),'topo-browser-negative-'));
 try {await assert.rejects(runBrowserChecks({root:out,out,modulePath:join(out,'absent/index.mjs')}));
 const result=JSON.parse(await readFile(join(out,'summary.json'),'utf8'));assert.equal(result.status,'FAIL');assert.equal(result.requiredEngines.length,2);
 } finally {await rm(out,{recursive:true,force:true});}
});
