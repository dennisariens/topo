import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {JSDOM,VirtualConsole} from 'jsdom';
import {withoutDiscovery} from './discovery-source.mjs';
import {restoreLegacyMapHit} from './map-hit-source.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root)),html=read('index.html').toString();
const base='c68ace4e44a6e797f536ec1a8d6b517d29167320';
const previous=p=>execFileSync('git',['show',base+':'+p],{maxBuffer:24*1024*1024});
function boot(native=true){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://topo.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};w.confirm=()=>true;
  w.HTMLDialogElement.prototype.showModal=native?function(){this.setAttribute('open','');}:undefined;
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
 }});
 const w=dom.window,d=w.document;return {w,d,errors,ev:s=>w.eval(s),close:()=>w.close()};
}
const protectedState=a=>a.ev('JSON.stringify({state,current:state.current,progress:progressSnapshot(),storage:localStorage.getItem("topo-italie-v3"),answer:document.querySelector("#answer").value})');
test('one unchanged photograph; pre-existing code exact except the bounded map resolver hotfix',()=>{
 const stripped=restoreLegacyMapHit(withoutDiscovery(html),previous('index.html').toString()).replace(/\/\* BEGIN SCHOOLBLAD \*\/[\s\S]*?\/\* END SCHOOLBLAD \*\/\n/,'').replace(/\/\/ BEGIN SCHOOLBLAD\n[\s\S]*?\/\/ END SCHOOLBLAD\n/,'');
 assert.equal(stripped,previous('index.html').toString());
 for(const p of ['scripts/learning-engine.js','scripts/route-engine.js','scripts/nino-feedback.js','scripts/nino-art.js','scripts/nino-art-ui.js','scripts/nino-art.css','print.html','output/pdf/topo-italie-printboek.pdf','output/pdf/print-source.sha256','geography/lakes/source.geojson','geography/lakes/projected-manifest.json'])assert(read(p).equals(previous(p)),p);
 for(const p of ['output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html'])assert.equal(read(p).toString(),html);
});
test('Learn, Point, Write, exam and route reference opening never mutates a task or progress',()=>{
 const a=boot();try{
  for(const mode of ['learn','point','write','exam','route']){
   a.ev(`mode('${mode}')`);a.d.querySelector('#answer').value='Onvoltooid antwoord';
   const before=protectedState(a),button=a.d.querySelector(mode==='route'?'.schoolbladRouteButton':'.mapTools .schoolbladButton');
   button.focus();button.click();const dialog=a.d.querySelector('#schoolbladDialog');assert(dialog.open);
   assert.equal(a.d.querySelector('#school').parentElement.className,'schoolbladStage');
   assert.equal(a.d.querySelectorAll('#school').length,1);assert.equal(dialog.querySelectorAll('[data-id],svg,form,input').length,0);
   assert.equal(protectedState(a),before);
   dialog.querySelector('[data-zoom="in"]').click();dialog.querySelector('[data-zoom="fit"]').click();dialog.querySelector('.schoolbladClose').click();
   assert(!dialog.open);assert.equal(protectedState(a),before);assert.equal(a.d.activeElement,button);
  }
  assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});
test('answered/unanswered route and Gold remain exact across cancel; draft answer/caret recover',()=>{
 const a=boot();try{
  for(const kind of ['point','write','gold']){
   a.ev(`TopoRoute.record(state.route,'city1').stage=3;startRouteLesson('city1','${kind}')`);
   for(const answered of [false,true]){
    if(answered)a.ev('routeGrade(true)');
    const input=a.d.querySelector('#answer');input.value='Floren';input.focus();input.setSelectionRange(2,5,'backward');
    const before=protectedState(a),button=a.d.querySelector('.mapTools .schoolbladButton'),expectedFocus=a.d.activeElement===input&&!input.disabled?input:button;
    button.dispatchEvent(new a.w.Event('pointerdown'));button.click();
    const dialog=a.d.querySelector('#schoolbladDialog');dialog.dispatchEvent(new a.w.Event('cancel',{cancelable:true}));
    assert.equal(protectedState(a),before);assert.equal(a.d.activeElement,expectedFocus);assert.equal(input.selectionStart,2);assert.equal(input.selectionEnd,5);assert.equal(input.selectionDirection,'backward');
   }
  }
  assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});
test('modal semantics, keyboard containment and progressive legacy fallback',()=>{
 const a=boot();try{
  a.d.querySelector('.schoolbladRouteButton').click();const dialog=a.d.querySelector('#schoolbladDialog'),close=dialog.querySelector('.schoolbladClose'),view=dialog.querySelector('.schoolbladViewport');
  assert.equal(dialog.getAttribute('aria-labelledby'),'schoolbladTitle');assert.equal(dialog.getAttribute('aria-modal'),'true');assert.equal(a.d.activeElement,close);
  close.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));assert.equal(a.d.activeElement,view);
  view.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(a.d.activeElement,close);
  assert(dialog.querySelector('img').src.startsWith('data:image/jpeg;base64,'));assert.deepEqual(a.errors,[]);
 }finally{a.close();}
 const old=boot(false);try{assert.equal(old.d.querySelector('#schoolbladDialog'),null);assert(!old.d.querySelector('#schoolToggle').closest('label').hidden);old.d.querySelector('#schoolToggle').onchange({target:{checked:true}});assert(!old.d.querySelector('#school').classList.contains('hidden'));}finally{old.close();}
});
