import {existsSync,mkdirSync,readFileSync,writeFileSync,copyFileSync,cpSync} from 'node:fs';import {resolve,join} from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
import {createTask,transact,openTask} from './store.mjs';import {advance,recover,pilotDir} from './controller.mjs';import {git,digest} from './scope.mjs';
const root=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
try{
 if(existsSync(join(pilotDir,'events.jsonl')))throw Error('Pilot state already exists; use controller status/recover/resume/advance, never erase retry history');
 const sourceSha=git(root,['rev-parse','HEAD']).trim(),contractSha=digest(readFileSync(resolve(root,'.harness/tasks/TOPO-HARNESS-002/CONTRACT.md')));
 createTask(pilotDir,{taskId:'TOPO-PILOT-001',kind:'candidate-review',sourceSha,contractSha,approvalReference:'owner approved V2 plan; unchanged existing review candidate'});
 transact(pilotDir,()=>({kind:'plan',payload:{planSha:digest(readFileSync(resolve(root,'.harness/tasks/TOPO-HARNESS-002/PLAN.md')))}}));transact(pilotDir,()=>({kind:'implemented',payload:{sourceSha}}));
 // Fault injection uses the real durable intent writer. No command result or QA is fabricated.
 const program=`import {transact} from ${JSON.stringify(new URL('./store.mjs',import.meta.url).href)};transact(${JSON.stringify(pilotDir)},()=>({kind:'verify-start',payload:{sourceSha:'${sourceSha}'}}));process.kill(process.pid,'SIGKILL');`;
 const killed=spawnSync(process.execPath,['--input-type=module','-e',program]);if(killed.signal!=='SIGKILL')throw Error('Interruption demonstration did not kill writer');
 const before=openTask(pilotDir),blocked=recover(pilotDir);if(!before.inFlight||blocked.phase!=='BLOCKED'||blocked.reason!=='INTERRUPTED')throw Error('Recovery incorrectly inferred completion');
 transact(pilotDir,()=>({kind:'resume',payload:{sourceSha}}));writeFileSync(join(pilotDir,'resume-proof.json'),JSON.stringify({sourceSha,actualChildSignal:killed.signal,interruptedAt:'verification intent persisted; no verification subprocess had started',before,recovered:blocked,resumed:openTask(pilotDir)},null,2)+'\n');
 const result=await advance(root,pilotDir);writeFileSync(join(pilotDir,'pilot-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({sourceSha,phase:result.phase,blockedFrom:result.blockedFrom,reason:result.reason,provisionalBundle:join(pilotDir,'review-package')},null,2));if(result.phase!=='BLOCKED'||result.blockedFrom!=='INDEPENDENT_QA'||result.reason!=='AUTHENTICATED_HERMES_RESPONSE_REQUIRED')process.exitCode=1;
}catch(e){console.error('PILOT BLOCKED: '+e.message);process.exitCode=1;}
