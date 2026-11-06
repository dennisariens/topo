import {verify} from 'node:crypto';
import {readFileSync} from 'node:fs';
const SHA=/^[a-f0-9]{40}$/,HASH=/^[a-f0-9]{64}$/;
const need=(ok,msg)=>{if(!ok)throw Error(msg);};
export function fields(p,keys){need(p&&typeof p==='object'&&!Array.isArray(p),'Invalid payload');need(Object.keys(p).every(k=>keys.includes(k)),'Unknown/private payload field');}
export function qaMessage(r){return JSON.stringify(Object.fromEntries(['taskId','sourceSha','artifactSha256','verdict','reviewer','role','keyId'].map(k=>[k,r[k]])));}
export function verifyQa(r,trust,s){fields(r,['taskId','sourceSha','artifactSha256','verdict','reviewer','role','keyId','signature']);const key=trust[r.keyId];need(key&&key.reviewer===r.reviewer&&r.reviewer!=='Codex'&&r.role==='independent','Untrusted independent reviewer');need(r.taskId===s.taskId&&r.sourceSha===s.sourceSha&&r.artifactSha256===s.artifactSha256&&r.verdict==='PASS','Stale/mismatched QA receipt');need(typeof r.signature==='string'&&verify(null,Buffer.from(qaMessage(r)),key.publicKey,Buffer.from(r.signature,'base64')),'Invalid QA signature');return true;}
export function trustedReviewers(){const path=process.env.TOPO_HARNESS_QA_TRUST;if(!path)throw Error('AUTHENTICATED_HERMES_RESPONSE_REQUIRED');return JSON.parse(readFileSync(path,'utf8'));}
export function nextState(state,{kind,payload:p}){
 const s=state?structuredClone(state):null;
 if(kind==='init'){need(!s,'Already initialized');fields(p,['taskId','kind','sourceSha','contractSha','approvalReference']);need(/^TOPO-[A-Z]+-[0-9]+$/.test(p.taskId)&&p.kind==='candidate-review'&&SHA.test(p.sourceSha)&&HASH.test(p.contractSha)&&typeof p.approvalReference==='string'&&p.approvalReference.length<=200,'Invalid approved intake');return {...p,phase:'INTAKE',attempts:0,same:0,interventions:0,inFlight:false,tokenCost:null,currencyCost:null};}
 need(s,'Task not initialized');
 switch(kind){
 case 'plan':fields(p,['planSha']);need(s.phase==='INTAKE'&&HASH.test(p.planSha),'PLAN guard');s.planSha=p.planSha;s.phase='PLAN';break;
 case 'implemented':fields(p,['sourceSha']);need(['PLAN','REPAIR'].includes(s.phase)&&p.sourceSha===s.sourceSha,'IMPLEMENT guard');s.phase='IMPLEMENT';break;
 case 'verify-start':fields(p,['sourceSha']);need(s.phase==='IMPLEMENT'&&p.sourceSha===s.sourceSha,'VERIFY guard');need(s.attempts<3&&s.same<2,'Retry limit blocked');s.phase='VERIFY';s.inFlight=true;break;
 case 'verified':fields(p,['sourceSha','gatePath','gateHash','artifactSha256']);need(s.phase==='VERIFY'&&s.inFlight&&p.sourceSha===s.sourceSha&&HASH.test(p.gateHash)&&typeof p.gatePath==='string'&&(!p.artifactSha256||HASH.test(p.artifactSha256)),'Stale VERIFY evidence');Object.assign(s,p,{phase:'INDEPENDENT_QA',inFlight:false});break;
 case 'failure':fields(p,['code','fingerprint']);need(s.phase==='VERIFY'&&s.inFlight&&/^[A-Z_]{1,80}$/.test(p.code)&&HASH.test(p.fingerprint),'Failure guard');s.attempts++;s.same=s.fingerprint===p.fingerprint?s.same+1:1;s.fingerprint=p.fingerprint;s.reason=p.code;s.inFlight=false;s.phase=s.same>=2||s.attempts>=3?'BLOCKED':'REPAIR';s.blockedFrom='VERIFY';break;
 case 'interrupted':fields(p,[]);need(s.inFlight,'No interrupted action');s.attempts++;s.same=s.reason==='INTERRUPTED'?s.same+1:1;s.reason='INTERRUPTED';s.inFlight=false;s.blockedFrom=s.phase;s.phase='BLOCKED';break;
 case 'block':case 'owner-review':fields(p,['reason']);need(/^[A-Z_]{1,80}$/.test(p.reason)&&s.phase!=='REVIEW_READY','Invalid blocker');s.blockedFrom=s.phase;s.reason=p.reason;s.phase=kind==='block'?'BLOCKED':'OWNER_REVIEW_NEEDED';break;
 case 'resume':fields(p,['sourceSha']);need(['BLOCKED','OWNER_REVIEW_NEEDED'].includes(s.phase)&&s.attempts<3&&s.same<2,'Retry limit blocked');need(p.sourceSha===s.sourceSha&&s.reason==='INTERRUPTED','Blocked phase requires external resolution');s.phase='IMPLEMENT';s.interventions++;delete s.reason;break;
 case 'qa':verifyQa(p,trustedReviewers(),s);need(s.phase==='INDEPENDENT_QA'||(s.phase==='BLOCKED'&&s.blockedFrom==='INDEPENDENT_QA'),'QA guard');s.qa=p;s.phase='PACKAGE';break;
 case 'packaged':fields(p,['manifestHash']);need(s.phase==='PACKAGE'&&HASH.test(p.manifestHash)&&s.qa?.sourceSha===s.sourceSha,'PACKAGE guard');s.manifestHash=p.manifestHash;break;
 case 'ready':fields(p,[]);need(s.phase==='PACKAGE'&&s.manifestHash&&s.qa?.sourceSha===s.sourceSha,'REVIEW_READY guard');s.phase='REVIEW_READY';break;
 default:throw Error('Unknown transition');
 }
 return s;
}
