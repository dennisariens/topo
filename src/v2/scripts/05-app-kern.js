<!--@part:src/v2/data/items.js-->const $=s=>document.querySelector(s);const el=(tag,attrs={},parent)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);parent.append(n);return n};
// All marker coordinates are projected from the reference data in ITEMS.
<!--@part:src/v2/data/context-land.js--><!--@part:src/v2/data/italy.js-->const zones=ITEMS.filter(i=>i.shape);const byId=Object.fromEntries(ITEMS.map(i=>[i.id,i]));const elements={};
function addShape(i,layer,klass){const p=el('path',{d:i.shape,class:klass,'data-id':i.id,'aria-label':i.name,tabindex:'0'},layer);elements[i.id]=p;attach(p,i)}
function attach(n,i){n.addEventListener('click',e=>{e.stopPropagation();if(state.mode==='learn'){showLesson(i);return}if(state.questionMode!=='point'||state.answered)return;grade(i.id===state.current.id,i)});n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();n.dispatchEvent(new MouseEvent('click',{bubbles:true}))}})}
for(const i of zones.filter(i=>i.kind==='water'))addShape(i,$('#seaLayer'),i.id==='water-A'?'water parent':'water');
// Fill the entire geographic frame before placing syllabus countries and Italy.
for(const [code,d] of Object.entries(CONTEXT_LAND)){el('path',{d,class:'land contextLand','data-country':code},$('#landLayer'))}
// Country silhouettes share their boundaries with the Italy drawing where they meet the peninsula.
for(const i of zones.filter(i=>['area-i','area-j','area-k','area-l','area-m'].includes(i.id)))addShape(i,$('#landLayer'),'country');
el('path',{d:italy,class:'italy'},$('#landLayer'));
for(const i of zones.filter(i=>['area-a','area-b'].includes(i.id)))addShape(i,$('#landLayer'),'country');
for(const i of zones.filter(i=>!['area-a','area-b','area-i','area-j','area-k','area-l','area-m'].includes(i.id)&&i.kind==='area'&&!['area-e','area-f','area-n','area-o'].includes(i.id)))addShape(i,$('#areaLayer'),'zone');
el('use',{href:'#lakeGeometry','data-context-layer':'lakes','aria-hidden':'true','pointer-events':'none'},$('#areaLayer'));
for(const i of zones.filter(i=>i.kind==='river'))addShape(i,$('#riverLayer'),'lineTarget');
const labels=[['I T A L I Ë',471,548,'mapLabel'],['DUITSLAND',350,73,'contextLabel'],['TSJECHIË',620,40,'contextLabel'],['SLOWAKIJE',830,89,'contextLabel'],['HONGARIJE',752,224,'contextLabel'],['BOSNIË',773,437,'contextLabel'],['TUNESIË',347,1098,'contextLabel']];for(const [t,x,y,c] of labels){const n=el('text',{x,y,class:c,'text-anchor':'middle'},$('#labels'));n.textContent=t}

