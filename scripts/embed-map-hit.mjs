import{readFileSync,writeFileSync}from'node:fs';
const root=new URL('../',import.meta.url),file=new URL('index.html',root);
const sourceFile=new URL('scripts/map-hit.js',root),asset=readFileSync(new URL('assets/map-selection/TOPO-Rome-Vaticaanstad-approved-refined.svg',root),'utf8');
if(/<script|<foreignObject|(?:href|src)\s*=|\son[a-z]+\s*=/i.test(asset))throw Error('Approved SVG must be self-contained and inert');
const html=readFileSync(file,'utf8'),source=readFileSync(sourceFile,'utf8').replace(/\/\/ BEGIN APPROVED ROME SVG[\s\S]*?\/\/ END APPROVED ROME SVG/,()=> '// BEGIN APPROVED ROME SVG\nconst mapPickerApprovedRomeSvg = '+JSON.stringify(asset)+';\n// END APPROVED ROME SVG');
writeFileSync(sourceFile,source);
if(!html.includes('// BEGIN MAP HIT'))throw Error('Missing map resolver marker');
writeFileSync(file,html.replace(/\/\/ BEGIN MAP HIT[\s\S]*?\/\/ END MAP HIT/,()=>'// BEGIN MAP HIT\n'+source+'// END MAP HIT'));
console.log('Semantic map tap resolver embedded; original SVG geometry and engines retained');
