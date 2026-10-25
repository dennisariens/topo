import{readFileSync,writeFileSync}from'node:fs';
const root=new URL('../',import.meta.url),file=new URL('index.html',root);
const html=readFileSync(file,'utf8'),source=readFileSync(new URL('scripts/map-hit.js',root),'utf8');
if(!html.includes('// BEGIN MAP HIT'))throw Error('Missing map resolver marker');
writeFileSync(file,html.replace(/\/\/ BEGIN MAP HIT[\s\S]*?\/\/ END MAP HIT/,()=>'// BEGIN MAP HIT\n'+source+'// END MAP HIT'));
console.log('Semantic map tap resolver embedded; original SVG geometry and engines retained');
