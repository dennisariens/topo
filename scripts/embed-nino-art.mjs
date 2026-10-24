import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('assets/nino/runtime-manifest.json',root),'utf8'));
const assets={};
for(const [role,asset] of Object.entries(manifest.assets)){
 if(!/^assets\/nino\/(exports|chapters|postcards)\/[a-z0-9][a-z0-9-]*\.webp$/.test(asset.path))throw Error('Invalid runtime art path: '+role);
 if(![asset.width,asset.height,asset.bytes].every(n=>Number.isSafeInteger(n)&&n>0))throw Error('Invalid art dimensions/size: '+role);
 const bytes=readFileSync(new URL(asset.path,root));
 if(bytes.length!==asset.bytes||createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error('Owner export changed: '+role);
 assets[role]={...asset,src:'data:image/webp;base64,'+bytes.toString('base64')};
}
const code='// BEGIN NINO ART\nwindow.TOPO_NINO_ART_DATA='+JSON.stringify({...manifest,assets})+';\n'+readFileSync(new URL('scripts/nino-art.js',root),'utf8')+'// END NINO ART';
const file=new URL('index.html',root),html=readFileSync(file,'utf8');
if(!html.includes('// BEGIN NINO ART'))throw Error('Missing inline art marker');
let output=html.replace(/\/\/ BEGIN NINO ART[\s\S]*?\/\/ END NINO ART\b/,()=>code);
const ui=readFileSync(new URL('scripts/nino-art-ui.js',root),'utf8');
output=output.replace(/\/\/ BEGIN NINO FEEDBACK[\s\S]*?\/\/ END NINO FEEDBACK/,()=>'// BEGIN NINO FEEDBACK\n'+readFileSync(new URL('scripts/nino-feedback.js',root),'utf8')+'// END NINO FEEDBACK');
output=output.replace(/\/\/ BEGIN NINO ART UI[\s\S]*?\/\/ END NINO ART UI/,()=>'// BEGIN NINO ART UI\n'+ui+'// END NINO ART UI');
const css=readFileSync(new URL('scripts/nino-art.css',root),'utf8');
output=output.replace(/\/\* BEGIN NINO ART CSS \*\/[\s\S]*?\/\* END NINO ART CSS \*\//,()=>'/* BEGIN NINO ART CSS */\n'+css+'/* END NINO ART CSS */');
writeFileSync(file,output);
console.log('Embedded six byte-verified owner WebPs; no external runtime assets');
