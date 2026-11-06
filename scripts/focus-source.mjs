import {withoutPlayable} from './playable-source.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// Historical source audits may exclude ONLY the exact three PR65 favicon links.
// Verify pinned binary hashes first; arbitrary contents inside the marker fail.
export function withoutMicroIcons(html){
 html=withoutCplus(withoutV2(html));
 if(!html.includes('<!-- BEGIN NINO MICRO ICONS -->'))return html;
 const files=[['favicon.ico','d61343a127d7cae32c86a61f0b41c571b281de8126bea4869d010db0d2d99240'],['topo-nino-italy-only-16.png','ca4d68e3f5c65b0ef8a1b311f4c5c80caafc8f90d3a2f816dda8beb0a5916d75'],['topo-nino-scooter-italy-32.png','37c261684da5734eb56f3f3e6ed86a1a5c696c47f62b43c2899caa6a99072a0a']];
 const data=files.map(([name,sha])=>{const b=readFileSync(new URL('../assets/nino/app-icon/micro-v2/'+name,import.meta.url));if(createHash('sha256').update(b).digest('hex')!==sha)throw Error('PR65 icon bytes changed');return b.toString('base64')});
 const exact='<!-- BEGIN NINO MICRO ICONS -->\n<link rel="icon" type="image/x-icon" sizes="16x16 32x32" href="data:image/x-icon;base64,'+data[0]+'">\n<link rel="icon" type="image/png" sizes="16x16" href="data:image/png;base64,'+data[1]+'">\n<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,'+data[2]+'">\n<!-- END NINO MICRO ICONS -->\n';
 if(!html.includes(exact))throw Error('Unexpected content in bounded micro favicon block');
 return html.replace(exact,'');
}
export function withoutCplus(html){
 if(!html.includes('/* BEGIN NINO CPLUS */'))return html;
 const css=readFileSync(new URL('nino-cplus.css',import.meta.url),'utf8');
 if(createHash('sha256').update(css).digest('hex')!=='6ae57c87df8c452643768e6be3878aca226b937d79da26800d30949b632cd3d9')throw Error('Approved PR69 CSS changed');
 const exact='/* BEGIN NINO CPLUS */\n'+css+'/* END NINO CPLUS */\n';
 if(!html.includes(exact))throw Error('Unexpected content in C+ presentation block');
 return html.replace('<style>'+exact+'</style>','').replace(exact,'').replace('<title>NINO · La Grande Avventura · Topografie Italië</title>','<title>Topo Italië · leer de kaart</title>');
}
// Presentation is isolated; never exclude geographic, hotfix or learning source from audits.
export function withoutFocus(html){return withoutMicroIcons(html).replace(/\/\* BEGIN FOCUS MODE \*\/[\s\S]*?\/\* END FOCUS MODE \*\/\n?/,'').replace(/\/\/ BEGIN FOCUS MODE\n[\s\S]*?\/\/ END FOCUS MODE\n/,'');}

export function withoutV2(html){
 if(!html.includes('// BEGIN NINO V2\n'))return html;
 const css=['nino-v2.css','nino-profile.css','nino-moments.css'].map(f=>readFileSync(new URL(f,import.meta.url),'utf8')).join(''),js=['nino-profile.js','nino-v2.js','nino-moments.js'].map(f=>readFileSync(new URL(f,import.meta.url),'utf8')).join('');
 const style='<style>/* BEGIN NINO V2 CSS */'+css+'/* END NINO V2 CSS */</style>';
 if(createHash('sha256').update(css).digest('hex')!=='00483d44c346ebfa3f1c5322a12d7c9636e2f05a013c9a0f8d7a71465cecc5bb'||createHash('sha256').update(js).digest('hex')!=='0c48da6c73b5e5931db51e65469df732c6eb324ba9c760f80e374daeb693bee0')throw Error('Reviewed V2 component source changed');
 if(!html.includes(style))throw Error('V2 CSS differs from reviewed component');
 const match=html.match(/\/\/ BEGIN NINO V2\nconst NINO_V2_ART=(\{[^\n]+\});\n/);if(!match)throw Error('Missing V2 art data');
 const data=JSON.parse(match[1]);
 const ledger=JSON.parse(readFileSync(new URL('../docs/qa/nino-v2-closure-67/artwork-manifest.json',import.meta.url),'utf8'));ledger.assets.push(...Object.values(JSON.parse(readFileSync(new URL('../assets/nino/playable-art-manifest.json',import.meta.url),'utf8'))));
 for(const a of Object.values(data)){const row=ledger.assets.find(r=>r.path===a.path);if(!row||row.sha256!==a.sha256||a.src!=='data:image/webp;base64,'+readFileSync(new URL('../'+a.path,import.meta.url)).toString('base64'))throw Error('Unverified V2 art bytes');}
 const exact=match[0]+js+'// END NINO V2\n';if(!html.includes(exact))throw Error('Unexpected V2 script contents');
 // F1: remove only the exact presentation-only guards, restoring the pinned renderer.
 const guards=[
  ["function renderRouteHome(preservePractice=false){\n preservePractice=preservePractice===true;\n if(!preservePractice){document.body.classList.remove('lessonFocus');exitFinish();renderDailyGoal();\n clearActive();hideLens();state.current=null;state.answered=true;}","function renderRouteHome(){\n document.body.classList.remove('lessonFocus');exitFinish();renderDailyGoal();\n clearActive();hideLens();state.current=null;state.answered=true;"],
  [" if(!preservePractice)clearIllustrations();TopoArt.update(ninoSlots.welcome,"," clearIllustrations();TopoArt.update(ninoSlots.welcome,"],
  [" if(!preservePractice)persist();\n}\nfunction startRouteLesson"," persist();\n}\nfunction startRouteLesson"]
 ];
 for(const [changed,original]of guards){if(html.split(changed).length!==2)throw Error('Unexpected F1 navigation guard');html=html.replace(changed,original);}
 return withoutPlayable(html.replace(style,'').replace(exact,''));
}
