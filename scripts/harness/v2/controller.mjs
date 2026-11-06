import {readFileSync,writeFileSync,mkdirSync,existsSync,realpathSync,mkdtempSync,rmSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';import {fileURLToPath} from 'node:url';import {homedir,platform,tmpdir} from 'node:os';
import {git,digest,implementationDigest,scope,APP_HASH} from './scope.mjs';
import {createTask,transact,openTask,withRunLock} from './store.mjs';
import {runProcess} from '../process.mjs';import {cleanEnvironment} from '../policy.mjs';
import {createPackage,validatePackage} from './package.mjs';
import {routeSkills,readSkill,instructions,validateSkillLedger} from './skills.mjs';
export function validateGate(g,sha,code){if(g.status!=='PASS'||g.sourceSha!==sha||g.implementationDigest!==code)throw Error('Stale or failed delivery gate');const required=['scope','v2-tests','v1-gate','source-unchanged'];if(g.checks.length!==required.length||new Set(g.checks.map(r=>r.id)).size!==required.length||required.some(id=>!g.checks.some(r=>r.id===id&&r.status==='PASS'&&r.exitCode===0)))throw Error('Missing required verification');return true;}
function recoverOwned(dir){const s=openTask(dir);return s.inFlight?transact(dir,()=>({kind:'interrupted',payload:{}})):s;}
export async function recover(dir){return withRunLock(dir,()=>recoverOwned(dir));}
export function validateCurrentInputs(root,s){scope(root);if(git(root,['rev-parse','HEAD']).trim()!==s.sourceSha)throw Error('Task source SHA changed; new intake/QA required');if(digest(readFileSync(resolve(root,'.harness/tasks/TOPO-HARNESS-002/CONTRACT.md')))!==s.contractSha)throw Error('Approved contract changed');}
const registryAt=root=>JSON.parse(readFileSync(resolve(root,'.harness/v2/skills/registry.json')));
function recordSkills(root,dir,s,kinds){const file=join(dir,'skills.json');const ledger=existsSync(file)?JSON.parse(readFileSync(file)):{sourceSha:s.sourceSha,routes:{}};for(const kind of kinds){const rows=routeSkills(registryAt(root),kind,{root}).map(readSkill);for(const row of rows)instructions(row);ledger.routes[kind]=rows;}writeFileSync(file,JSON.stringify(ledger,null,2)+'\n');return transact(dir,()=>({kind:'skills',payload:{ledgerHash:digest(readFileSync(file))}}));}
function checkSkills(root,dir,s,kinds=['visual-qa','independent-qa']){const bytes=readFileSync(join(dir,'skills.json'));if(digest(bytes)!==s.skillsHash)throw Error('Durable skill ledger changed');validateSkillLedger(registryAt(root),JSON.parse(bytes),{root,sourceSha:s.sourceSha,routes:kinds});}
function checkGate(root,s){const bytes=readFileSync(join(s.gatePath,'summary.json'));if(digest(bytes)!==s.gateHash)throw Error('Gate evidence changed');const g=JSON.parse(bytes);validateGate(g,s.sourceSha,implementationDigest(root));return g;}
function blockOwned(dir,reason){const s=openTask(dir);if(['BLOCKED','REVIEW_READY'].includes(s.phase))return s;return transact(dir,()=>({kind:'block',payload:{reason}}));}
export async function advance(root,dir){return withRunLock(dir,async()=>{try{return await advanceOwned(root,dir);}catch(e){try{blockOwned(dir,'INPUT_OR_CONTROLLER_ERROR');}catch{}throw e;}});}
async function advanceOwned(root,dir){let s=openTask(dir);validateCurrentInputs(root,s);if(s.inFlight)return recoverOwned(dir);
 for(let n=0;n<8;n++){
  s=openTask(dir);if(['BLOCKED','OWNER_REVIEW_NEEDED','REVIEW_READY'].includes(s.phase))return s;validateCurrentInputs(root,s);
  if(s.phase==='INTAKE')transact(dir,()=>({kind:'plan',payload:{planSha:digest(readFileSync(resolve(root,'.harness/tasks/TOPO-HARNESS-002/PLAN.md')))}}));
  else if(s.phase==='PLAN')transact(dir,()=>({kind:'implemented',payload:{sourceSha:s.sourceSha}}));
  else if(s.phase==='REPAIR')return transact(dir,()=>({kind:'owner-review',payload:{reason:'IMPLEMENTATION_REPAIR_REQUIRED'}}));
  else if(s.phase==='IMPLEMENT'){recordSkills(root,dir,s,['visual-qa']);transact(dir,()=>({kind:'verify-start',payload:{sourceSha:s.sourceSha}}));}
  else if(s.phase==='VERIFY'){
   checkSkills(root,dir,s,['visual-qa']);const out=resolve(root,'.harness/tasks/TOPO-HARNESS-002/runs/pilot-gate-'+Date.now()),started=Date.now();const home=mkdtempSync(join(tmpdir(),'topo-v2-controller-'));let r;
   try{const cache=process.env.PLAYWRIGHT_BROWSERS_PATH||join(homedir(),platform()==='darwin'?'Library/Caches/ms-playwright':'.cache/ms-playwright');r=await runProcess(process.execPath,['scripts/harness/v2/gate.mjs','--out',out],{cwd:root,env:cleanEnvironment(process.env,home,cache),log:join(dir,'controller-gate.log'),timeoutMs:1500000});}finally{rmSync(home,{recursive:true,force:true});}
   if(r.exitCode!==0||r.timedOut){const summary=existsSync(join(out,'summary.json'))?JSON.parse(readFileSync(join(out,'summary.json'))):{};return transact(dir,()=>({kind:'failure',payload:{code:'GATE_FAILED',fingerprint:digest(summary.error||'gate failed')}}));}
   const bytes=readFileSync(join(out,'summary.json'));validateGate(JSON.parse(bytes),s.sourceSha,implementationDigest(root));validateCurrentInputs(root,s);writeFileSync(join(dir,'timing.json'),JSON.stringify({durationMs:Date.now()-started,tokenCost:null,currencyCost:null})+'\n');transact(dir,()=>({kind:'verified',payload:{sourceSha:s.sourceSha,gatePath:out,gateHash:digest(bytes),artifactSha256:APP_HASH}}));
  }else if(s.phase==='INDEPENDENT_QA'){
   const g=checkGate(root,s);try{s=recordSkills(root,dir,s,['independent-qa']);checkSkills(root,dir,s);}catch{return blockOwned(dir,'REQUIRED_SKILL_UNAVAILABLE');}
   const staging=join(s.gatePath,'v1');writeFileSync(join(staging,'handoff.md'),'# PROVISIONAL — independent QA OPEN\nExact source SHA: '+s.sourceSha+'\nHTML SHA256: '+APP_HASH+'\nRun scripts/harness/v2/gate.mjs and inspect controller/brain/skills/evolution. No merge/deploy/release authorized. No unsigned receipt grants approval.\n');
   writeFileSync(join(staging,'skills.json'),readFileSync(join(dir,'skills.json')));writeFileSync(join(staging,'gate-summary.json'),JSON.stringify(g,null,2)+'\n');writeFileSync(join(staging,'v1-summary.json'),readFileSync(join(staging,'summary.json')));
   const {reconcile}=await import('./brain.mjs');const brain=reconcile([{type:'verification',sourceSha:s.sourceSha,status:'PASS',evidence:s.gatePath.slice(root.length+1)+'/summary.json',evidenceSha256:s.gateHash}],{sourceSha:s.sourceSha,implementationDigest:implementationDigest(root),readEvidence:()=>({sha256:s.gateHash,summary:g})});brain.sources=['docs/PROJECT_STATE.md','docs/DECISIONS.md','docs/DESIGN_SYSTEM.md','docs/LEERROUTE_DESIGN.md'].map(path=>({path,sha256:digest(readFileSync(resolve(root,path)))}));writeFileSync(join(staging,'brain-index.json'),JSON.stringify(brain,null,2)+'\n');
   const bundle=join(dir,'review-package');if(existsSync(bundle))throw Error('Controller requires fresh review output');createPackage(root,staging,bundle,{sourceSha:s.sourceSha});const manifestHash=digest(readFileSync(join(bundle,'manifest.json')));s=transact(dir,()=>({kind:'bundle',payload:{manifestHash}}));validatePackage(bundle,s);writeFileSync(join(dir,'bundle.json'),JSON.stringify({path:bundle,provisional:true})+'\n');return blockOwned(dir,'AUTHENTICATED_HERMES_RESPONSE_REQUIRED');
  }else if(s.phase==='PACKAGE'){
   checkGate(root,s);checkSkills(root,dir,s);const bundle=join(dir,'review-package'),manifest=validatePackage(bundle,s);manifest.status='REVIEW_READY';manifest.independentQa=s.qa;const final=join(bundle,'ready-manifest.json');writeFileSync(final,JSON.stringify(manifest,null,2)+'\n');transact(dir,()=>({kind:'packaged',payload:{manifestHash:digest(readFileSync(final))}}));validateCurrentInputs(root,s);validatePackage(bundle,s);transact(dir,()=>({kind:'ready',payload:{}}));
  }
 }
 return openTask(dir);
}
const root=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
export const pilotDir=resolve(root,'.harness/tasks/TOPO-PILOT-001/runs/current');
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const [cmd,...args]=process.argv.slice(2);if(args.length)throw Error('No arbitrary arguments accepted');let s;
  if(cmd==='init'){scope(root);s=createTask(pilotDir,{taskId:'TOPO-PILOT-001',kind:'candidate-review',sourceSha:git(root,['rev-parse','HEAD']).trim(),contractSha:digest(readFileSync(resolve(root,'.harness/tasks/TOPO-HARNESS-002/CONTRACT.md'))),approvalReference:'owner approved V2 contract; safe existing review candidate'});}
  else if(cmd==='status')s=openTask(pilotDir);
  else if(cmd==='recover')s=await recover(pilotDir);
  else if(cmd==='advance')s=await advance(root,pilotDir);
  else if(['resume','accept-qa','block'].includes(cmd))s=await withRunLock(pilotDir,()=>{
   const state=openTask(pilotDir);validateCurrentInputs(root,state);
   if(cmd==='resume'){recoverOwned(pilotDir);return transact(pilotDir,()=>({kind:'resume',payload:{sourceSha:git(root,['rev-parse','HEAD']).trim()}}));}
   if(cmd==='block')return blockOwned(pilotDir,'OPERATOR_BLOCKED');
   const file=process.env.TOPO_HARNESS_QA_RECEIPT,trust=process.env.TOPO_HARNESS_QA_TRUST;if(!file||!trust||realpathSync(trust).startsWith(root+'/'))throw Error('External controller trust/receipt required');checkGate(root,state);checkSkills(root,pilotDir,state);validatePackage(join(pilotDir,'review-package'),state);return transact(pilotDir,()=>({kind:'qa',payload:JSON.parse(readFileSync(file))}));
  });
  else throw Error('Allowed commands: init,status,advance,resume,recover,accept-qa,block');console.log(JSON.stringify(s,null,2));
 }catch(e){console.error('CONTROLLER BLOCKED: '+e.message);process.exitCode=1;}
}
