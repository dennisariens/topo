import {execFileSync} from 'node:child_process';
import {readFileSync,lstatSync} from 'node:fs';
import {resolve,posix} from 'node:path';
import {createHash} from 'node:crypto';
import {requireComplete} from '../policy.mjs';
export const V1='a86975272ee700d79ab04fe5429ab91165f2029d';
export const APP_HASH='933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35';
export const git=(root,args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64e6});
export const digest=value=>createHash('sha256').update(value).digest('hex');
const prefixes=['scripts/harness/v2/','.harness/v2/','.harness/tasks/TOPO-HARNESS-002/','.harness/tasks/TOPO-PILOT-001/','docs/brain/'];
export function allowedV2Path(p){return typeof p==='string'&&!p.includes('\\')&&!p.startsWith('/')&&posix.normalize(p)===p&&!p.split('/').includes('..')&&(prefixes.some(v=>p.startsWith(v))||p==='.github/workflows/harness.yml');}
export function metadataOnly(paths){return paths.every(p=>/^\.harness\/tasks\/(TOPO-HARNESS-002|TOPO-PILOT-001)\/(STATE|EVIDENCE)\.md$/.test(p)||(/^\.harness\/tasks\/(TOPO-HARNESS-002|TOPO-PILOT-001)\/evidence\//.test(p)&&/\.(json|log|md|txt|png)$/.test(p))||/^docs\/brain\/(README|current-state|product|design|skills|lessons|review-queue)\.md$/.test(p)||p==='docs/brain/index.json');}
export function validateV1Result(r){if(r.status!=='PASS'||r.sourceSha!==V1)throw Error('V1 verdict missing or stale');requireComplete(r.results);return true;}
export function expectedWorkflow(root){const w=JSON.parse(git(root,['show',V1+':.github/workflows/harness.yml']));w.jobs.verify.steps.find(s=>s.name==='Execute required quality gate').run='if [ -f scripts/harness/v2/gate.mjs ]; then node scripts/harness/v2/gate.mjs; else ./check.sh TOPO-HARNESS-001; fi';w.jobs.verify.steps.at(-1).with.path='.harness/tasks/TOPO-HARNESS-001/\n.harness/tasks/TOPO-HARNESS-002/\n.harness/tasks/TOPO-PILOT-001/';return w;}
export function scope(root,{base=V1,committed=true}={}){
 const paths=git(root,['diff','--name-only','-z',base,'--']).split('\0').filter(Boolean);
 const untracked=git(root,['ls-files','--others','--exclude-standard','-z']).split('\0').filter(Boolean);
 for(const p of new Set([...paths,...untracked])){if(!allowedV2Path(p))throw Error('DENIED V2 modification: '+p);const parts=p.split('/');for(let i=1;i<=parts.length;i++){try{if(lstatSync(resolve(root,...parts.slice(0,i))).isSymbolicLink())throw Error('DENIED symlink: '+p);}catch(e){if(e.code!=='ENOENT')throw e;}}}
 if(base===V1){const existing=new Set(git(root,['ls-tree','-r','--name-only',V1]).trim().split('\n'));for(const p of paths)if(existing.has(p)&&p!=='.github/workflows/harness.yml')throw Error('DENIED immutable V1 file: '+p);if(JSON.stringify(JSON.parse(readFileSync(resolve(root,'.github/workflows/harness.yml'))))!==JSON.stringify(expectedWorkflow(root)))throw Error('DENIED CI permission/step expansion');}
 if(committed){const dirty=git(root,['status','--porcelain','--untracked-files=all']).split('\n').filter(Boolean).map(p=>p.slice(3));if(dirty.some(p=>!/^\.harness\/tasks\/(TOPO-HARNESS-002|TOPO-PILOT-001)\/(STATE|EVIDENCE)\.md$/.test(p)))throw Error('DENIED uncommitted verification inputs');}
 return {status:'PASS',base,paths};
}
export function implementationDigest(root){const paths=git(root,['ls-files','-z']).split('\0').filter(p=>p&&(p.startsWith('scripts/harness/v2/')||p.startsWith('.harness/v2/')||p==='.github/workflows/harness.yml'));return digest(paths.sort().map(p=>p+'\0'+readFileSync(resolve(root,p))).join('\0'));}