for(const i of zones.filter(i=>['area-e','area-f','area-n','area-o'].includes(i.id))){if(i.id==='area-e'||i.id==='area-f'){addShape(i,$('#pointLayer'),'feature');const n=el('text',{x:i.px,y:i.py+2,'text-anchor':'middle','font-size':15,'font-weight':900,fill:'#5b493d','pointer-events':'none'},$('#pointLayer'));n.textContent='▲'}else {const r=i.id==='area-o'?2.7:4.5;const mark=el('circle',{cx:i.px,cy:i.py,r,class:'feature microstate','data-id':i.id,'aria-label':i.name,tabindex:0,role:'button'},$('#pointLayer'));elements[i.id]=mark;attach(mark,i);}}
for(const i of ITEMS.filter(i=>i.kind==='city')){const c=el('circle',{cx:i.px,cy:i.py,r:i.id==='city-9'?6.3:6.5,class:'city','data-id':i.id,'aria-label':i.name,tabindex:0},$('#pointLayer'));elements[i.id]=c;attach(c,i)}
const sanMarino=byId['area-n'];const sanHit=el('circle',{cx:sanMarino.px,cy:sanMarino.py,r:5,class:'microHit','data-id':sanMarino.id,'aria-label':sanMarino.name,tabindex:0},$('#pointLayer'));attach(sanHit,sanMarino);
const romeHit=el('circle',{cx:byId['city-9'].px,cy:byId['city-9'].py,r:15,class:'microHit','aria-label':'Kies Rome of Vaticaanstad',tabindex:0,role:'button'},$('#pointLayer'));
const lens=document.createElement('div');lens.id='romeLens';lens.className='romeLens hidden';lens.innerHTML='<strong>Vaticaanstad ligt binnen Rome</strong><div class="lensSketch" aria-hidden="true"><span class="lensRome"></span><span class="lensVatican"></span></div><p class="lensNote">Een zelfstandig land, helemaal omsloten door de stad Rome.</p><small class="lensScale">Schema om de verhouding uit te leggen · niet op schaal</small><div class="lensActions"><button type="button" data-choice="city-9">Rome</button><button type="button" data-choice="area-o">Vaticaanstad</button></div>';$('.mapArea').append(lens);
let previousV3={},previousV2={};try{previousV3=JSON.parse(localStorage.getItem('topo-italie-v3')||'{}');previousV2=JSON.parse(localStorage.getItem('topo-italie-v2')||'{}')}catch{}
const saved=TopoLearning.migrate(previousV3,previousV2);
const state={...saved,mode:'learn',questionMode:'point',lessonIndex:0,current:null,answered:false,streak:0,wrongOnly:false,quizSession:null,quizPoolKey:null,learnSession:null,examPool:[],examTotal:0,examAnswered:0,examCorrect:0,examEnded:false,examModes:[],examModeIndex:0};
const rewardDetails=document.createElement('div');rewardDetails.className='rewardDetails';rewardDetails.innerHTML='<strong id="sliceCount" aria-live="polite">0 / 8 pizzapunten</strong><div class="vespaRoute"><span id="vespaIcon" class="vespa" aria-hidden="true"></span><span id="vespaDestination"></span></div>';
$('#pizzaRow').after(rewardDetails);$('.badge').textContent='8 pizzapunten = 1 pizza · 3 pizza’s = Vespa-rit';
function persist(){try{localStorage.setItem('topo-italie-v3',JSON.stringify({schema:3,mistakes:state.mistakes,good:state.good,pizzas:state.pizzas,slices:state.slices,trips:state.trips,route:state.route,daily:state.daily}))}catch{$('#storageNote').classList.remove('hidden')}}
function drawPizza(target,slices){TopoPizza.draw(target,slices,state.pizzas)}
function sync(){ $('#good').textContent=state.good;$('#streak').textContent=state.streak;$('#pizzas').textContent=state.pizzas;$('#rewardPizzaTotal').textContent=state.pizzas;drawPizza($('#rewardPizzaVisual'),state.slices);$('#pizzaProgress').style.width=(state.slices/8*100)+'%';$('#sliceCount').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8 pizzapunten';const route=TopoLearning.journey(state.trips+1);$('#vespaDestination').textContent=state.trips+' rit'+(state.trips===1?'':'ten')+' gemaakt · volgende: '+route.from+' → '+route.to;$('#pizzaCaption').textContent=`Nog ${8-state.slices} goede antwoorden tot de volgende pizza. Fouten halen geen pizza’s weg.`;renderRewardHub();persist()}
let tripTimer=null;
function celebrateTrip(from,to){clearTimeout(tripTimer);const vespa=$('#vespaIcon');vespa.classList.remove('trip');void vespa.offsetWidth;vespa.classList.add('trip');const toast=$('#vespaTripToast');$('#vespaTripText').textContent=TopoNino.resolve('ANSWER.OK_TRIP',{rewardCity:to});toast.classList.remove('hidden');toast.classList.add('riding');tripTimer=setTimeout(()=>{vespa.classList.remove('trip');toast.classList.add('hidden');toast.classList.remove('riding')},1500)}
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,'').trim().replace(/\s+/g,' ')}
function clearActive(){Object.values(elements).forEach(n=>n.classList.remove('activeTarget'));document.querySelectorAll('.microLocator').forEach(n=>n.remove());if($('#microZoom'))$('#microZoom').hidden=true}
function highlight(i){
 clearActive();const n=elements[i.id];if(n)n.classList.add('activeTarget');
 // Locator is a visual aid, not a country boundary or an answer label.
 if(i.id==='area-n'||i.id==='area-o'){
  const g=el('g',{class:'microLocator','pointer-events':'none','aria-hidden':'true'},$('#pointLayer'));
  el('circle',{cx:i.px,cy:i.py,r:19,fill:'none',stroke:'#fff','stroke-width':8},g);
  el('circle',{cx:i.px,cy:i.py,r:19,fill:'none',stroke:'#af4b23','stroke-width':4},g);
  el('circle',{cx:i.px,cy:i.py,r:i.id==='area-o'?2.7:4.5,fill:'#f49250',stroke:'#fff','stroke-width':1.2},g);
  renderMicroZoom(i);
 }
}
function message(t,kind=''){$('#message').textContent=t;$('#message').className='message '+kind}
const isRomeArea=i=>i&&['city-9','area-o'].includes(i.id);
function showLens(){if(state.mode==='learn'||state.questionMode==='discover'){lens.classList.remove('hidden');romeHit.setAttribute('aria-expanded','true')}}
function hideLens(){lens.classList.add('hidden');romeHit.setAttribute('aria-expanded','false')}
romeHit.setAttribute('aria-controls','romeLens');romeHit.setAttribute('aria-expanded','false');
romeHit.addEventListener('pointerenter',showLens);romeHit.addEventListener('focus',showLens);
romeHit.addEventListener('click',e=>{e.stopPropagation();if(state.questionMode==='point'&&!state.answered&&state.mode!=='learn')openMapPicker([byId['city-9'],byId['area-o']]);else{showLens();if(!lens.classList.contains('hidden'))lens.querySelector('button').focus()}});
romeHit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();romeHit.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideLens()});
$('#map').addEventListener('click',e=>{if(e.target!==romeHit&&!isRomeArea(state.current))hideLens()});
for(const button of lens.querySelectorAll('button'))button.onclick=e=>{e.stopPropagation();const i=byId[button.dataset.choice];if(state.mode==='learn'){showLesson(i);return}if(state.questionMode==='point'&&!state.answered)grade(i.id===state.current.id,i)};
function worksheetCode(i){return i.kind==='city'?'nummer '+i.code:i.kind==='water'||i.kind==='river'?'hoofdletter '+i.code:'kleine letter '+i.code}
function expectedAnswer(i){return i.name}
function resetExam(){
 state.examPool=groupItems();state.examTotal=state.examPool.length;state.examAnswered=0;state.examCorrect=0;state.examEnded=false;state.examModes=[];state.examModeIndex=0;
 state.quizSession=state.examTotal?TopoLearning.session(state.examPool):null;state.current=null;state.answered=true;
 $('#groupCount').textContent=state.examTotal+' namen in deze toets';$('#next').disabled=!state.examTotal;
 if(state.examTotal)next();else{$('#prompt').textContent='Geen namen in deze groep';$('#help').textContent='Kies een andere groep voor de toets.';$('#inputWrap').classList.add('hidden');$('#testStatus').textContent='0 vragen';message('Je kunt een andere groep kiezen.');hideLens()}
}
function nextExamMode(){
 const format=$('#testFormat').value;
 if(format==='point'||format==='write')return format;
 if(state.examModeIndex>=state.examModes.length){
  state.examModes=TopoLearning.shuffle(['point','write']);state.examModeIndex=0;
 }
 return state.examModes[state.examModeIndex++];
}
function finishExam(){
 state.examEnded=true;state.current=null;state.answered=true;clearActive();hideLens();
 $('#type').textContent='Toets afgerond';$('#prompt').textContent=state.examCorrect+' van '+state.examTotal+' goed';
 $('#help').textContent=state.examCorrect===state.examTotal?'Alles goed! Goed geoefend.':'Je kunt je fouten hierna apart oefenen.';
 $('#testStatus').textContent=state.examTotal+' vragen gemaakt · '+state.examCorrect+' goed';
 $('#inputWrap').classList.add('hidden');$('#next').textContent='Toets opnieuw →';message('Kies Toets opnieuw of oefen je fouten in Leren of Aanwijzen.','good')
}
function next(){
 if(state.mode==='route'){routeNext();return}
 if(state.mode==='exam'){
  if(state.examEnded){resetExam();return}
  if(!state.examTotal)return;
  if(state.current&&!state.answered){grade(false,null,true);return}
  if(state.examAnswered>=state.examTotal){finishExam();return}
 }else{if(state.current&&!state.answered){grade(false,null,true);return}if(state.wrongOnly&&!state.mistakes.length){state.wrongOnly=false;$('#mistakes').textContent='Oefen fouten'}}
 clearActive();updatePracticeArt(null);
 state.questionMode=state.mode==='exam'?nextExamMode():state.mode;
 const pool=state.mode==='exam'?state.examPool:state.wrongOnly?ITEMS.filter(i=>state.mistakes.includes(i.id)):groupItems();
 if(state.mode!=='exam')$('#groupCount').textContent=pool.length+' namen in deze groep';
 if(!pool.length){state.current=null;state.answered=true;$('#next').disabled=true;$('#inputWrap').classList.add('hidden');$('#prompt').textContent='Nog geen namen in deze groep';$('#help').textContent='Kies hierboven een andere groep.';message('Kies een groep om verder te oefenen.');hideLens();return}
 $('#next').disabled=false;
 const key=state.wrongOnly?'mistakes:'+pool.map(i=>i.id).join(','):$('#groupSelect').value;
 if(state.mode!=='exam'&&(!state.quizSession||state.quizPoolKey!==key)){state.quizSession=TopoLearning.session(pool);state.quizSession.lastId=state.current?.id||null;state.quizPoolKey=key}
 state.current=TopoLearning.draw(state.quizSession,pool,state.mode==='exam'?[]:state.mistakes);state.answered=false;
 $('#answer').value='';$('#answer').disabled=false;$('#check').disabled=false;$('#next').textContent='Overslaan →';
 $('#type').textContent=state.mode==='exam'?'Toets · '+({point:'aanwijzen',write:'naam schrijven'}[state.questionMode]):state.questionMode==='point'?'Aanwijzen':'Naam herkennen';
 $('#inputWrap').classList.toggle('hidden',state.questionMode==='point');
 if(state.questionMode==='point'){$('#prompt').textContent='Waar ligt '+state.current.name+'?';$('#help').textContent='Klik op de plek of de vorm op de kaart.'}
 else if(state.questionMode==='write'){$('#prompt').textContent='Wat is dit op de kaart?';$('#help').textContent='Bekijk het oranje vlak, de stip of de lijn en typ de naam.';highlight(state.current)}

 $('#answer').placeholder='Typ de volledige naam';
 $('#answer').setAttribute('aria-label','Naam');
 if(state.mode==='exam')$('#testStatus').textContent='Vraag '+(state.examAnswered+1)+' / '+state.examTotal+' · '+state.examCorrect+' goed';
 message('Jij bent aan zet.');hideLens();if(state.questionMode!=='point')$('#answer').focus()
}
function grade(ok,clicked,skipped=false){
 if(state.mode==='route'){routeGrade(ok,skipped,clicked);return}
 if(state.answered)return;state.answered=true;const i=state.current;TopoRoute.track(state.route,i.id,state.questionMode,ok);$('#next').textContent='Volgende →';
 if(state.mode==='exam'){state.examAnswered++;if(ok)state.examCorrect++;$('#testStatus').textContent='Vraag '+state.examAnswered+' / '+state.examTotal+' · '+state.examCorrect+' goed';if(state.examAnswered===state.examTotal)$('#next').textContent='Bekijk resultaat →'}
 if(ok){recordDailyCorrect();const reward=TopoLearning.award(state);state.streak++;state.mistakes=state.mistakes.filter(x=>x!==i.id);message(TopoNino.answer({ok:true,mode:state.mode==='exam'?'exam':state.questionMode,place:i.name,reward}),'good');if(reward.pizza)celebrateReward(reward)}
 else{state.streak=0;if(!state.mistakes.includes(i.id))state.mistakes.push(i.id);message(TopoNino.answer({ok:false,mode:state.mode==='exam'?'exam':state.questionMode,place:i.name,chosen:clicked?.name,skipped}),'bad')}
 updatePracticeArt(TopoArt.roleFor({phase:'answer',mode:state.mode,ok}));
 highlight(i);sync();$('#answer').disabled=true;$('#check').disabled=true
}
function check(){if(state.answered)return;const input=$('#answer').value;if(!input.trim())return;const i=state.current;const ok=[i.name,...i.aliases].some(x=>norm(x)===norm(input));grade(ok)}
function revealItem(i){highlight(i);message(i.name+' · '+i.code+' · '+(i.kind==='city'?'stad':i.kind==='river'?'rivier':i.kind==='water'?'zee':'gebied'),'good')}
const GROUPS={islands:['area-a','area-b'],mountains:['area-c','area-d'],volcanoes:['area-e','area-f'],regions:['area-g','area-h'],countries:['area-i','area-j','area-k','area-l','area-m','area-n','area-o'],seas:['water-A','water-B','water-C','water-D','water-E'],rivers:['water-F','water-G']};
function groupForItem(i){if(i.kind==='city')return 'city'+Math.ceil(Number(i.code)/6);return Object.keys(GROUPS).find(key=>GROUPS[key].includes(i.id))}
function groupItems(){const key=$('#groupSelect').value;return ITEMS.filter(i=>{
 if(key.startsWith('city')){const n=Number(i.code),offset=(Number(key.slice(-1))-1)*6;return i.kind==='city'&&n>offset&&n<=offset+6}
 if(key==='all')return true;
 if(key==='mistakes')return state.mistakes.includes(i.id);
 return (GROUPS[key]||[]).includes(i.id)
})}
const NAME_ANCHORS={
 'area-a':[530,940],'area-b':[260,738],'area-c':[505,519],'area-d':[443,263],
 'area-e':[572,683],'area-f':[582,905],'area-g':[344,338],'area-h':[395,494],
 'area-i':[117,323],'area-j':[264,203],'area-k':[560,180],'area-l':[574,282],
 'area-m':[749,323],'area-n':[426,449],'area-o':[438,582],
 'water-A':[110,895],'water-B':[679,510],'water-C':[185,519],
 'water-D':[395,741],'water-E':[780,930],'water-F':[495,528],'water-G':[314,344]
};
const CITY_NAME_ANCHORS={};
function renderMapNames(){const layer=$('#nameLayer');layer.replaceChildren();if(state.mode!=='learn'||!$('#nameToggle').checked)return;
 const arr=groupItems();const all=arr.length===ITEMS.length;$('#nameToggle').disabled=all;$('#nameToggleText').textContent=all?'Kies een deelgroep voor kaartnamen':'Namen van deze groep';if(all)return;
 for(const i of arr){const custom=CITY_NAME_ANCHORS[i.id];let [x,y]=custom||NAME_ANCHORS[i.id]||[Math.min(i.px+13,820),i.py-13];
 if(i.kind==='city'){el('line',{x1:i.px,y1:i.py,x2:x+(custom?4:-4),y2:y+4,class:'studyLeader'},layer)}
 const txt=el('text',{x,y,class:'studyName '+(i.kind==='water'?'seaName':i.kind==='area'?'regionName':''),'text-anchor':i.kind==='city'?(custom?'end':'start'):'middle'},layer);
 txt.textContent=i.name;
 }
}
function showLesson(i){const arr=groupItems();if(!arr.some(x=>x.id===i.id)){const group=groupForItem(i);if(group){$('#groupSelect').value=group;renderLearn();showLesson(i)}return}state.lessonIndex=arr.findIndex(x=>x.id===i.id);if(state.learnSession){state.learnSession.lastId=i.id;state.learnSession.deck=state.learnSession.deck.filter(id=>id!==i.id)}highlight(i);isRomeArea(i)?showLens():hideLens();$('#learnPrompt').textContent=i.name;$('#learnHelp').textContent=(i.kind==='city'?'Stad':i.kind==='river'?'Rivier':i.kind==='water'?'Zee':'Gebied')+' · '+(state.lessonIndex+1)+' van '+arr.length;document.querySelectorAll('#learnList button').forEach(b=>b.classList.toggle('selected',b.dataset.id===i.id))}
function renderLearn(){const arr=groupItems(),list=$('#learnList');$('#groupCount').textContent=arr.length+' namen in deze groep';list.replaceChildren();for(const i of arr){const b=document.createElement('button');b.dataset.id=i.id;const code=document.createElement('b');code.textContent='•';const name=document.createElement('span');name.textContent=i.name;b.append(code,name);b.onclick=()=>showLesson(i);list.append(b)}state.learnSession=TopoLearning.session(arr);state.learnSession.lastId=state.current?.id||null;clearActive();renderMapNames();if(arr.length)showLesson(TopoLearning.draw(state.learnSession,arr));else{$('#learnPrompt').textContent='Nog geen lastige namen';$('#learnHelp').textContent='Fouten uit de oefeningen verschijnen hier automatisch.';hideLens()}}
function mode(m){document.body.classList.remove('lessonFocus');exitFinish();if(state.mode!==m){state.quizSession=null;state.learnSession=null;state.current=null;state.answered=true}state.mode=m;document.querySelectorAll('.tab').forEach(n=>{n.classList.toggle('active',n.dataset.mode===m);n.setAttribute('aria-pressed',String(n.dataset.mode===m))});$('#quiz').classList.toggle('hidden',m==='learn');$('#learn').classList.toggle('hidden',m!=='learn');$('#groupPicker').classList.toggle('hidden',m==='route');$('#routeHome').classList.toggle('hidden',m!=='route');$('#routeLessonBar').classList.add('hidden');$('#routeMapDock').classList.add('hidden');$('#routeExtra').classList.add('hidden');$('.layout').classList.remove('routeLessonLayout','routeHomeLayout');$('#journeyScreen').classList.add('hidden');$('#reveal').classList.remove('hidden');$('#reveal').disabled=false;$('#groupPicker label').textContent=m==='exam'?'Ik toets':m==='learn'?'Ik leer':'Ik oefen';$('#testSetup').classList.toggle('hidden',m!=='exam');$('#testStatus').classList.toggle('hidden',m!=='exam');$('#mistakes').classList.toggle('hidden',m==='exam');$('#nameToggleWrap').classList.toggle('hidden',m!=='learn');$('#printMap').classList.toggle('hidden',m!=='learn');$('#freeCoach').classList.toggle('hidden',m==='route');$('#freeCoachCaption').textContent=m==='exam'?'Laat Nino zien wat je weet.':m==='point'?'Wijs met Nino de juiste plek aan.':'Schrijf met Nino de naam op.';if(m==='route'){renderMapNames();renderRouteHome()}else if(m==='learn')renderLearn();else{renderMapNames();if(m==='exam')resetExam();else{$('#next').disabled=false;next()}}}
for(const n of document.querySelectorAll('.tab'))n.onclick=()=>mode(n.dataset.mode);
$('#groupSelect').onchange=()=>{state.wrongOnly=false;$('#mistakes').textContent='Oefen fouten';if(state.mode==='learn')renderLearn();else if(state.mode==='exam')resetExam();else{state.quizSession=null;state.current=null;next()}};$('#testFormat').onchange=()=>{if(state.mode==='exam')resetExam()};$('#nameToggle').onchange=renderMapNames;$('#printMap').onclick=()=>window.print();$('#learnNext').onclick=()=>{const arr=groupItems();if(arr.length)showLesson(TopoLearning.draw(state.learnSession,arr))};
$('#next').onclick=next;$('#check').onclick=check;$('#answer').onkeydown=e=>{if(e.key==='Enter')state.answered?next():check()};$('#reveal').onclick=()=>{if(state.current){if(state.mode==='exam')grade(false,null,true);else grade(false,null,true)}};$('#mistakes').onclick=()=>{if(!state.mistakes.length){message('Nog geen fouten om te herhalen.','good');return}state.wrongOnly=!state.wrongOnly;state.current=null;state.answered=true;$('#mistakes').textContent=state.wrongOnly?'Alle onderdelen':'Oefen fouten';next()};
$('#resetPizza').onclick=()=>{if(confirm('Pizza’s, pizzapunten en Vespa-ritten resetten?')){clearRewardCelebrations();state.pizzas=state.slices=state.trips=0;sync();message('Pizza’s en Vespa gereset. Je foutenlijst blijft bewaard.')}};$('#resetAll').onclick=()=>{if(confirm('Alle pizza’s, Vespa-ritten, leerroute-lessen, gouden sterren en opgeslagen fouten verwijderen?')){clearRewardCelebrations();state.pizzas=state.slices=state.trips=state.good=state.streak=0;state.daily={date:localDay(),correct:0};renderDailyGoal();state.mistakes=[];state.route=TopoRoute.fresh();state.wrongOnly=false;state.quizSession=null;state.current=null;state.answered=true;$('#mistakes').textContent='Oefen fouten';sync();if(state.mode==='route')renderRouteHome();else if(state.mode==='learn')renderLearn();else if(state.mode==='exam')resetExam();else next()}};$('#schoolToggle').onchange=e=>{$('#school').classList.toggle('hidden',!e.target.checked);$('#school').classList.remove('on')};
const ROUTE_TITLES={city1:'Steden 1–6',city2:'Steden 7–12',city3:'Extra steden 13–18',city4:'Extra steden 19–23',islands:'Eilanden',mountains:'Bergen',volcanoes:'Vulkanen',regions:'Streken',countries:'Landen',seas:'Zeeën',rivers:'Rivieren'};
const ROUTE_CHAPTERS=Object.entries(ROUTE_TITLES).map(([id,title])=>({id,title,itemIds:ITEMS.filter(i=>id.startsWith('city')?i.kind==='city'&&Number(i.code)>(Number(id.slice(-1))-1)*6&&Number(i.code)<=Number(id.slice(-1))*6:(GROUPS[id]||[]).includes(i.id)).map(i=>i.id)}));
ROUTE_TITLES.smart='Mijn slimme rondje';
const ROUTE_STAGE_NAMES={smart:'Slim oefenen',discover:'Ontdekken',point:'Aanwijzen',write:'Namen schrijven',gold:'Gouden proef',review:'Opfrissen'};
state.route=TopoRoute.restore(previousV3?.route,ROUTE_CHAPTERS);
const ROUTE_ICONS={city1:'city',city2:'city',city3:'city',city4:'city',islands:'island',mountains:'mountains',volcanoes:'volcanoes',regions:'regions',countries:'countries',seas:'seas',rivers:'rivers'};
function chapterGlyph(id){const icon=routeGlyph(ROUTE_ICONS[id]);icon.classList.add('chapterIcon');icon.dataset.chapter=id;return icon}
function routeGlyph(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',name==='vespa'?'0 0 72 48':'0 0 32 32');svg.setAttribute('aria-hidden','true');svg.classList.add('routeGlyph');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href',document.getElementById('topo-'+name)?'#topo-'+name:'#topo-point');svg.append(use);return svg}
function routeButton(label,action,klass='button'){const b=document.createElement('button');b.type='button';b.className=klass;b.textContent=label;b.onclick=action;return b}
function renderRouteHome(preservePractice=false){
 preservePractice=preservePractice===true;
 if(!preservePractice){document.body.classList.remove('lessonFocus');exitFinish();renderDailyGoal();
 clearActive();hideLens();state.current=null;state.answered=true;}
 $('.layout').classList.remove('routeLessonLayout');$('.layout').classList.add('routeHomeLayout');$('#journeyScreen').classList.remove('hidden');$('#routeMapDock').classList.add('hidden');$('#routeHome').classList.remove('hidden');$('#quiz').classList.add('hidden');$('#routeLessonBar').classList.add('hidden');
 const completed=ROUTE_CHAPTERS.filter(c=>TopoRoute.record(state.route,c.id).stage===3).length;
 const gold=ROUTE_CHAPTERS.filter(c=>TopoRoute.record(state.route,c.id).goldAt>0).length;
 const nextChapter=ROUTE_CHAPTERS.find(c=>TopoRoute.record(state.route,c.id).stage<3);
 const focusChapter=nextChapter||ROUTE_CHAPTERS.at(-1),focusIndex=ROUTE_CHAPTERS.indexOf(focusChapter);
 const active=state.route.active,due=TopoRoute.due(state.route,ROUTE_CHAPTERS);
 const returning=!!active||completed>0||state.good>0||state.pizzas>0||state.slices>0||state.trips>0||Object.values(state.route.chapters).some(r=>r.stage>0)||Object.keys(state.route.items).length>0;
 const entry=active&&!active.done?'ENTRY.RESUME':completed===11?'ENTRY.COMPLETE':returning?'ENTRY.RETURN':'ENTRY.FIRST';
 $('#routeIntro').textContent=TopoNino.resolve(entry);$('#routeIntro').dataset.event=entry;
 if(!preservePractice)clearIllustrations();TopoArt.update(ninoSlots.welcome,{role:TopoArt.roleFor({phase:'entry',event:entry})});
 $('#routeSummary').textContent=completed+' / 11 haltes afgerond · '+gold+' goud';
 $('#routeProgress').style.width=(completed/11*100)+'%';
 $('#routeReview').classList.toggle('hidden',!due.length);
 $('#routeReview').textContent='Even opfrissen · '+due.length+' halte'+(due.length===1?'':'s');
 $('#routeReview').onclick=()=>startRouteLesson(due[0].id,'review');
 $('#routeContinue').textContent=active&&!active.done?'Ga verder · '+ROUTE_TITLES[active.chapterId]:!returning?TopoNino.resolve('ENTRY.START'):nextChapter?'Verder met '+nextChapter.title:TopoNino.resolve('ENTRY.START_SMART');
 $('#routeContinue').disabled=false;
 $('#routeContinue').onclick=()=>{if(active&&!active.done)renderRouteTask();else if(nextChapter)startRouteLesson(nextChapter.id,TopoRoute.STAGES[TopoRoute.record(state.route,nextChapter.id).stage]);else startRouteLesson('smart','smart')};
 $('#smartStart').classList.toggle('hidden',!nextChapter&&(!active||active.done));
 TopoArt.update(ninoSlots.chapter,{kind:'chapter',chapter:focusChapter.id,unlocked:TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,focusChapter.id)});
 const cards=$('#routeCards');cards.replaceChildren();
 const label=document.createElement('p');label.className='routeSectionLabel';label.textContent=nextChapter?'Jouw huidige halte':'Alle haltes afgerond';cards.append(label);
 const future=[],finished=[];
 ROUTE_CHAPTERS.forEach((chapter,index)=>{
  const r=TopoRoute.record(state.route,chapter.id),open=TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,chapter.id),isDue=due.some(c=>c.id===chapter.id);
  const card=document.createElement('article');card.dataset.chapter=chapter.id;
  card.className='routeCard '+(!open?'locked':r.goldAt?'gold':r.stage===3?'complete':'current')+(chapter===focusChapter?' spotlight':index===focusIndex+1?' nextPreview':'');
  const badge=document.createElement('span');badge.className='routeBadge';badge.setAttribute('aria-hidden','true');
  if(open&&r.stage<3)badge.classList.add('ninoBadge');else badge.append(chapterGlyph(chapter.id));
  const content=document.createElement('div');content.className='routeCardContent';
  const title=document.createElement('h3');title.className='routeCardTitle';title.id='chapter-'+chapter.id;
  if(open&&r.stage<3)title.append(chapterGlyph(chapter.id));
  title.append(document.createTextNode((index+1)+'. '+chapter.title));content.append(title);card.setAttribute('aria-labelledby',title.id);
  if(chapter===focusChapter&&nextChapter)card.setAttribute('aria-current','step');
  const status=document.createElement('p');status.className='micro';
  status.textContent=!open?(index===focusIndex+1?'Hierna · opent als je deze halte afrondt.':'Later op je route · '+chapter.itemIds.length+' plekken.'):r.goldAt?'Goud verdiend'+(isDue?' · tijd om op te frissen':''):r.stage===3?'Afgerond · herhaal een les of ga voor goud.':r.stage+' van 3 lessen afgerond';content.append(status);
  const steps=document.createElement('div');steps.className='routeSteps';
  TopoRoute.STAGES.forEach((stage,n)=>{
   const available=open&&n<=r.stage,done=open&&n<r.stage;
   const button=routeButton(ROUTE_STAGE_NAMES[stage],()=>startRouteLesson(chapter.id,stage),'routeStep '+(done?'done':available?'current':'locked'));button.prepend(routeGlyph(!available?'lock':done?'check':stage));
   button.disabled=!available;button.title=available?(done?'Les opnieuw doen':ROUTE_STAGE_NAMES[stage]):'Speel eerst de voorgaande lessen';steps.append(button);
  });content.append(steps);
  if(open&&r.stage===3){const actions=document.createElement('div');actions.className='routeActions';actions.append(routeButton(r.goldAt?'★ Goud nog eens':'★ Verdien goud',()=>startRouteLesson(chapter.id,'gold'),'button goldButton'),routeButton(isDue?'Nu opfrissen':'Opfrissen',()=>startRouteLesson(chapter.id,'review')));content.append(actions)}
  card.append(badge,content);
  if(chapter===focusChapter||index===focusIndex+1)cards.append(card);else if(index>focusIndex)future.push(card);else finished.push(card);
 });
 function group(id,text,list){
  if(!list.length)return;const details=document.createElement('details');details.id=id;details.className='routeCollection';
  const summary=document.createElement('summary');summary.textContent=text;details.append(summary);
  const body=document.createElement('div');body.className='routeCollectionBody';body.append(...list);details.append(body);cards.append(details);
 }
 group('futureStops','Verderop · '+future.length+' halte'+(future.length===1?'':'s')+' bekijken',future);
 group('completedStops','Afgerond · '+finished.length+' halte'+(finished.length===1?'':'s')+' · herhalen en goud',finished);
 $('#routeReward').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8 punten tot een pizza · '+state.pizzas+' pizza’s gespaard · '+state.trips+' Vespa-ritten gemaakt';$('#journeyDestination').textContent=TopoLearning.journey(state.trips+1).to;drawPizza($('#journeyWheel'),state.slices);$('#journeyPizzaCount').textContent=state.pizzas;$('#journeySliceCount').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8';$('#journeyTripDots').textContent=(state.pizzas%3)+' / 3 pizza’s voor de volgende rit';
 if(!preservePractice)persist();
}
function startRouteLesson(chapterId,kind){
 const active=state.route.active;
 if(active&&!active.done){
  if(active.chapterId===chapterId&&active.kind===kind){renderRouteTask();return}
  if(!confirm('Deze les is nog niet af. Een andere les starten? Je afgeronde lessen en pizza’s blijven bewaard.'))return;
 }
 if(!TopoRoute.start(state.route,ROUTE_CHAPTERS,chapterId,kind))return;
 persist();renderRouteTask();
}
function routeTaskHelp(task){
 const i=byId[task.id];
 if(task.mode==='discover')return TopoNino.resolve(isRomeArea(i)?'DISCOVER.MICROSTATE':'DISCOVER.PLACE',{place:i.name});
 if(task.mode==='point')return 'Klik of tik op de plek of vorm op de kaart.';
 if(task.mode==='write')return 'Bekijk de gemarkeerde plek en schrijf de naam.';
 return 'Schrijf de naam van de gemarkeerde plek.';
}
function renderRouteTask(){
 document.body.classList.add('lessonFocus');
 exitFinish();
 const s=state.route.active;if(!s){renderRouteHome();return}if(s.done){renderRouteResult();return}
 const task=TopoRoute.current(state.route),i=byId[task.id];if(!i){renderRouteHome();return}
 state.current=i;state.questionMode=task.mode;state.answered=s.answered;
 $('#routeHome').classList.add('hidden');$('#journeyScreen').classList.add('hidden');$('#quiz').classList.remove('hidden');$('#routeLessonBar').classList.remove('hidden');$('#routeMapDock').classList.remove('hidden');$('.layout').classList.remove('routeHomeLayout');$('.layout').classList.add('routeLessonLayout');
 $('#routeExtra').classList.add('hidden');$('#testSetup').classList.add('hidden');$('#testStatus').classList.add('hidden');$('#mistakes').classList.add('hidden');
 $('#routeLessonTitle').textContent=ROUTE_TITLES[s.chapterId]+' · '+ROUTE_STAGE_NAMES[s.kind];
 const intro=s.kind==='smart'?'PROMPT.SMART_OPEN':s.kind==='review'?'PROMPT.DUE':s.kind==='gold'?'PROMPT.GOLD_OPEN':s.kind==='discover'?(s.chapterId==='islands'?'DISCOVER.ISLANDS':s.chapterId==='volcanoes'?'DISCOVER.VOLCANO':'DISCOVER.OPEN'):s.kind==='point'?'DISCOVER.CLOSE':'PROMPT.WRITE';
 $('#routeLessonIntro').textContent=TopoNino.resolve(intro);$('#routeLessonIntro').dataset.event=intro;$('#routeLessonIntro').classList.toggle('hidden',s.index!==0||s.answered);
 const remaining=s.queue.length-s.index;
 $('#routeLessonCount').textContent=s.kind==='discover'?'Plek '+(s.index+1)+' / '+s.originalTotal:s.kind==='gold'?'Vraag '+(s.index+1)+' / '+s.originalTotal+' · alles goed = goud':remaining+' vra'+(remaining===1?'ag':'gen')+' te gaan'+(s.queue.length>s.originalTotal?' · met herhaling':'');
 $('#routeLessonCount').textContent+=' · ronde '+(Math.floor(s.index/6)+1);
 $('#routeLessonProgress').style.width=((s.index%6)/Math.min(6,s.queue.length-Math.floor(s.index/6)*6)*100)+'%';
 $('#type').textContent=ROUTE_STAGE_NAMES[s.kind];
 $('#prompt').textContent=task.mode==='discover'?i.name:task.mode==='point'?'Waar ligt '+i.name+'?':'Hoe heet deze plek?';
 $('#help').textContent=routeTaskHelp(task);
 $('#inputWrap').classList.toggle('hidden',['discover','point'].includes(task.mode));
 $('#answer').value='';$('#answer').placeholder='Typ de naam';$('#answer').setAttribute('aria-label','Naam');$('#answer').disabled=s.answered;$('#check').disabled=s.answered;
 $('#next').disabled=false;$('#next').textContent=s.answered?'Volgende →':task.mode==='discover'?'Bekeken · verder →':'Ik weet het nog niet';
 $('#reveal').classList.toggle('hidden',task.mode==='discover');$('#reveal').disabled=s.answered;
 clearActive();hideLens();
 if(['discover','write'].includes(task.mode)||s.answered)highlight(i);
 if(task.mode==='discover'&&isRomeArea(i))showLens();
 if(s.answered)message(TopoNino.answer({ok:s.lastAnswer?.ok,mode:task.mode,kind:s.kind,place:i.name,earned:false}),s.lastAnswer?.ok?'good':'bad');
 else message(task.mode==='discover'?'Kijk goed naar de plek en zeg de naam.':'Jij bent aan zet.');
 updateLessonArt(TopoArt.roleFor({phase:'task',kind:s.kind,index:s.index,answered:s.answered,ok:s.lastAnswer?.ok}));
 updateRouteDock();
}
function updateRouteDock(){
 $('#routeDockPrompt').textContent=$('#prompt').textContent;
 $('#routeDockFeedback').textContent=state.questionMode==='discover'?$('#help').textContent:$('#message').textContent;
 $('#routeDockFeedback').className='routeDockFeedback '+(state.answered?(state.route.active?.lastAnswer?.ok?'good':'bad'):'');
 const s=state.route.active,typing=s&&!s.done&&!['point','discover'].includes(state.questionMode);
 $('#routeDockInput').classList.toggle('hidden',!typing);$('#routeDockAnswer').disabled=state.answered;$('#routeDockCheck').disabled=state.answered;
 $('#routeDockAnswer').placeholder=$('#answer').placeholder;$('#routeDockAnswer').setAttribute('aria-label',$('#answer').placeholder);
 if(!state.answered)$('#routeDockAnswer').value='';
 $('#routeDockNext').textContent=$('#next').textContent;
}
function routeGrade(ok,skipped=false,clicked=null){
 const s=state.route.active;if(!s||s.done||s.answered||state.questionMode==='discover')return;
 const i=state.current,result=TopoRoute.answer(state.route,ROUTE_CHAPTERS,ok);
 if(result.ignored)return;
 state.answered=true;
 if(ok){
  recordDailyCorrect();state.streak++;state.mistakes=state.mistakes.filter(id=>id!==i.id);
  const reward=result.reward?TopoLearning.award(state):null;
  message(TopoNino.answer({ok:true,mode:state.questionMode,kind:s.kind,place:i.name,reward,earned:result.reward}),'good');
  if(reward?.pizza)celebrateReward(reward);
 }else{
  state.streak=0;if(!state.mistakes.includes(i.id))state.mistakes.push(i.id);
  message(TopoNino.answer({ok:false,mode:state.questionMode,kind:s.kind,place:i.name,chosen:clicked?.name,skipped}),'bad');
 }
 updateLessonArt(TopoArt.roleFor({phase:'answer',ok}));
 $('#routeLessonIntro').classList.add('hidden');
 highlight(i);if(isRomeArea(i)&&state.questionMode==='point')showLens();
 $('#answer').disabled=true;$('#check').disabled=true;$('#reveal').disabled=true;$('#next').textContent='Volgende →';sync();updateRouteDock();
}
function routeNext(){
 if(roundPaused){roundPaused=false;renderRouteTask();return}
 const s=state.route.active;if(!s)return;
 if(s.done){const r=TopoRoute.record(state.route,s.chapterId);if(s.kind!=='smart'&&s.result.passed&&r.stage<3){startRouteLesson(s.chapterId,TopoRoute.STAGES[r.stage]);return}renderRouteHome();return}
 const task=TopoRoute.current(state.route);
 if(task.mode==='discover'&&!s.answered)TopoRoute.answer(state.route,ROUTE_CHAPTERS,true);
 else if(!s.answered){routeGrade(false,true);return}
 TopoRoute.advance(state.route,ROUTE_CHAPTERS);persist();if(!s.done&&s.index>0&&s.index%6===0){roundPaused=true;renderJourneyFinish(true);return}renderRouteTask();
}
function renderRouteResult(){
 const s=state.route.active,r=TopoRoute.record(state.route,s.chapterId),passed=s.result?.passed;
 $('#routeLessonTitle').textContent=ROUTE_TITLES[s.chapterId]+' · '+ROUTE_STAGE_NAMES[s.kind];
 state.current=null;state.answered=true;state.questionMode='result';clearActive();hideLens();
 $('#routeHome').classList.add('hidden');$('#journeyScreen').classList.add('hidden');$('#quiz').classList.remove('hidden');$('#routeLessonBar').classList.remove('hidden');$('#routeMapDock').classList.remove('hidden');$('.layout').classList.remove('routeHomeLayout');$('.layout').classList.add('routeLessonLayout');
 $('#inputWrap').classList.add('hidden');$('#reveal').classList.add('hidden');$('#routeLessonProgress').style.width='100%';$('#routeLessonCount').textContent='Les afgerond';
 $('#prompt').textContent=s.kind==='gold'?TopoNino.resolve(passed?(s.result.goldEarned?'CHAPTER.GOLD':'CHAPTER.GOLD_REPLAY'):'CHAPTER.GOLD_MISSED'):s.result?.newlyCompleted?TopoNino.resolve('CHAPTER.FINISH'):passed?'Les afgerond!':'Nog een oefenronde';
 $('#help').textContent=s.kind==='discover'?'Je hebt alle plekken bekeken. Nu ga je ze zelf aanwijzen.':s.kind==='gold'?s.correct+' van '+s.originalTotal+' goed. '+(passed?'Alle plekken foutloos aangewezen én benoemd.':'Voor goud moet alles goed zijn. Je afgeronde halte blijft bewaard.'):s.result?.newlyCompleted?'De volgende halte is nu open. Je mag ook voor goud gaan.':passed?'Goed doorgezet. Je voortgang is bewaard.':'Sommige plekken zijn nog lastig. Oefen de les opnieuw wanneer je wilt.';
 message(s.kind==='gold'&&passed?'Je gouden ster blijft staan. Later frissen we de stof weer op.':passed?'Klaar voor de volgende stap.':'Fouten horen bij leren. Je pizza’s blijven bewaard.',passed?'good':'');
 $('#next').disabled=false;$('#next').textContent=passed&&r.stage<3?'Volgende les →':'Bekijk je leerroute →';
 $('#routeExtra').classList.toggle('hidden',passed&&r.stage<3);
 $('#routeExtra').textContent=!passed?'Probeer deze les opnieuw':r.goldAt?'Opfrissen':'Probeer de gouden proef';
 $('#routeExtra').onclick=()=>startRouteLesson(s.chapterId,!passed?s.kind:r.goldAt?'review':'gold');
 sync();updateRouteDock();renderJourneyFinish(false);
}
$('#routeBack').onclick=renderRouteHome;
$('#routeDockNext').onclick=routeNext;
$('#routeDockCheck').onclick=()=>{$('#answer').value=$('#routeDockAnswer').value;check()};
$('#routeDockAnswer').onkeydown=e=>{if(e.key==='Enter'){if(state.answered)routeNext();else $('#routeDockCheck').onclick()}};
$('#routeReset').onclick=()=>{if(confirm('Alle leerroute-lessen en gouden sterren opnieuw beginnen? Je pizza’s en vrije oefeningen blijven bewaard.')){const tokens=state.route.rewardTokens;state.route=TopoRoute.fresh();state.route.rewardTokens=tokens;persist();renderRouteHome()}};


