import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('Interactive map source not found');
const literal = (expression, label) => {
  const match = script.match(expression);
  if (!match) throw new Error(`${label} not found in map source`);
  return runInNewContext(`(${match[1]})`);
};
const items = literal(/const ITEMS=(\[.*?\]);\nconst \$/s, 'ITEMS');
for (const [variable, id] of [['dolomites', 'area-d'], ['vatican', 'area-o']]) {
  Object.assign(items.find(item => item.id === id), literal(new RegExp(`Object\\.assign\\(${variable},(\\{[^;]+\\})\\);`), variable));
}
const context = literal(/const CONTEXT_LAND=(\{[^;]+\});/, 'CONTEXT_LAND');
const italy = script.match(/const italy="([^"]+)";/)?.[1];
const anchors = literal(/const NAME_ANCHORS=(\{[\s\S]*?\});/, 'NAME_ANCHORS');
const cityAnchors = literal(/const CITY_NAME_ANCHORS=(\{[^;]+\});/, 'CITY_NAME_ANCHORS');
const groups = literal(/const groups=(\{[^;]+\});\n return/, 'learning groups');
const photo = html.match(/id="school"[^>]*src="data:image\/jpeg;base64,([A-Za-z0-9+/=]+)"/)?.[1];
if (!italy || !photo) throw new Error('Map or worksheet image not found');
const selector = html.slice(html.indexOf('<select id="groupSelect">'), html.indexOf('</select>', html.indexOf('<select id="groupSelect">')));
const groupOptions = [...selector.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)]
  .filter(([, key]) => key !== 'mistakes')
  .map(([, key, title]) => ({ key, title }));
const groupItems = key => key === 'all' ? items : key.startsWith('city')
  ? items.filter(item => item.kind === 'city' && +item.code > (+key.slice(-1) - 1) * 6 && +item.code <= +key.slice(-1) * 6)
  : items.filter(item => (groups[key] || []).includes(item.id));
if (groupOptions.some(({ key }) => !groupItems(key).length)) throw new Error('Empty worksheet group');

