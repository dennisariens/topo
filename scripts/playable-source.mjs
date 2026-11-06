/* Exact PR29 presentation and optional profile backup inverse for historical whole-file audits. */
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {applyPizzaIntegration} from './pizza-integration.mjs';import {applyProfileBackupHooks} from './nino-profile-integration.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root)),hash=b=>createHash('sha256').update(b).digest('hex');
export function withoutPlayable(html){
 if(!html.includes('// BEGIN PIZZA REWARD\n'))return html;
 const pins=JSON.parse(read('scripts/playable-source-pins.json'));
 for(const [p,h]of Object.entries(pins))if(hash(read(p))!==h)throw Error('Unexpected playable source edit: '+p);
 const base='assets/nino/rewards/pizza/',runtime=JSON.parse(read(base+'runtime-manifest.json')),assets={};
 for(const [key,meta]of Object.entries(runtime.assets)){const b=read(base+meta.path);if(hash(b)!==meta.sha256)throw Error('Pizza runtime bytes changed');if(key!=='closed')assets[key]='data:image/webp;base64,'+b.toString('base64');}
 const code='// BEGIN PIZZA REWARD\nwindow.TOPO_PIZZA_ART='+JSON.stringify({sourceCommit:runtime.sourceCommit,assets})+';\n'+read('scripts/pizza-reward.js')+'// END PIZZA REWARD';
 const css='/* BEGIN PIZZA REWARD CSS */\n:root{--pizza-board:url("'+assets.board+'")}\n'+read('scripts/pizza-reward.css')+'/* END PIZZA REWARD CSS */';
 if(!html.includes(code)||!html.includes(css))throw Error('Unexpected pizza presentation block');
 html=html.replace(code+'\n','').replace(css+'\n','');
 return applyPizzaIntegration(applyProfileBackupHooks(html,{inverse:true}),{reverse:true});
}
