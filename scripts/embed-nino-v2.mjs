import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root)),file=new URL('index.html',root);
let html=read('index.html').toString().replace(/<style>\/\* BEGIN NINO V2 CSS \*\/[\s\S]*?\/\* END NINO V2 CSS \*\/<\/style>/,'').replace(/\/\/ BEGIN NINO V2\n[\s\S]*?\/\/ END NINO V2\n/,'');
if(!process.argv.includes('--remove')){
 const rows=JSON.parse(read('docs/qa/nino-v2-closure-67/artwork-manifest.json')).assets,assets={};
 function add(key,path){const row=rows.find(r=>r.path===path);if(!row)throw Error('Missing delivered art '+path);const b=read(path);if(createHash('sha256').update(b).digest('hex')!==row.sha256)throw Error('Art changed '+path);assets[key]={path,sha256:row.sha256,width:row.dimensions[0],height:row.dimensions[1],src:'data:image/webp;base64,'+b.toString('base64')};}
 const prefix='assets/nino/travel-passport/';
 rows.filter(r=>r.path.includes('/chapter-icons/exports/')&&r.path.endsWith('.webp')).sort((a,b)=>a.path.localeCompare(b.path)).forEach((r,i)=>add('chapter'+i,r.path));
 rows.filter(r=>r.path.includes('/stamps/exports/')&&r.path.endsWith('.webp')).sort((a,b)=>a.path.localeCompare(b.path)).forEach((r,i)=>add('stamp'+i,r.path));
 add('welcome','assets/nino/exports/nino-welcome.webp');add('chapterGold',prefix+'gold/exports/gold-chapter-seal-v2-64.webp');add('finalGold',prefix+'gold/exports/gold-esploratore-doro-480.webp');add('arrival',prefix+'arrivo/exports/arrivo-travel.webp');
 ['margherita','salami','quattro-formaggi'].forEach((name,i)=>add('pizza'+i,'assets/nino/rewards/pizza/exports/pizza-box-open-pisa-'+name+'.webp'));
 for(const [key,name]of [['sicilia','01-sicilia-front'],['sardegna','02-sardegna-front'],['napoli','03-napoli-vesuvio-front'],['reverse','05-universal-reverse']])add(key,prefix+'postcards/exports/postcard-'+name+'.webp');
 add('venezia',prefix+'postcards/exports/postcard-04-venezia-scalloped-tight.webp');
 for(const side of ['left','right'])add('folio'+side,prefix+'book/exports/passport-blank-folio-'+side+'-alpha-normalized.webp');
 // Bounded native folios and the verified PR70 reconstructed contour; final owner acceptance remains separate.
 html=html.replace('</head>','<style>/* BEGIN NINO V2 CSS */'+read('scripts/nino-v2.css')+'/* END NINO V2 CSS */</style></head>');
 const end=html.lastIndexOf('</script>');html=html.slice(0,end)+'// BEGIN NINO V2\nconst NINO_V2_ART='+JSON.stringify(assets)+';\n'+read('scripts/nino-v2.js')+'// END NINO V2\n'+html.slice(end);
}
writeFileSync(file,html);
