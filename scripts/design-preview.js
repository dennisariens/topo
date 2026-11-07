/* NINO design preview only. Injected by scripts/build-design-preview.mjs into a separate HTML file, never into the app.
   Synthetic design states live in memory: nothing is read from or written to the browser's real storage. */
(function(){
 'use strict';
 const IDS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers'];
 const at=Date.UTC(2026,10,6,14,36);
 const chapters=(done,gold)=>Object.fromEntries(IDS.map((id,i)=>[id,{stage:i<done?3:0,completedAt:i<done?at:0,goldAt:i<gold?at:0,nextReviewAt:0,reviews:0}]));
 const state=(name,{done=0,gold=0,good=0,pizzas=0,trips=0})=>({title:name,progress:{schema:3,good,pizzas,slices:0,trips,mistakes:[],route:{schema:2,chapters:chapters(done,gold),items:{},rewardTokens:[],active:null},daily:{date:'2026-11-06',correct:0}},profile:{schema:1,name:'DEMO '+name,coverColor:'riviera',favoritePizza:'salami'}});
 const STATES={
  'steden-7-12':state('Steden 7–12',{done:1}),
  'eilanden':state('Eilanden',{done:4}),
  'volledig':state('Alles vrijgespeeld',{done:11,gold:11,good:168,pizzas:21,trips:7})
 };
 const key=location.hash.slice(1),chosen=STATES[key]||STATES['steden-7-12'];
 const entries=new Map([['topo-italie-v3',JSON.stringify(chosen.progress)],['topo-nino-profile-v1',JSON.stringify(chosen.profile)],['topo-nino-intro-v1','done']]);
 const memory={get length(){return entries.size},key:i=>[...entries.keys()][i]??null,getItem:k=>entries.has(String(k))?entries.get(String(k)):null,setItem:(k,v)=>{entries.set(String(k),String(v))},removeItem:k=>{entries.delete(String(k))},clear:()=>entries.clear()};
 Object.defineProperty(window,'localStorage',{configurable:true,value:memory});
 window.NINO_DESIGN_PREVIEW={state:STATES[key]?key:'steden-7-12',storage:entries};
 addEventListener('hashchange',()=>location.reload());
 addEventListener('DOMContentLoaded',()=>{
  const bar=document.createElement('nav');bar.className='ninoPreviewBar';bar.setAttribute('aria-label','Ontwerppreview');
  const label=document.createElement('strong');label.textContent='Ontwerppreview · '+chosen.title+' · niets wordt bewaard';bar.append(label);
  for(const [id,s] of Object.entries(STATES)){const a=document.createElement('a');a.href='#'+id;a.textContent=s.title;if(s===chosen)a.setAttribute('aria-current','page');bar.append(a);}
  const ride=document.createElement('button');ride.type='button';ride.textContent='Speel Vespa-rit af';
  // Plays the existing ride presentation only: no award, no trip count, no storage.
  ride.onclick=()=>{const j=window.TopoLearning?.journey(1)||{from:'Rome',to:'Florence'};celebrateTrip(j.from,j.to);};
  bar.append(ride);document.body.prepend(bar);
 });
})();
