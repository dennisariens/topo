import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),file=new URL('index.html',root),html=readFileSync(file,'utf8');
// Owner-supplied NINO favicon (cream N on dark green), 7 November 2026. It replaces the PR65 micro icons.
// Standalone downloads need no sibling files.
export const FAVICON_ROOT='assets/nino/app-icon/favicon-n/';
const iconManifest=JSON.parse(readFileSync(new URL(FAVICON_ROOT+'manifest.json',root),'utf8'));
const iconData={};
for(const [name,expected] of Object.entries(iconManifest.files)){
 const bytes=readFileSync(new URL(FAVICON_ROOT+name,root));
 if(bytes.length!==expected.bytes||createHash('sha256').update(bytes).digest('hex')!==expected.sha256)throw Error('Approved favicon changed: '+name);
 iconData[name]=bytes.toString('base64');
}
const icons='<!-- BEGIN NINO MICRO ICONS -->\n'+
 [16,32].map(size=>'<link rel="icon" type="image/png" sizes="'+size+'x'+size+'" href="data:image/png;base64,'+iconData['NINO-favicon-'+size+'.png']+'">').join('\n')+
 '\n<!-- END NINO MICRO ICONS -->';
writeFileSync(file,html.includes('<!-- BEGIN NINO MICRO ICONS -->')?html.replace(/<!-- BEGIN NINO MICRO ICONS -->[\s\S]*?<!-- END NINO MICRO ICONS -->/,()=>icons):html.replace('</head>',icons+'\n</head>'));
console.log('Embedded pinned NINO favicon (16 and 32 px); no external icon requests');
