// Authenticated QA here uses ephemeral test keys and fabricated test gate rows.
// This is regression coverage, never real pilot or Hermes evidence.
import test from 'node:test';import assert from 'node:assert/strict';import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';import {generateKeyPairSync,sign} from 'node:crypto';
import {createTask,transact,openTask} from './store.mjs';import {advance} from './controller.mjs';import {createPackage} from './package.mjs';import {routeSkills,readSkill} from './skills.mjs';import {qaMessage} from './machine.mjs';import {git,digest,implementationDigest,APP_HASH} from './scope.mjs';
test('fixture whole flow: signed exact-source QA finalizes only an intact source, skill ledger and bound package',async()=>{
 const temp=mkdtempSync(join(tmpdir(),'topo-v2-ready-fixture-')),root=join(temp,'work'),source=new URL('../../../',import.meta.url).pathname,old=process.env.TOPO_HARNESS_QA_TRUST;
 try{
 execFileSync('git',['clone','--quiet','--shared',source,root]);
 const skill=join(temp,'SKILL.md');writeFileSync(skill,'# Fixture instructions, not an executed real design skill');
 const registry={version:1,skills:[{id:'fixture',kinds:['visual-qa','independent-qa'],required:true,path:skill}]};writeFileSync(join(root,'.harness/v2/skills/registry.json'),JSON.stringify(registry));
 execFileSync('git',['add','.harness/v2/skills/registry.json'],{cwd:root});execFileSync('git',['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','--quiet','-m','fixture skill provider'],{cwd:root});
 const sourceSha=git(root,['rev-parse','HEAD']).trim(),dir=join(root,'.harness/tasks/TOPO-PILOT-001/runs/fixture');mkdirSync(dir,{recursive:true});
 const payload={taskId:'TOPO-PILOT-001',kind:'candidate-review',sourceSha,contractSha:digest(readFileSync(join(root,'.harness/tasks/TOPO-HARNESS-002/CONTRACT.md'))),approvalReference:'TEST FIXTURE ONLY'};createTask(dir,payload);
 const ledger={sourceSha,routes:Object.fromEntries(['visual-qa','independent-qa'].map(kind=>[kind,routeSkills(registry,kind,{root}).map(readSkill)]))};writeFileSync(join(dir,'skills.json'),JSON.stringify(ledger));
 const gatePath=join(root,'.harness/tasks/TOPO-HARNESS-002/runs/fixture-gate');mkdirSync(gatePath,{recursive:true});const g={status:'PASS',sourceSha,implementationDigest:implementationDigest(root),checks:['scope','v2-tests','v1-gate','source-unchanged'].map(id=>({id,status:'PASS',exitCode:0}))};writeFileSync(join(gatePath,'summary.json'),JSON.stringify(g));
 for(const [kind,p] of [['plan',{planSha:'b'.repeat(64)}],['implemented',{sourceSha}],['skills',{ledgerHash:digest(readFileSync(join(dir,'skills.json')))}],['verify-start',{sourceSha}],['verified',{sourceSha,gatePath,gateHash:digest(readFileSync(join(gatePath,'summary.json'))),artifactSha256:APP_HASH}]])transact(dir,()=>({kind,payload:p}));
 const evidence=join(temp,'evidence');mkdirSync(evidence);const bundle=join(dir,'review-package');createPackage(root,evidence,bundle,{sourceSha});transact(dir,()=>({kind:'bundle',payload:{manifestHash:digest(readFileSync(join(bundle,'manifest.json')))}}));
 const {publicKey,privateKey}=generateKeyPairSync('ed25519'),trust=join(temp,'trust.json');writeFileSync(trust,JSON.stringify({fixture:{reviewer:'Hermes-FIXTURE',publicKey:publicKey.export({type:'spki',format:'pem'})}}));process.env.TOPO_HARNESS_QA_TRUST=trust;
 const r={taskId:payload.taskId,sourceSha,artifactSha256:APP_HASH,verdict:'PASS',reviewer:'Hermes-FIXTURE',role:'independent',keyId:'fixture'};r.signature=sign(null,Buffer.from(qaMessage(r)),privateKey).toString('base64');transact(dir,()=>({kind:'qa',payload:r}));
 assert.equal((await advance(root,dir)).phase,'REVIEW_READY');assert.equal(openTask(dir).phase,'REVIEW_READY');assert.equal(JSON.parse(readFileSync(join(bundle,'ready-manifest.json'))).independentQa.reviewer,'Hermes-FIXTURE');
 }finally{if(old===undefined)delete process.env.TOPO_HARNESS_QA_TRUST;else process.env.TOPO_HARNESS_QA_TRUST=old;rmSync(temp,{recursive:true,force:true});}
});
