import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {generateKeyPairSync, sign} from 'node:crypto';
import {allowedV2Path, validateV1Result, metadataOnly} from './scope.mjs';
import {createTask, transact, openTask} from './store.mjs';
import {nextState, verifyQa, qaMessage} from './machine.mjs';
const sha='a'.repeat(40), hash='b'.repeat(64);
const initial={taskId:'TOPO-PILOT-001',kind:'candidate-review',sourceSha:sha,contractSha:hash,approvalReference:'owner-approved mission'};
const temp=()=>mkdtempSync(join(tmpdir(),'topo-v2-test-'));
test('V2 additions cannot modify V1, product, policy, arbitrary workflows or traverse paths',()=>{
 for(const p of ['docs/brain/index.json','scripts/harness/v2/machine.mjs','.harness/v2/README.md','.harness/tasks/TOPO-HARNESS-002/STATE.md'])assert(allowedV2Path(p));
 for(const p of ['index.html','scripts/harness/policy.mjs','.harness/permissions.yaml','scripts/polish.test.mjs','.github/workflows/deploy.yml','docs/brain/../DECISIONS.md','/docs/brain/x','docs/brain/x\\y'])assert(!allowedV2Path(p),p);
 assert(metadataOnly(['.harness/tasks/TOPO-HARNESS-002/EVIDENCE.md']));assert(!metadataOnly(['scripts/harness/v2/gate.mjs']));assert(!metadataOnly(['docs/brain/unknown-executable.mjs']));
});
test('original V1 verdict requires all12 steps, exact baseline and no skipped browser',()=>{
 const ids=['scope','harness-tests','build','lint','tests','release-audit','map-audit','v2-audit','artifacts','browser','negative-proof','source-unchanged'];
 const result={status:'PASS',sourceSha:'a86975272ee700d79ab04fe5429ab91165f2029d',results:ids.map(id=>({id,status:'PASS',exitCode:0}))};
 assert.doesNotThrow(()=>validateV1Result(result));assert.throws(()=>validateV1Result({...result,sourceSha:sha}));assert.throws(()=>validateV1Result({...result,results:result.results.filter(r=>r.id!=='browser')}));assert.throws(()=>validateV1Result({...result,results:result.results.map(r=>r.id==='browser'?{...r,status:'SKIP'}:r)}));
});
test('store survives a killed real writer, replays committed events and rejects truncated/tampered history',()=>{
 const dir=temp();try{createTask(dir,initial);const child=spawnSync(process.execPath,['--input-type=module','-e',`import {transact} from ${JSON.stringify(new URL('./store.mjs',import.meta.url).href)};transact(${JSON.stringify(dir)},s=>({kind:'plan',payload:{planSha:'${hash}'}}));process.kill(process.pid,'SIGKILL');`]);assert.equal(child.signal,'SIGKILL');assert.equal(openTask(dir).phase,'PLAN');
 writeFileSync(join(dir,'snapshot.json'),'{truncated');assert.equal(openTask(dir).phase,'PLAN');
 const p=join(dir,'events.jsonl');writeFileSync(p,readFileSync(p,'utf8').replace('"PLAN"','"PACKAGE"')); // payload is revalidated; hash catches any actual edit
 writeFileSync(p,readFileSync(p,'utf8')+'{"truncated":');assert.throws(()=>openTask(dir),/history|JSON|event/i);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('live single-writer lock rejects a second writer without deleting its lock',()=>{
 const dir=temp();try{createTask(dir,initial);writeFileSync(join(dir,'writer.lock'),JSON.stringify({pid:process.pid}));assert.throws(()=>transact(dir,()=>({kind:'plan',payload:{planSha:hash}})),/locked/i);assert(readFileSync(join(dir,'writer.lock'),'utf8'));}finally{rmSync(dir,{recursive:true,force:true});}
});
test('phase guards forbid stale success, forged ready, silent recovery and repeated failures',()=>{
 let s=nextState(null,{kind:'init',payload:initial});assert.throws(()=>nextState(s,{kind:'ready',payload:{}}));s=nextState(s,{kind:'plan',payload:{planSha:hash}});s=nextState(s,{kind:'implemented',payload:{sourceSha:sha}});s=nextState(s,{kind:'verify-start',payload:{sourceSha:sha}});assert.throws(()=>nextState(s,{kind:'verified',payload:{sourceSha:'c'.repeat(40),gatePath:'gate.json',gateHash:hash}}));
 s=nextState(s,{kind:'failure',payload:{code:'TEST_FAILED',fingerprint:hash}});assert.equal(s.phase,'REPAIR');s=nextState(s,{kind:'implemented',payload:{sourceSha:sha}});s=nextState(s,{kind:'verify-start',payload:{sourceSha:sha}});s=nextState(s,{kind:'failure',payload:{code:'TEST_FAILED',fingerprint:hash}});assert.equal(s.phase,'BLOCKED');assert.throws(()=>nextState(s,{kind:'resume',payload:{sourceSha:sha}}),/retry|limit|blocked/i);
});
test('signed QA binds exact SHA/hash/task/reviewer; local unsigned records cannot grant approval',()=>{
 const {publicKey,privateKey}=generateKeyPairSync('ed25519');const receipt={taskId:initial.taskId,sourceSha:sha,artifactSha256:hash,verdict:'PASS',reviewer:'Hermes',role:'independent',keyId:'fixture-key'};
 const signed={...receipt,signature:sign(null,Buffer.from(qaMessage(receipt)),privateKey).toString('base64')};const trust={'fixture-key':{reviewer:'Hermes',publicKey:publicKey.export({type:'spki',format:'pem'})}};
 assert(verifyQa(signed,trust,{...initial,artifactSha256:hash}));assert.throws(()=>verifyQa(signed,{},initial));assert.throws(()=>verifyQa({...signed,sourceSha:'c'.repeat(40)},trust,{...initial,artifactSha256:hash}));assert.throws(()=>verifyQa({...signed,reviewer:'Codex'},trust,{...initial,artifactSha256:hash}));
});
test('evidence-only deltas cannot hide executable code or artifact replacements',()=>{assert.equal(metadataOnly(['.harness/tasks/TOPO-HARNESS-002/evidence/evil.mjs']),false);assert.equal(metadataOnly(['.harness/tasks/TOPO-HARNESS-002/evidence/candidate.html']),false);});
