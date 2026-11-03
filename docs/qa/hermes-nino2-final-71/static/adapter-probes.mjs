// In-memory negative probes only; no application writes or browser/npm.
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {withoutCplus,withoutV2} from '../../../../scripts/focus-source.mjs';
const root=new URL('../../../../',import.meta.url),html=readFileSync(new URL('index.html',root),'utf8');
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim();
if(sha!=='2c52f121b853d1d8a46555d725ef79c97e0bf85b')throw Error('Wrong tested SHA');
const baseline=execFileSync('git',['show','2a9dda3d3d8ec567687bc3b61bf9cbde645c752c:index.html'],{cwd:root,maxBuffer:40e6}).toString();
const match=html.match(/const NINO_V2_ART=(\{[^\n]+\});/),data=JSON.parse(match[1]),results=[];
function probe(name,h){let normalized=null,error=null;try{normalized=withoutCplus(withoutV2(h));}catch(e){error=e.message;}results.push({name,adapterRejected:!!error,error,fullBaselineEquality:normalized===baseline});}
probe('unaltered',html);
probe('injected V2 script',html.replace('// END NINO V2\n','globalThis.INJECTED=true;\n// END NINO V2\n'));
probe('outside V2 edit',html.replace('<body>','<body data-unapproved="true">'));
const remap=structuredClone(data);[remap.stamp0,remap.stamp1]=[remap.stamp1,remap.stamp0];probe('art role stamp0/stamp1 swap',html.replace(match[0],'const NINO_V2_ART='+JSON.stringify(remap)+';'));
const dims=structuredClone(data);dims.folioleft.width=9999;probe('folio metadata width changed',html.replace(match[0],'const NINO_V2_ART='+JSON.stringify(dims)+';'));
writeFileSync(new URL('adapter-probes.json',import.meta.url),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
