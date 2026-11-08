import {withoutPlayable} from './playable-source.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// Historical source audits may exclude ONLY the exact two NINO favicon links (replaced the PR65 icons on 7 November 2026).
// Verify pinned binary hashes first; arbitrary contents inside the marker fail.
export function withoutMicroIcons(html){
 html=withoutCplus(withoutV2(html));
 if(!html.includes('<!-- BEGIN NINO MICRO ICONS -->'))return html;
 const files=[['NINO-favicon-16.png','3a3e320851dbdd3c87210cba284aade1d95f8efdb0a677f82600c2b372272143'],['NINO-favicon-32.png','3f737bc4f4910f16f7065f73fcfc9dff76b33718ee4f4ad7706b00a006aba1d9']];
 const data=files.map(([name,sha])=>{const b=readFileSync(new URL('../assets/nino/app-icon/favicon-n/'+name,import.meta.url));if(createHash('sha256').update(b).digest('hex')!==sha)throw Error('NINO favicon bytes changed');return b.toString('base64')});
 const exact='<!-- BEGIN NINO MICRO ICONS -->\n<link rel="icon" type="image/png" sizes="16x16" href="data:image/png;base64,'+data[0]+'">\n<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,'+data[1]+'">\n<!-- END NINO MICRO ICONS -->\n';
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
 const css=['nino-v2.css','nino-profile.css','nino-moments.css','nino-exam-result.css'].map(f=>readFileSync(new URL(f,import.meta.url),'utf8')).join(''),js=['nino-profile.js','nino-v2.js','nino-moments.js','nino-exam-result.js'].map(f=>readFileSync(new URL(f,import.meta.url),'utf8')).join('');
 const style='<style>/* BEGIN NINO V2 CSS */'+css+'/* END NINO V2 CSS */</style>';
 if(createHash('sha256').update(css).digest('hex')!=='48e4ca07e7c3f610080a3f6dc5a6b5866dbd0e762002385e7d5a97be2bd55002'||createHash('sha256').update(js).digest('hex')!=='0a52963a95319c9fb470c10ce03aa2f73270d7d55f6616ed8169eeed8233ae66')throw Error('Reviewed V2 component source changed');
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
