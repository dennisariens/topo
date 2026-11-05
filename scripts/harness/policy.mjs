import {readFileSync,lstatSync} from 'node:fs';import{execFileSync}from'node:child_process';import{resolve,posix}from'node:path';
export const BASE='b06b13059ff5e2ef7278c2d0c55597cf8a9435cf';
export const ACTIONS=['harness-tests','build','lint','tests','release-audit','map-audit','v2-audit','artifacts','browser','negative-proof'];
export const REQUIRED=['scope',...ACTIONS,'source-unchanged'];
const FILES=['AGENTS.md','check.sh','docs/PROJECT_STATE.md','docs/DECISIONS.md','.github/workflows/harness.yml'],PREFIXES=['.harness/','scripts/harness/'];
export function assertAllowedPath(path){if(typeof path!=='string'||path.includes('\\')||path.startsWith('/')||posix.normalize(path)!==path||path.split('/').includes('..')||!(FILES.includes(path)||PREFIXES.some(p=>path.startsWith(p))))throw Error('DENIED source modification: '+path);}
export function validatePolicy(root){const p=JSON.parse(readFileSync(resolve(root,'.harness/permissions.yaml')));if(p.schema!==1||p.base!==BASE||JSON.stringify(p.allowedFiles)!==JSON.stringify(FILES)||JSON.stringify(p.allowedPrefixes)!==JSON.stringify(PREFIXES)||JSON.stringify(p.actions)!==JSON.stringify(ACTIONS)||p.hostSandbox!==false)throw Error('DENIED policy capability expansion or invalid schema');return p;}
const git=(root,args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32e6});
export function assertScope(root){validatePolicy(root);const paths=new Set([...git(root,['diff','--name-only','-z',BASE,'--']).split('\0'),...git(root,['ls-files','--others','--exclude-standard','-z']).split('\0')].filter(Boolean));for(const p of paths){assertAllowedPath(p);try{if(lstatSync(resolve(root,p)).isSymbolicLink())throw Error('DENIED symlink: '+p);}catch(e){if(e.code!=='ENOENT')throw e;}}
 const dirty=git(root,['status','--porcelain','--untracked-files=all']).split('\n').filter(Boolean).map(l=>l.slice(3));for(const p of dirty)if(!/^\.harness\/tasks\/[A-Z0-9-]+\/(?:STATE|EVIDENCE)\.md$/.test(p))throw Error('DENIED uncommitted verification input: '+p);
 return{status:'PASS',changedPaths:[...paths],base:BASE};}
export function nodeSupported(version){const[a,b,c]=version.split('.').map(Number);return a>=26||(a===24&&b>=15)||(a===22&&(b>22||(b===22&&c>=2)));}
export function cleanEnvironment(source,home,browsers){return{PATH:source.PATH||'/usr/bin:/bin',HOME:home,TMPDIR:source.TMPDIR||'/tmp',TMP:source.TMPDIR||'/tmp',TEMP:source.TMPDIR||'/tmp',CI:'true',NO_COLOR:'1',npm_config_userconfig:'/dev/null',npm_config_globalconfig:'/dev/null',PLAYWRIGHT_BROWSERS_PATH:browsers};}
export function actionFor(id,root,{out,tooling,npmCli}={}){
 const npmScripts={build:'build',lint:'lint',tests:'test','release-audit':'audit:release-1-2'};
 if(id in npmScripts)return{command:process.execPath,args:[npmCli,'run',npmScripts[id]],timeoutMs:id==='tests'?900000:180000};
 const nodeScripts={'map-audit':'scripts/audit-map-picker-revision.mjs','v2-audit':'scripts/audit-nino-v2.mjs',artifacts:'scripts/harness/artifacts.mjs',browser:'scripts/harness/browser.mjs','negative-proof':'scripts/harness/prove-rejection.mjs'};
 if(id==='harness-tests')return{command:process.execPath,args:['--test','scripts/harness/policy.test.mjs','scripts/harness/process.test.mjs','scripts/harness/artifacts.test.mjs','scripts/harness/browser.test.mjs'],timeoutMs:120000};
 if(id in nodeScripts){const args=[nodeScripts[id]];if(['artifacts','browser'].includes(id))args.push('--root',root,'--out',resolve(out,id==='browser'?'browser':'artifacts.json'));if(id==='negative-proof')args.push('--root',root,'--out',resolve(out,'negative-proof.json'));return{command:process.execPath,args,timeoutMs:id==='browser'?420000:180000};}
 throw Error('DENIED action: '+id);
}
export function requireComplete(rows,required=REQUIRED){const ids=rows.map(r=>r.id);if(new Set(ids).size!==ids.length)throw Error('duplicate required step');for(const id of required){const r=rows.find(v=>v.id===id);if(!r||r.status!=='PASS'||r.exitCode!==0)throw Error('required verification missing/failed: '+id);}if(ids.some(id=>!required.includes(id)))throw Error('Unexpected verification step');}
export function recordFailure(ledger,id,fingerprint){ledger=structuredClone(ledger);const old=ledger[id]||{attempts:0,same:0};ledger[id]={attempts:old.attempts+1,same:old.fingerprint===fingerprint?old.same+1:1,fingerprint};return ledger;}
export function assertRetryAllowed(ledger,id){const e=ledger[id];if(e?.same>=2)throw Error('BLOCKED: same '+id+' error occurred twice');if(e?.attempts>=3)throw Error('BLOCKED: '+id+' reached three attempts');}
