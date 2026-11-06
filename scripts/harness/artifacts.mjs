import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

export const EXPECTED_HTML_SHA256='933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35';
export const ARTIFACT_PATHS=Object.freeze(['index.html',...['TOPO-NINO-Computer-Release.html','TOPO-Italie-Computer.html','topo-italie-interactief.html','topo-italie-duolingo.html','NINO-2-Proefversie-2026-11-04.html'].map(p=>'output/html/'+p),'dist/index.html']);
const hash=b=>createHash('sha256').update(b).digest('hex');
// This is an invariant checker for trusted, pinned repository sources, not an HTML
// sanitizer or VM security boundary. Browser behavior is checked separately.
export function verifyArtifacts(root,{expectedHtmlSha256=EXPECTED_HTML_SHA256}={}){
 root=resolve(root);const errors=[],files={},checks={};
 const read=p=>readFileSync(resolve(root,p));
 const check=(name,fn)=>{try{checks[name]=fn()??true}catch(e){checks[name]=false;errors.push(name+': '+e.message)}};
 let canonical;
 for(const p of ARTIFACT_PATHS){try{const b=read(p);files[p]={bytes:b.length,sha256:hash(b)};if(p==='index.html')canonical=b;else if(canonical&&!b.equals(canonical))errors.push('byte parity: '+p);}catch(e){errors.push('missing/unreadable artifact '+p+': '+e.code)}}
 if(canonical){
 const html=canonical.toString('utf8');
 check('pinned SHA256',()=>{if(hash(canonical)!==expectedHtmlSha256)throw Error('canonical differs from expected '+expectedHtmlSha256)});
 check('inline runtime assets',()=>{
  const allowed=v=>/^(?:data:|blob:|#)/i.test(v.trim());
  const bad=[];
  const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,m=>m.slice(0,m.indexOf('>')+1));
  for(const m of markup.matchAll(/<(script|link|img|image|use|source|video|audio|iframe|object|embed|input)\b([^>]*)>/gi)){
   const attrs=Object.fromEntries([...m[2].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(a=>[a[1].toLowerCase(),a[2]??a[3]??a[4]]));
   for(const key of ['src','href','xlink:href','poster','data'])if(attrs[key]&&!allowed(attrs[key]))bad.push(m[1]+':'+attrs[key]);
   if(attrs.srcset)for(const entry of attrs.srcset.split(/,\s+(?=\S)/))if(!allowed(entry.split(/\s+/)[0]))bad.push('srcset:'+entry);
  }
  const css=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map(m=>m[1]).join('\n')+'\n'+[...markup.matchAll(/\bstyle=(?:"([^"]*)"|'([^']*)')/gi)].map(m=>m[1]??m[2]).join('\n');
  for(const m of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi)){const value=(m[1]??m[2]??m[3]).trim();if(value&&!allowed(value))bad.push('CSS url:'+value)}
  if(/@import\s+(?:url\s*\(|["'])/i.test(css))bad.push('CSS @import');
  if(bad.length)throw Error('external asset '+bad.slice(0,8).join(', '));
 });
 check('embedded learning and route sources',()=>{for(const p of ['scripts/learning-engine.js','scripts/route-engine.js'])if(!html.includes('<script>\n'+read(p).toString().trimEnd()+'\n</script>'))throw Error('source snippet differs: '+p)});
 check('learning metadata',()=>{
  const declaration=name=>{const m=html.match(new RegExp('const '+name+'=([^\\n]+);'));if(!m)throw Error('missing '+name);return m[0]};
  const sandbox={};vm.createContext(sandbox);
  vm.runInContext([declaration('ITEMS'),declaration('GROUPS'),declaration('ROUTE_TITLES'),declaration('ROUTE_CHAPTERS'),'globalThis.result={items:ITEMS,chapters:ROUTE_CHAPTERS};'].join('\n'),sandbox,{timeout:1000});
  const {items,chapters}=sandbox.result;
  if(items.length!==45||chapters.length!==11)throw Error('expected 45 items / 11 chapters');
  const codes=items.map(i=>i.code).sort();const expected=[...Array.from({length:23},(_,i)=>String(i+1)),...'ABCDEFG',...'abcdefghijklmno'].sort();
  if(JSON.stringify(codes)!==JSON.stringify(expected))throw Error('reference school codes changed');
  if(new Set(chapters.flatMap(c=>c.itemIds)).size!==45)throw Error('chapter coverage changed');
  const ctx={};vm.createContext(ctx);vm.runInContext(read('scripts/route-engine.js').toString(),ctx,{timeout:1000});
  if(JSON.stringify(ctx.TopoRoute.STAGES)!==JSON.stringify(['discover','point','write']))throw Error('three-stage route changed');
  return {items:45,chapters:11,stages:Array.from(ctx.TopoRoute.STAGES),schoolCodes:'reference data retained'};
 });
 check('both map presentations',()=>{if(!/<svg\b[^>]*\bid="map"/.test(html)||!/<img\b[^>]*\bid="school"/.test(html)||!html.includes('id="previewMap"'))throw Error('interactive map / school reference map missing');return 'presence only; no new GIS accuracy claim'});
 check('approved artwork bytes',()=>{
  for(const p of ['assets/nino/runtime-manifest.json','assets/nino/rewards/pizza/runtime-manifest.json']){
   const manifest=JSON.parse(read(p));
   for(const meta of Object.values(manifest.assets)){
    const path=p.includes('/pizza/')?'assets/nino/rewards/pizza/'+meta.path:meta.path;
    const bytes=read(path);if(hash(bytes)!==meta.sha256)throw Error('artwork digest differs: '+path);
   }
  }
  if(!html.includes('window.TOPO_NINO_ART_DATA=')||!html.includes('window.TOPO_PIZZA_ART=')||!html.includes('Vespa'))throw Error('Nino / pizza / Vespa presentation missing');
 });
 }
 return {ok:errors.length===0,root,expectedHtmlSha256,files,checks,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{
 const args=process.argv.slice(2);let root=resolve(import.meta.dirname,'../..'),out;
 for(let i=0;i<args.length;i++){if(!['--root','--out'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw Error('usage: artifacts.mjs --root PATH --out PATH');const key=args[i++];if(key==='--root')root=args[i];else out=resolve(args[i]);}
 const result=verifyArtifacts(root);if(out){mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(result,null,2)+'\n')}
 console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;
 }catch(e){console.error(e.message);process.exitCode=1}
}