function progressSnapshot(){return {schema:3,good:state.good,pizzas:state.pizzas,slices:state.slices,trips:state.trips,mistakes:state.mistakes,route:state.route,daily:state.daily}}
function renderRewardHub(){
 drawPizza($('#journeyWheel'),state.slices);drawPizza($('#rewardPizzaVisual'),state.slices);if($('#lessonReward')){drawPizza($('#lessonReward'),state.slices);$('#lessonRewardText').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8 pizzapunten'}
 $('#journeyPizzaCount').textContent=state.pizzas;$('#journeySliceCount').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8';
 $('#journeyDestination').textContent=TopoLearning.journey(state.trips+1).to;
 $('#journeyTripDots').textContent=(state.pizzas%3)+' / 3 pizza’s voor de volgende rit';
}
function celebrateReward(reward){pizzaCelebrations.enqueue({...reward,pizzas:state.pizzas})}
function clearRewardCelebrations(){pizzaCelebrations.clear();clearTimeout(tripTimer);$('#vespaTripToast').classList.add('hidden');$('#vespaIcon').classList.remove('trip')}
function renderMicroZoom(i){
 const box=$('#microZoom');if(!box)return;box.replaceChildren();
 const caption=document.createElement('small');caption.textContent='Uitvergroot · zelfde plek';box.append(caption);
 const copy=$('#map').cloneNode(true);copy.setAttribute('viewBox',(i.px-65)+' '+(i.py-65)+' 130 130');copy.setAttribute('aria-label','Uitvergrote gemarkeerde plek');
 copy.querySelectorAll('text,#nameLayer,#previewMap').forEach(n=>n.remove());
 [copy,...copy.querySelectorAll('*')].forEach(n=>{n.removeAttribute('id');n.removeAttribute('tabindex');n.removeAttribute('aria-label');n.removeAttribute('data-id')});
 copy.setAttribute('aria-hidden','true');box.append(copy);box.hidden=false;
}
function setupJourneyExtras(){
 const lessonReward=document.createElement('div');lessonReward.id='lessonReward';lessonReward.className='lessonReward';
 const wheel=$('#journeyWheel').cloneNode(true);wheel.removeAttribute('id');
 lessonReward.append(wheel);const caption=document.createElement('span');caption.id='lessonRewardText';lessonReward.append(caption);$('#routeLessonBar').append(lessonReward);

 const zoom=document.createElement('div');zoom.id='microZoom';zoom.className='microZoom';zoom.hidden=true;$('.mapArea').append(zoom);
 const backup=document.createElement('footer');backup.className='backupTools';backup.innerHTML='<strong>Jouw voortgang</strong><button class="button" id="exportProgress">Bewaar reservekopie</button><button class="button" id="importProgress">Zet reservekopie terug</button><input id="backupFile" type="file" accept=".json,application/json"><small id="backupStatus" role="status">Bewaard op dit apparaat. Neem een reservekopie mee naar je iPad.</small>';document.body.append(backup);
 $('#exportProgress').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({app:'topo-italie',version:1,savedAt:new Date().toISOString(),progress:progressSnapshot(),profile:window.TopoProfile.exportProfile()},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='topo-voortgang-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#backupStatus').textContent='Reservekopie gedownload. Bewaar dit bestand voor later.'};
 $('#importProgress').onclick=()=>$('#backupFile').click();
 $('#backupFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{
  if(f.size>1000000)throw Error();const data=JSON.parse(await f.text());const raw=data.progress;if(!window.TopoProfile.validate(data.profile===undefined?null:data.profile))throw Error();
  if(data.app!=='topo-italie'||data.version!==1||!raw||raw.schema!==3||!['good','pizzas','slices','trips'].every(k=>Number.isSafeInteger(raw[k])&&raw[k]>=0)||raw.slices>7||raw.trips!==Math.floor(raw.pizzas/3)||!Array.isArray(raw.mistakes)||!TopoRoute.validBackup(raw.route,ROUTE_CHAPTERS))throw Error();
  const restored=TopoLearning.migrate(raw,{});restored.mistakes=restored.mistakes.filter(id=>byId[id]);restored.route=TopoRoute.restore(raw.route,ROUTE_CHAPTERS);restored.daily=restoreDaily(raw.daily);
  if(!confirm('Deze reservekopie vervangt je huidige voortgang. Doorgaan?'))return;
  // Store first: a storage failure must leave the active game untouched.
  window.TopoProfile.commitImport(JSON.stringify(restored),data.profile===undefined?null:data.profile);clearRewardCelebrations();Object.assign(state,restored);state.current=null;state.quizSession=null;state.learnSession=null;state.streak=0;state.wrongOnly=false;sync();mode('route');$('#backupStatus').textContent='Je voortgang is teruggezet. Goede reis!';
 }catch{$('#backupStatus').textContent='Terugzetten lukte niet. Kies een geldige Topo-reservekopie en controleer of opslag is toegestaan.'}finally{e.target.value=''}};
}
setupJourneyExtras();

