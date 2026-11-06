import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const repo='/Users/dennisariens/projects/topo-playable-independent-qa';
const out='/Users/dennisariens/.hermes/cache/scratch/hermes-playable-review/static';
const require=createRequire(repo+'/package.json'),{JSDOM,VirtualConsole}=require('jsdom');
const read=p=>fs.readFileSync(path.join(repo,p));
const git=(sha,p)=>execFileSync('git',['show',sha+':'+p],{cwd:repo,maxBuffer:100e6});
const hash=b=>createHash('sha256').update(b).digest('hex');
const head='b06b13059ff5e2ef7278c2d0c55597cf8a9435cf',base='8c25b7a4592dafdc0003c0021c2a9fe375d68a34';
assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:repo}).toString().trim(),head);
const html=read('index.html').toString(), result={head,base,node:process.version,checks:{},defects:{},risks:{}};
const check=result.checks;
check.artifact={bytes:read('output/html/NINO-2-Proefversie-2026-11-04.html').length,sha256:hash(read('output/html/NINO-2-Proefversie-2026-11-04.html'))};
assert.equal(check.artifact.sha256,'933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35');
check.aliases=['index.html','output/html/NINO-2-Proefversie-2026-11-04.html','output/html/TOPO-Italie-Computer.html','output/html/TOPO-NINO-Computer-Release.html','output/html/topo-italie-duolingo.html','output/html/topo-italie-interactief.html'].map(p=>({path:p,sha256:hash(read(p))}));
assert(check.aliases.every(a=>a.sha256===check.artifact.sha256));
check.protected=['scripts/learning-engine.js','scripts/route-engine.js','print.html','output/pdf/topo-italie-printboek.pdf','output/pdf/print-source.sha256','package-lock.json'].map(p=>{assert(read(p).equals(git(base,p)));return {path:p,sha256:hash(read(p)),unchanged:true};});
// Compare actual current bytes against immutable approved Git objects, not candidate manifests alone.
const pizzaPin='dcc474e8a9d1bc97559a3207b0a330423e128558',prefix='assets/nino/rewards/pizza/';
const source=JSON.parse(git(pizzaPin,prefix+'manifest.json'));
check.pizzaSource=Object.entries(source.files).map(([p,m])=>{const current=read(prefix+p),pinned=git(pizzaPin,prefix+p);assert(current.equals(pinned));assert.equal(hash(current),m.sha256);assert.equal(current.length,m.bytes);return {path:prefix+p,sha256:hash(current),bytes:current.length};});
check.pizzaModules=['scripts/pizza-reward.js','scripts/pizza-reward.css','assets/nino/rewards/pizza/runtime-manifest.json'].map(p=>{assert(read(p).equals(git(pizzaPin,p)));return {path:p,sha256:hash(read(p))};});
const pizzaData=JSON.parse(html.match(/window.TOPO_PIZZA_ART=(\{[^\n]+\});/)[1]);
const runtime=JSON.parse(git(pizzaPin,prefix+'runtime-manifest.json'));
check.pizzaEmbedded=Object.entries(runtime.assets).filter(([k])=>k!=='closed').map(([role,m])=>{const b=Buffer.from(pizzaData.assets[role].split(',')[1],'base64');assert(b.equals(git(pizzaPin,prefix+m.path)));return {role,path:prefix+m.path,sha256:hash(b)};});
const art=JSON.parse(html.match(/const NINO_V2_ART=(\{[^\n]+\});/)[1]);
const baseArt=JSON.parse(git(base,'index.html').toString().match(/const NINO_V2_ART=(\{[^\n]+\});/)[1]);
check.existingArtRoles=Object.keys(baseArt).map(role=>{assert.deepEqual(art[role],baseArt[role]);return role;});
check.favoriteArt=['favorite0','favorite1','favorite2'].map(role=>{const a=art[role],b=Buffer.from(a.src.split(',')[1],'base64');assert(b.equals(git(pizzaPin,a.path)));return {role,path:a.path,sha256:hash(b)};});
check.newArtwork=[['cover','4eb9a5ae33550d789c56d5c01393145a148565aa'],['travel','8a704cb23da97baf7197635df7fa12f06b864a24']].map(([role,pin])=>{const a=art[role],b=Buffer.from(a.src.split(',')[1],'base64');assert(b.equals(git(pin,a.path)));assert(b.equals(read(a.path)));assert.equal(hash(b),a.sha256);return {role,pin,path:a.path,bytes:b.length,sha256:hash(b),width:a.width,height:a.height};});
// New integration inverses restore all non-V2 baseline HTML exactly.
const {withoutV2}=await import(pathToFileURL(repo+'/scripts/focus-source.mjs'));
const old=git(base,'index.html').toString(),oldJs=git(base,'scripts/nino-v2.js').toString(),oldCss=git(base,'scripts/nino-v2.css').toString();
let normalizedOld=old.replace('<style>/* BEGIN NINO V2 CSS */'+oldCss+'/* END NINO V2 CSS */</style>','');
const oldBlock=normalizedOld.match(/\/\/ BEGIN NINO V2\nconst NINO_V2_ART=(\{[^\n]+\});\n/)[0]+oldJs+'// END NINO V2\n';
assert(normalizedOld.includes(oldBlock));normalizedOld=normalizedOld.replace(oldBlock,'');
const guards=[
["function renderRouteHome(preservePractice=false){\n preservePractice=preservePractice===true;\n if(!preservePractice){document.body.classList.remove('lessonFocus');exitFinish();renderDailyGoal();\n clearActive();hideLens();state.current=null;state.answered=true;}","function renderRouteHome(){\n document.body.classList.remove('lessonFocus');exitFinish();renderDailyGoal();\n clearActive();hideLens();state.current=null;state.answered=true;"],
[" if(!preservePractice)clearIllustrations();TopoArt.update(ninoSlots.welcome,"," clearIllustrations();TopoArt.update(ninoSlots.welcome,"],
[" if(!preservePractice)persist();\n}\nfunction startRouteLesson"," persist();\n}\nfunction startRouteLesson"]];
for(const [a,b]of guards){assert.equal(normalizedOld.split(a).length,2);normalizedOld=normalizedOld.replace(a,b);}
assert.equal(withoutV2(html),normalizedOld);
check.wholeFile={baselineNormalizedSha256:hash(normalizedOld),candidateNormalizedSha256:hash(withoutV2(html)),equal:true};
const outside=html.replace('function progressSnapshot(){','function progressSnapshot(){window.UNEXPECTED=true;');
assert.notEqual(withoutV2(outside),normalizedOld);
assert.throws(()=>withoutV2(html.replace('root.TopoProfile={','window.UNEXPECTED=true;root.TopoProfile={')));
assert.throws(()=>withoutV2(html.replace('function draw(target,slices,pizzas,completed=false){','function draw(target,slices,pizzas,completed=false){globalThis.UNEXPECTED=true;')));
check.auditCodeMutationsDetected=true;
const artStart=html.match(/const NINO_V2_ART=(\{[^\n]+\});/)[0];
const swapped=structuredClone(art);[swapped.stamp0,swapped.stamp1]=[swapped.stamp1,swapped.stamp0];
const fictional=structuredClone(art);fictional.folioleft.width=99999;
result.risks.historicalSemanticBlindspot={stampRoleSwapPasses:withoutV2(html.replace(artStart,'const NINO_V2_ART='+JSON.stringify(swapped)+';'))===normalizedOld,fictionalDimensionPasses:withoutV2(html.replace(artStart,'const NINO_V2_ART='+JSON.stringify(fictional)+';'))===normalizedOld,status:'Known separately OPEN; no new closure claim'};
// Profile module isolated in a VM: all writes are in-memory fake storage.
function profileBoot(initial={}){const map=new Map(Object.entries(initial));let fail=()=>false;const storage={getItem:k=>map.get(k)??null,setItem(k,v){if(fail(k,'set'))throw Error('injected storage denial');map.set(k,String(v));},removeItem(k){if(fail(k,'remove'))throw Error('injected storage denial');map.delete(k);}};const w={localStorage:storage,Intl,CustomEvent:class{},dispatchEvent(){}};w.window=w;vm.runInNewContext(read('scripts/nino-profile.js').toString(),w);return {api:w.TopoProfile,map,fail:f=>fail=f};}
const profile={schema:1,name:'Ada',coverColor:'riviera',favoritePizza:'salami'},p=profileBoot();
assert(p.api.validate(profile));for(const bad of [{...profile,schema:2},{...profile,extra:true},{...profile,name:' A '},{...profile,favoritePizza:'hawaii'}])assert(!p.api.validate(bad));
p.api.importProfile(profile);p.map.set('topo-italie-v3','old-progress');
p.fail(k=>k==='topo-italie-v3');assert.throws(()=>p.api.commitImport('new-progress',null));assert.equal(p.map.get('topo-nino-profile-v1'),JSON.stringify(profile));assert.equal(p.map.get('topo-italie-v3'),'old-progress');assert.equal(p.api.current().name,'Ada');
p.fail(()=>true);assert.throws(()=>p.api.commitImport('new-progress',{...profile,name:'New'}));assert.equal(p.map.get('topo-italie-v3'),'old-progress');
check.profileValidationAndSingleFailureRollback=true;
// One Unicode grapheme can contain arbitrarily many combining marks; this is accepted by actual validator.
const huge={...profile,name:'a'+'\u0301'.repeat(500001)},hugeApi=profileBoot().api;
assert.equal(hugeApi.normalizeName(huge.name),huge.name);assert(hugeApi.validate(huge));hugeApi.importProfile(huge);
const exported=JSON.stringify({app:'topo-italie',version:1,savedAt:new Date(0).toISOString(),progress:{schema:3},profile:hugeApi.exportProfile()},null,2);
assert(Buffer.byteLength(exported)>1000000);
result.defects.oversizedNameBackup={graphemes:Array.from(new Intl.Segmenter('nl',{granularity:'grapheme'}).segment(huge.name)).length,nameCodeUnits:huge.name.length,utf8Bytes:Buffer.byteLength(exported),validatorAccepted:true,importGuardRejects:Buffer.byteLength(exported)>1000000,qualification:'Pathological pasted Unicode; no natural learner input claim. Uses exact export structure with minimal progress, so real progress only increases size.'};
// Simulate storage becoming unavailable only AFTER initial profile write: rollback is best effort, not atomic.
const q=profileBoot({'topo-nino-profile-v1':JSON.stringify(profile),'topo-italie-v3':'old-progress'});let calls=0;q.fail(()=>++calls>1);assert.throws(()=>q.api.commitImport('new-progress',{...profile,name:'New'}));
result.risks.doubleStorageFailure={memoryName:q.api.current().name,diskName:JSON.parse(q.map.get('topo-nino-profile-v1')).name,diskProgress:q.map.get('topo-italie-v3'),qualification:'Fault-injected changing storage availability; no real browser storage scenario established'};
// Headless DOM execution only; native dialog/layout are NOT tested.
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{url:'https://independent-static.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.innerWidth=1500;w.innerHeight=1000;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.matchMedia=()=>({matches:true,addEventListener(){}});w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};}});
const w=dom.window,d=w.document;await new Promise(r=>setTimeout(r,30));
d.querySelector('[data-profile-cancel]').click();
[...d.querySelectorAll('.ninoNav button')].find(b=>b.textContent==='Reisboekje').click();
const edit=[...d.querySelectorAll('#travelBook button')].find(b=>b.textContent==='Pas mijn boekje aan');edit.focus();edit.click();
d.querySelector('.ninoProfile input[name=name]').focus();d.querySelector('[data-profile-cancel]').click();
assert(!edit.isConnected);assert.equal(d.activeElement,d.body);
result.defects.profileEditorFocus={afterCancel:d.activeElement.tagName,oldTriggerConnected:edit.isConnected,bookOpen:d.querySelector('#travelBook').open,qualification:'Actual full HTML in jsdom; showModal/close shimmed. Deterministic focused-node removal proven; native modal focus recovery requires parent browser verification.'};
// Real import handler with in-memory File stand-ins; these are not browser upload tests.
const importHandler=d.querySelector('#backupFile').onchange;
const validBackup={app:'topo-italie',version:1,progress:w.eval('progressSnapshot()'),profile:{schema:1,name:'Transfer',coverColor:'lemon',favoritePizza:null}};
async function importData(data,bytes=1000){const target={files:[{size:bytes,text:async()=>JSON.stringify(data)}],value:'fixture.json'};await importHandler({target});return d.querySelector('#backupStatus').textContent;}
const memoryBefore=w.eval('JSON.stringify(progressSnapshot())'),storeBefore=w.localStorage.getItem('topo-italie-v3'),profileBefore=w.localStorage.getItem('topo-nino-profile-v1');
for(const bad of [{...validBackup,profile:{...validBackup.profile,schema:99}},{...validBackup,progress:{...validBackup.progress,route:{schema:99}}}]){assert.match(await importData(bad),/Terugzetten lukte niet/);assert.equal(w.eval('JSON.stringify(progressSnapshot())'),memoryBefore);assert.equal(w.localStorage.getItem('topo-italie-v3'),storeBefore);assert.equal(w.localStorage.getItem('topo-nino-profile-v1'),profileBefore);}
w.confirm=()=>false;await importData(validBackup);assert.equal(w.eval('JSON.stringify(progressSnapshot())'),memoryBefore);assert.equal(w.localStorage.getItem('topo-nino-profile-v1'),profileBefore);w.confirm=()=>true;
const setItem=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,v){if(k==='topo-italie-v3')throw Error('injected quota failure');return setItem.call(this,k,v);};
assert.match(await importData(validBackup),/Terugzetten lukte niet/);assert.equal(w.eval('JSON.stringify(progressSnapshot())'),memoryBefore);assert.equal(w.localStorage.getItem('topo-italie-v3'),storeBefore);assert.equal(w.localStorage.getItem('topo-nino-profile-v1'),profileBefore);w.Storage.prototype.setItem=setItem;
assert.match(await importData(validBackup),/Je voortgang is teruggezet/);assert.equal(w.TopoProfile.current().name,'Transfer');assert.equal(JSON.parse(w.localStorage.getItem('topo-nino-profile-v1')).name,'Transfer');
const legacy={...validBackup};delete legacy.profile;assert.match(await importData(legacy),/Je voortgang is teruggezet/);assert.equal(w.TopoProfile.current(),null);assert.equal(w.localStorage.getItem('topo-nino-profile-v1'),null);
check.actualImportHandler={invalidProfileRejectedWithoutMutation:true,invalidRouteRejectedWithoutMutation:true,cancelWithoutMutation:true,progressWriteFailureRollsBackProfileAndLeavesMemory:true,validProfileImport:true,legacyBackupAccepted:true,legacyImportClearsOptionalProfile:true};
check.fullDomErrors=errors;assert.deepEqual(errors,[]);dom.window.close();
// Authoritative award cadence with presentation calls cannot mutate learning state.
const pd=new JSDOM('<div class="pizzaWheel"></div>',{runScripts:'outside-only'}),pw=pd.window;
pw.TOPO_PIZZA_ART=pizzaData;pw.eval(read('scripts/pizza-reward.js').toString());pw.eval(read('scripts/learning-engine.js').toString());
let clock=0,timers=[],trips=[];const ui=pw.TopoPizza.createCelebrations({document:pw.document,onTrip:e=>trips.push({clock,to:e.to}),schedule:(fn,delay)=>{const t={fn,at:clock+delay};timers.push(t);return t;},cancel:t=>t.cancelled=true});
const advance=()=>{timers.sort((a,b)=>a.at-b.at);const t=timers.shift();if(t&&!t.cancelled){clock=t.at;t.fn();}};
const state={good:0,pizzas:0,slices:0,trips:0},events=[];
for(let i=1;i<=72;i++){const event=pw.TopoLearning.award(state);assert.equal(state.slices,i%8);assert.equal(state.pizzas,Math.floor(i/8));assert.equal(state.trips,Math.floor(i/24));const before=JSON.stringify(state);pw.TopoPizza.draw(pw.document.querySelector('.pizzaWheel'),state.slices,state.pizzas);assert.equal(JSON.stringify(state),before);if(event.pizza){ui.enqueue({...event,pizzas:state.pizzas});events.push({answer:i,total:state.pizzas,next:pw.TopoPizza.flavor(state.pizzas),completed:pw.TopoPizza.flavor(state.pizzas,true)});}}
while(timers.length)advance();assert.equal(trips.length,3);assert(!ui.busy);
check.cadence={answers:72,events,trips,final:state,noPresentationStateMutation:true};
ui.enqueue({pizza:true,pizzas:3,trip:true});ui.clear();while(timers.length)advance();assert.equal(trips.length,3);assert(!ui.busy);check.queueResetCancelsTrip=true;pd.window.close();
fs.writeFileSync(out+'/measurements.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({head,artifact:check.artifact,pizzaSourceCount:check.pizzaSource.length,newArtwork:check.newArtwork,wholeFile:check.wholeFile,defects:result.defects,risks:result.risks,cadence:check.cadence,allAssertionsPassed:true},null,2));
