import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),base='assets/nino/rewards/pizza/';
const read=p=>readFileSync(new URL(p,root));
const hash=b=>createHash('sha256').update(b).digest('hex');
const source=JSON.parse(read(base+'manifest.json'));
for(const [path,meta] of Object.entries(source.files)){const b=read(base+path);if(b.length!==meta.bytes||hash(b)!==meta.sha256)throw Error('Pizza source checksum mismatch: '+path)}
const runtime=JSON.parse(read(base+'runtime-manifest.json')),assets={};
for(const [key,meta] of Object.entries(runtime.assets)){
 const b=read(base+meta.path);if(b.length!==meta.bytes||hash(b)!==meta.sha256)throw Error('Runtime checksum mismatch: '+key);
 if(key!=='closed')assets[key]='data:image/webp;base64,'+b.toString('base64');
}
let html=read('index.html').toString();
const code='// BEGIN PIZZA REWARD\nwindow.TOPO_PIZZA_ART='+JSON.stringify({sourceCommit:runtime.sourceCommit,assets})+';\n'+read('scripts/pizza-reward.js')+'// END PIZZA REWARD';
const css='/* BEGIN PIZZA REWARD CSS */\n:root{--pizza-board:url("'+assets.board+'")}\n'+read('scripts/pizza-reward.css')+'/* END PIZZA REWARD CSS */';
html=html.replace(/\/\/ BEGIN PIZZA REWARD[\s\S]*?\/\/ END PIZZA REWARD\b/,()=>code).replace(/\/\* BEGIN PIZZA REWARD CSS \*\/[\s\S]*?\/\* END PIZZA REWARD CSS \*\//,()=>css);
writeFileSync(new URL('index.html',root),html);
console.log('Pizza: 85 source assets checksum-verified; inline runtime atlases + board + boxes + approved Nino Travel');