const source = { items, context, italy, anchors, cityAnchors, groups: groupOptions.map(({ key, title }) => ({ key, title, ids: groupItems(key).map(item => item.id) })), photo };
const data = JSON.stringify(source).replace(/</g, '\\u003c');
const document = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Topo Italië · printbare leerkaarten en toetsen</title>
<style>
:root{font:15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#203039;background:#f6f5f0}*{box-sizing:border-box}
body{margin:0}.toolbar{max-width:1050px;margin:0 auto;padding:22px 18px 10px}.toolbar h1{font-size:27px;letter-spacing:-.035em;margin:0 0 3px}.toolbar p{color:#526672;margin:4px 0 15px}
.controls{display:flex;gap:10px;flex-wrap:wrap;align-items:end}.controls label{display:grid;gap:4px;font-size:13px;font-weight:700}.controls select,.controls button{min-height:42px;border:1px solid #bccbc9;border-radius:9px;background:#fff;padding:8px 10px;color:#203039;font:inherit}.controls button{background:#183038;color:white;font-weight:700;cursor:pointer}
.sheet{width:min(100% - 20px,930px);margin:16px auto 24px;padding:22px 25px 24px;background:white;border-radius:12px;box-shadow:0 9px 28px #162b2b17;break-after:page;page-break-after:always}.sheet:last-child{break-after:auto;page-break-after:auto}
.sheetHead{display:flex;justify-content:space-between;gap:10px;align-items:baseline;border-bottom:2px solid #1b454f;padding-bottom:8px;margin-bottom:9px}.sheetHead h2{font-size:19px;line-height:1.1;margin:0}.sheetHead span{color:#53707a;font-size:12px}.sheetSub{font-size:12px;color:#536974;margin:0 0 8px}.practice{display:grid;grid-template-columns:61% 1fr;gap:16px;align-items:start}.mapSvg{display:block;width:100%;height:auto;border:1px solid #bdc9c6;background:#eaf3f5}.answers{width:100%;border-collapse:collapse;font-size:13px}.answers td,.answers th{border-bottom:1px solid #dbe2de;text-align:left;padding:7px 4px;vertical-align:top}.answers th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#526772}.answers .code{font-weight:800;width:44px}.answers .blank{height:27px;min-width:90px;border-bottom:1px solid #91a09b}.answers .name{font-weight:650}.smallNote{font-size:11px;line-height:1.35;color:#536974;margin:11px 0 0}
@media(max-width:670px){.sheet{padding:14px}.practice{grid-template-columns:1fr}.mapSvg{max-width:540px;margin:auto}.answers{max-width:550px;margin:auto}}
@page{size:A4 portrait;margin:9mm}
@media print{html,body{background:#fff}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.toolbar{display:none}.sheet{width:auto;max-width:none;margin:0;padding:0;border:0;border-radius:0;box-shadow:none;min-height:0}.sheetHead{margin-bottom:5mm}.sheetSub{margin-bottom:3mm}.practice{grid-template-columns:61% 1fr;gap:4mm}.answers{font-size:10pt}.answers td,.answers th{padding:3mm 1mm}.answers .blank{height:6mm}.smallNote{font-size:8pt}svg{max-height:258mm}}
</style></head><body>
<header class="toolbar"><h1>Topo Italië · printversie</h1><p>Kies een groep en een blad. De codes en namen komen uit dezelfde 45 onderdelen als de interactieve toets.</p>
<div class="controls"><label>Groep<select id="group"></select></label><label>Blad<select id="format"><option value="learn">Leerkaart · namen en codes</option><option value="codeName">Toets · code → naam</option><option value="nameCode">Toets · naam → code</option></select></label><label>Kaart<select id="mapStyle"><option value="clean">Heldere Topo-kaart</option><option value="school">Origineel schoolblad</option></select></label><button type="button" id="print">Print dit blad</button></div></header>
<main id="pages"></main>
<script>
const DATA=${data};
const byId=Object.fromEntries(DATA.items.map(item=>[item.id,item]));
const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const path=(d,fill,stroke='#a6b1a9',width=1.7)=>'<path d="'+esc(d)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linejoin="round"/>';
function label(item,format){
 if(format==='nameCode')return '';
 const city=item.kind==='city',custom=DATA.cityAnchors[item.id],anchor=city?[item.px+(custom?-10:12),item.py-12]:DATA.anchors[item.id]||[item.px,item.py];
 const [x,y]=anchor,text=format==='learn'?item.code+' · '+item.name:item.code;
 const w=Math.min(194,Math.max(23,text.length*(format==='learn'?8:9)+10));
 const left=city&&custom?x-w:x-w/2;
 return '<g><rect x="'+left+'" y="'+(y-16)+'" width="'+w+'" height="21" rx="5" fill="#fff" fill-opacity=".95" stroke="#738985" stroke-width="1"/><text x="'+(left+w/2)+'" y="'+y+'" text-anchor="middle" font-size="'+(format==='learn'?13:17)+'" font-family="system-ui,sans-serif" font-weight="800" fill="#193740">'+esc(text)+'</text></g>';
}
function mapMarkup(items,format,style){
 let svg='<svg class="mapSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 890 1235" role="img" aria-label="Kaart van Italië met '+esc(items.length)+' oefenplekken">';
 if(style==='school')svg+='<image href="data:image/jpeg;base64,'+DATA.photo+'" x="0" y="0" width="890" height="1235"/>';
 else{
  svg+='<rect width="890" height="1235" fill="#eaf3f5"/>';
  for(const item of DATA.items.filter(item=>item.kind==='water'))svg+=path(item.shape,'#d6edf2','#a5c7ca',1);
  for(const d of Object.values(DATA.context))svg+=path(d,'#f4f2e9','#b8beb2',1.5);
  for(const item of DATA.items.filter(item=>['area-i','area-j','area-k','area-l','area-m'].includes(item.id)))svg+=path(item.shape,'#eee8d8','#9caa9d',1.5);
  svg+=path(DATA.italy,'#f5ead2','#9b9d8f',2.5);
  for(const item of DATA.items.filter(item=>['area-a','area-b'].includes(item.id)))svg+=path(item.shape,'#f5ead2','#9b9d8f',2.5);
  for(const item of DATA.items.filter(item=>item.kind==='area'&&!['area-a','area-b','area-i','area-j','area-k','area-l','area-m','area-e','area-f','area-n','area-o'].includes(item.id)))svg+=path(item.shape,'#e9cda276','#bd9877',1.8);
  for(const item of DATA.items.filter(item=>item.kind==='river'))svg+=path(item.shape,'none','#669eaf',5);
  for(const item of DATA.items.filter(item=>item.kind==='city'))svg+='<circle cx="'+item.px+'" cy="'+item.py+'" r="6" fill="#a44435" stroke="#fff" stroke-width="2"/>';
  for(const item of DATA.items.filter(item=>['area-n','area-o','area-e','area-f'].includes(item.id)))svg+='<circle cx="'+item.px+'" cy="'+item.py+'" r="'+(item.id==='area-o'?3:5)+'" fill="#814737" stroke="#fff" stroke-width="1"/>';
 }
 svg+=items.map(item=>label(item,format)).join('')+'</svg>';
 return svg;
}
function table(items,format){
 const heading=format==='nameCode'?'<th>Naam</th><th>Letter / nummer</th>':'<th>Letter / nummer</th><th>Naam</th>';
 return '<table class="answers"><thead><tr>'+heading+'</tr></thead><tbody>'+items.map(item=>{
  const code=esc(item.code),name=esc(item.name);
  return format==='nameCode'?'<tr><td class="name">'+name+'</td><td class="blank"></td></tr>'
   :'<tr><td class="code">'+code+'</td><td class="'+(format==='learn'?'name':'blank')+'">'+(format==='learn'?name:'')+'</td></tr>';
 }).join('')+'</tbody></table>';
}
function render(){
 const group=$('#group').value,format=$('#format').value,style=$('#mapStyle').value;
 const choices=group==='all'?DATA.groups.filter(entry=>entry.key!=='all'):DATA.groups.filter(entry=>entry.key===group);
 $('#pages').innerHTML=choices.map((entry,index)=>{
  const items=entry.ids.map(id=>byId[id]);
  const title=format==='learn'?'Leerkaart':format==='codeName'?'Toets · schrijf de naam':'Toets · schrijf de code';
  const note=format==='nameCode'?'Schrijf het juiste nummer of de juiste letter. Kleine letters a–o en hoofdletters A–G verschillen.':format==='codeName'?'Schrijf bij elke code de volledige naam.':'Bekijk de codes en noem elke plek hardop.';
  return '<section class="sheet"><div class="sheetHead"><h2>Topo Italië · '+esc(entry.title)+'</h2><span>'+title+' · '+items.length+' namen'+(group==='all'?' · blad '+(index+1)+'/'+choices.length:'')+'</span></div><p class="sheetSub">Naam: ____________________________ &nbsp; Datum: ______________ &nbsp; '+esc(note)+'</p><div class="practice">'+mapMarkup(items,format,style)+table(items,format)+'</div><p class="smallNote">De schoolfoto is een gefotografeerd werkblad. De heldere kaart volgt de huidige Topo-kaart; rivieren en sommige gebieden zijn schematische oefenvormen. Gebruik de interactieve versie om antwoorden te controleren.</p></section>';
 }).join('');
}
$('#group').innerHTML=DATA.groups.map(entry=>'<option value="'+esc(entry.key)+'">'+esc(entry.title)+(entry.key==='all'?' · alle deelbladen':'')+'</option>').join('');
$('#group').value='city1';
for(const id of ['group','format','mapStyle'])$('#'+id).addEventListener('change',render);
$('#print').addEventListener('click',()=>window.print());
render();
</script></body></html>`;
writeFileSync(new URL('print.html', root), document);
console.log(`Generated print.html from ${items.length} current worksheet items and ${groupOptions.length} groups`);
