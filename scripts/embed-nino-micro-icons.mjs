import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),file=new URL('index.html',root),html=readFileSync(file,'utf8');
// Owner-approved PR65 micro icons; standalone downloads need no sibling files.
const iconRoot='assets/nino/app-icon/micro-v2/';
const iconManifest=JSON.parse(readFileSync(new URL(iconRoot+'manifest.json',root),'utf8'));
const iconData={};
for(const [name,expected] of Object.entries(iconManifest.files)){
 const bytes=readFileSync(new URL(iconRoot+name,root));
 if(bytes.length!==expected.bytes||createHash('sha256').update(bytes).digest('hex')!==expected.sha256)throw Error('Approved micro icon changed: '+name);
 iconData[name]=bytes.toString('base64');
}
const icons='<!-- BEGIN NINO MICRO ICONS -->\n'+
 '<link rel="icon" type="image/x-icon" sizes="16x16 32x32" href="data:image/x-icon;base64,'+iconData['favicon.ico']+'">\n'+
 [16,32].map(size=>'<link rel="icon" type="image/png" sizes="'+size+'x'+size+'" href="data:image/png;base64,'+iconData[size===16?'topo-nino-italy-only-16.png':'topo-nino-scooter-italy-32.png']+'">').join('\n')+
 '\n<!-- END NINO MICRO ICONS -->';
writeFileSync(file,html.includes('<!-- BEGIN NINO MICRO ICONS -->')?html.replace(/<!-- BEGIN NINO MICRO ICONS -->[\s\S]*?<!-- END NINO MICRO ICONS -->/,()=>icons):html.replace('</head>',icons+'\n</head>'));
console.log('Embedded pinned PR65 micro favicons; no external icon requests');
