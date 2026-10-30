import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL(process.env.QA_OUTPUT||'../docs/visual/map-picker-58-revision/',import.meta.url);mkdirSync(out,{recursive:true});
const cases=[['rome',['city-9','area-o']],['naples',['city-6','area-e']],['etna',['city-15','area-f']],['bologna',['city-2','city-20']],['milan',['city-5','city-13']],['san-marino',['city-3','area-n']],['sea',['water-C','water-D']]];
const sizes=[['desktop',1500,1000],['landscape',1180,820],['portrait',820,1180],['phone',390,844],['small-phone',320,568]];
const inventory=JSON.parse(readFileSync(new URL('docs/visual/map-picker-58/collision-results.json',root),'utf8')).records;
const b=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),records=[],layoutRecords=[],errors=[],external=[];
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});p.on('dialog',d=>d.accept())}
async function fixture(p,ids,random=0,requested=ids[0]){await p.evaluate(({ids,random,requested})=>{mode('point');state.current=byId[requested];state.questionMode='point';state.answered=false;clearActive();hideLens();$('#prompt').textContent='Waar ligt '+state.current.name+'?';message('Klik op de plek of de vorm op de kaart.');mapChoiceRandom=()=>random;openMapPicker(ids.map(id=>byId[id]));},{ids,random,requested})}
import {metrics,check} from './map-picker-visibility.mjs';

try{
 for(const [name,width,height]of sizes){
  const c=await b.newContext({viewport:{width,height},offline:true,reducedMotion:'reduce'}),p=await c.newPage();watch(p);await p.goto(new URL('output/html/TOPO-Italie-Computer.html',root).href);
  for(const style of ['school','discovery']){await p.evaluate(s=>document.querySelector('.atlasOptions input[value="'+s+'"]').click(),style);
   for(const [key,ids]of cases)for(const random of [0,.99999]){
    let shape;
    for(const requested of ids){await fixture(p,ids,random,requested);const m=await metrics(p);check(m,ids,[name,style,key,random,requested].join('/'));
     const rendered=(await p.locator('.pickerViewport').innerHTML()).replace(/picker-sea-\d+/g,'picker-sea-mask');if(shape)assert.equal(rendered,shape,'answer-dependent rendering');shape=rendered;
     if(requested===ids[0]&&random===0)await p.screenshot({path:new URL('revised-'+name+'-'+style+'-'+key+'.png',out).pathname});
     const before=await p.evaluate(()=>state.good);await p.locator('[data-map-choice="'+ids[0]+'"]').press('Enter');assert.equal(await p.locator('#message').evaluate(n=>n.classList.contains('good')),requested===ids[0]);assert.equal(await p.evaluate(()=>state.good),before+(requested===ids[0]?1:0));
     records.push({name,width,height,style,key,ids,random,requested,selected:ids[0],correct:requested===ids[0],metrics:m,coverage:'explicit requested-question/render fixture; real answer-button activation'});
    }
   }
  }
  // Every previously enumerated real candidate set, including the 22 phone
  // entries which must not be misreported as normal-route/physical tap passes.
  const sets=new Map(inventory.filter(r=>r.name===name).map(r=>[r.kind+':'+r.ids.join(','),r]));
  for(const [key,row]of sets){await fixture(p,row.ids);const m=await metrics(p);check(m,row.ids,name+'/'+key);layoutRecords.push({name,ids:row.ids,kind:row.kind,metrics:m,coverage:'recorded candidate-set layout fixture'});await p.keyboard.press('Escape')}
  await c.close();console.log(name+' PASS '+sets.size+' unique candidate layouts');
 }
 if(!process.env.QA_REVISION_SKIP_HISTORY)for(const [version,sha]of [['before','bd1e57bc48e55a065cbbccb68acea196a64a187c'],['rejected','d55e9deb2adfa7985bc33a3251402860f95a0b46']]){
  const file='/private/tmp/topo-59-'+version+'.html';writeFileSync(file,execFileSync('git',['show',sha+':index.html'],{cwd:root,maxBuffer:32e6}));
  for(const[name,width,height]of sizes){const c=await b.newContext({viewport:{width,height},offline:true}),p=await c.newPage();watch(p);await p.goto('file://'+file);for(const[key,ids]of cases){await fixture(p,ids);await p.screenshot({path:new URL(version+'-'+name+'-'+key+'.png',out).pathname});await p.keyboard.press('Escape')}await c.close()}
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const html=readFileSync(new URL('output/html/TOPO-Italie-Computer.html',root));writeFileSync(new URL('browser-results.json',out),JSON.stringify({browser:await b.version(),transport:'file:// offline:true',htmlBytes:html.length,htmlSha256:createHash('sha256').update(html).digest('hex'),records,layoutRecords,errors,external},null,2)+'\n');console.log('PASS '+records.length+' grading/answer-independent cases; '+layoutRecords.length+' candidate layouts');
}finally{await b.close()}