let roundPaused=false;
function localDay(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function restoreDaily(raw){return {date:typeof raw?.date==='string'?raw.date:localDay(),correct:Number.isSafeInteger(raw?.correct)&&raw.correct>=0?raw.correct:0}}
state.daily=restoreDaily(previousV3?.daily);
function recordDailyCorrect(){if(!state.daily||state.daily.date!==localDay())state.daily={date:localDay(),correct:0};state.daily.correct++;renderDailyGoal()}
function renderDailyGoal(){const n=$('#dailyGoal');if(!n)return;const count=state.daily?.date===localDay()?state.daily.correct:0;$('#dailyTitle').textContent=count>=8?'Dagdoel gehaald!':'Een klein rondje vandaag';$('#dailyText').textContent=count>=8?'Acht goede antwoorden binnen. Verder reizen mag, stoppen is ook goed.':count+' / 8 goede antwoorden · elke stap telt';$('#dailyProgress').value=Math.min(8,count)}
function exitFinish(){roundPaused=false;$('.layout').classList.remove('finishLayout');const f=$('#finishScreen');if(f)f.remove()}
function renderJourneyFinish(pause){
 document.body.classList.remove('lessonFocus');
 const s=state.route.active;if(!s)return;const chapter=TopoRoute.resolveChapter(ROUTE_CHAPTERS,s.chapterId);const passed=s.result?.passed;
 clearActive();hideLens();$('.layout').classList.add('finishLayout');$('#finishScreen')?.remove();
 const screen=document.createElement('section');screen.id='finishScreen';screen.className='finishScreen';screen.setAttribute('aria-labelledby','finishTitle');
 const icon=document.createElement('div');icon.className='finishIcon';icon.textContent=pause?'':s.kind==='gold'&&passed?'⭐':passed?'🎉':'🌱';screen.append(icon);
 const title=document.createElement('h2');title.id='finishTitle';title.tabIndex=-1;screen.append(title);
 const text=document.createElement('p');screen.append(text);
 const end=s.index,start=Math.floor(Math.max(0,end-1)/6)*6,missing=Math.max(0,end-(s.answers||[]).length),known=start>=missing,round=known?(s.answers||[]).slice(start-missing,end-missing):[],right=known?round.filter(a=>a.ok).length:'—',wrong=known?round.filter(a=>!a.ok).length:'—';
 const event=pause?'ROUND.PAUSE':s.kind==='gold'?(passed?(s.result.goldEarned?'CHAPTER.GOLD':'CHAPTER.GOLD_REPLAY'):'CHAPTER.GOLD_MISSED'):s.result?.newlyCompleted?'CHAPTER.FINISH':s.kind==='discover'?'ROUND.RESULT_NO_RETRIEVAL':known&&round.length&&wrong===0?'ROUND.RESULT_PERFECT':'ROUND.RESULT_MIXED';
 screen.dataset.event=event;
 const illustration=TopoArt.create(document,{role:TopoArt.roleFor({phase:'summary',pause,kind:s.kind,passed,goldEarned:s.result?.goldEarned,newlyCompleted:s.result?.newlyCompleted,known,right,wrong,total:round.length})},'summary');
 screen.prepend(illustration);screen.classList.toggle('illustrated',!illustration.hidden);
 title.textContent=pause&&s.kind==='discover'?TopoNino.resolve('ROUND.DISCOVER_PAUSE'):known||!event.startsWith('ROUND.RESULT_')||s.kind==='discover'?TopoNino.resolve(event,{total:round.length}):'Je voortgang is bewaard.';
 const next=ROUTE_CHAPTERS[ROUTE_CHAPTERS.indexOf(chapter)+1];
 text.textContent=pause?TopoNino.resolve('ROUND.PAUSE_LONG'):s.result?.newlyCompleted&&next?TopoNino.resolve('CHAPTER.NEXT',{nextTopic:next.title}):s.kind==='discover'?TopoNino.resolve('DISCOVER.CLOSE'):s.kind==='review'&&passed&&s.wrong===0?TopoNino.resolve('ANSWER.OK_REVIEW'):'Je voortgang blijft op dit apparaat.';
 const stats=document.createElement('div');stats.className='finishStats';for(const [value,label] of [[right,s.kind==='discover'?'bekeken in deze ronde':'goed in deze ronde'],[wrong,'oefenmomenten in deze ronde'],[state.slices+' / 8','verse pizza']]){const item=document.createElement('div'),b=document.createElement('b');b.textContent=value;item.append(b,document.createTextNode(label));stats.append(item)}screen.append(stats);
 const roundTasks=s.queue.slice(start,end),lessonIds=[...new Set(roundTasks.map(t=>t.id))];
 const tricky=[...new Set(roundTasks.filter((task,n)=>round[n]&&!round[n].ok).map(t=>t.id))];
 const detail=document.createElement('p');detail.className='finishDetails';detail.textContent=!known?'Rondegegevens van vóór deze update zijn niet beschikbaar. Je hele-lesresultaat is bewaard.':tricky.length?'Nog eens oefenen: '+tricky.map(id=>byId[id].name).join(', '):'Deze ronde: '+lessonIds.map(id=>byId[id].name).join(', ');screen.append(detail);
 const total=document.createElement('p');total.textContent='Hele les: '+s.correct+' goed · '+s.wrong+' oefenmomenten';screen.append(total);
 const go=routeButton(pause?'Volgende ronde →':!passed?'Nog een oefenrondje →':s.kind!=='smart'&&TopoRoute.record(state.route,s.chapterId).stage<3?'Volgende les →':'Terug naar mijn reis →',()=>{if(pause){roundPaused=false;renderRouteTask()}else if(!passed)startRouteLesson(s.chapterId,s.kind);else routeNext()},'button primary');screen.append(go,routeButton('Terug naar de route',renderRouteHome));$('.layout').append(screen);title.focus({preventScroll:true});screen.scrollIntoView({block:'start',behavior:'auto'});
}
const daily=document.createElement('section');daily.id='dailyGoal';daily.className='dailyGoal';daily.innerHTML='<strong id="dailyTitle"></strong><p id="dailyText"></p><progress id="dailyProgress" max="8" value="0" aria-label="Dagdoel: acht goede antwoorden"></progress>';$('#routeCards').after(daily);
const note=document.createElement('p');note.className='ninoNote';note.textContent='Nino’s route · korte rondjes, steeds een stukje verder.';$('.journeyScreen .routeHero h2').after(note);
renderDailyGoal();


// One SVG coordinate system for marks, locator rings, hit testing and zooms.
const schoolPhoto=$('#school');$('.mapCard').append(schoolPhoto);
const smartButton=routeButton(TopoNino.resolve('ENTRY.START_SMART'),()=>startRouteLesson('smart','smart'),'button secondary');smartButton.id='smartStart';$('#routeContinue').after(smartButton);

const smartNote=document.createElement('p');smartNote.className='smartNote';smartNote.textContent='Een slim rondje heeft zes vragen. Je dagdoel is acht goede antwoorden, ook bij herhalen.';smartButton.after(smartNote);
const mastery=document.createElement('details');mastery.className='mastery';const summary=document.createElement('summary');summary.textContent='Mijn kennis-paspoort';mastery.append(summary);const grid=document.createElement('div');grid.id='masteryGrid';mastery.append(grid);$('#dailyGoal').after(mastery);
mastery.addEventListener('toggle',()=>{if(!mastery.open)return;grid.replaceChildren();const table=document.createElement('table');table.innerHTML='<thead><tr><th>Plek</th><th>Vinden</th><th>Naam</th></tr></thead>';const body=document.createElement('tbody');for(const i of ITEMS){const row=document.createElement('tr');const name=document.createElement('th');name.scope='row';name.textContent=i.name;row.append(name);for(const mode of ['point','write']){const a=state.route.items[i.id]?.skills?.[mode],cell=document.createElement('td');cell.textContent=!a?'Nog oefenen':a.streak===0?'Herhalen':a.due<=Date.now()?'Opfrissen':a.streak>=3?'Goed onthouden':'Op weg';row.append(cell)}body.append(row)}table.append(body);grid.append(table);const note=document.createElement('p');note.textContent='Eerdere lessen en beloningen blijven staan. Deze aparte vaardigheidsmetingen beginnen vanaf deze versie.';grid.append(note)});
