/* PR29 presentation-only integration. Apply before embedding; inverse is for bounded source audits. */
export const pizzaIntegrationPairs=[
  [
    "const rewardDetails=document.createElement('div');rewardDetails.className='rewardDetails';rewardDetails.innerHTML='<strong id=\"sliceCount\">0 / 8 pizzapunten</strong><div class=\"vespaRoute\"><span id=\"vespaIcon\" class=\"vespa\" aria-hidden=\"true\">🛵</span><span id=\"vespaDestination\"></span></div>';",
    "const rewardDetails=document.createElement('div');rewardDetails.className='rewardDetails';rewardDetails.innerHTML='<strong id=\"sliceCount\" aria-live=\"polite\">0 / 8 pizzapunten</strong><div class=\"vespaRoute\"><span id=\"vespaIcon\" class=\"vespa\" aria-hidden=\"true\"></span><span id=\"vespaDestination\"></span></div>';"
  ],
  [
    "function drawPizza(target,slices){target.querySelectorAll('.wheelSlice').forEach((w,n)=>w.classList.toggle('earned',n<slices))}\nfunction sync(){ $('#good').textContent=state.good;$('#streak').textContent=state.streak;$('#pizzas').textContent=state.pizzas;$('#rewardPizzaTotal').textContent=state.pizzas;drawPizza($('#rewardPizzaVisual'),state.slices);$('#pizzaProgress').style.width=(state.slices/8*100)+'%';$('#sliceCount').textContent=state.slices+' / 8 punten voor de volgende pizza';const route=TopoLearning.journey(state.trips+1);$('#vespaDestination').textContent=state.trips+' rit'+(state.trips===1?'':'ten')+' gemaakt · volgende: '+route.from+' → '+route.to;$('#pizzaCaption').textContent=`Nog ${8-state.slices} goede antwoorden tot de volgende pizza. Fouten halen geen pizza’s weg.`;renderRewardHub();persist()}\nfunction celebrateTrip(from,to){const vespa=$('#vespaIcon');vespa.classList.remove('trip');void vespa.offsetWidth;vespa.classList.add('trip');const toast=$('#vespaTripToast');$('#vespaTripText').textContent=TopoNino.resolve('ANSWER.OK_TRIP',{rewardCity:to});toast.classList.remove('hidden');toast.classList.add('riding');setTimeout(()=>{vespa.classList.remove('trip');toast.classList.add('hidden');toast.classList.remove('riding')},1500)}",
    "function drawPizza(target,slices){TopoPizza.draw(target,slices,state.pizzas)}\nfunction sync(){ $('#good').textContent=state.good;$('#streak').textContent=state.streak;$('#pizzas').textContent=state.pizzas;$('#rewardPizzaTotal').textContent=state.pizzas;drawPizza($('#rewardPizzaVisual'),state.slices);$('#pizzaProgress').style.width=(state.slices/8*100)+'%';$('#sliceCount').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8 pizzapunten';const route=TopoLearning.journey(state.trips+1);$('#vespaDestination').textContent=state.trips+' rit'+(state.trips===1?'':'ten')+' gemaakt · volgende: '+route.from+' → '+route.to;$('#pizzaCaption').textContent=`Nog ${8-state.slices} goede antwoorden tot de volgende pizza. Fouten halen geen pizza’s weg.`;renderRewardHub();persist()}\nlet tripTimer=null;\nfunction celebrateTrip(from,to){clearTimeout(tripTimer);const vespa=$('#vespaIcon');vespa.classList.remove('trip');void vespa.offsetWidth;vespa.classList.add('trip');const toast=$('#vespaTripToast');$('#vespaTripText').textContent=TopoNino.resolve('ANSWER.OK_TRIP',{rewardCity:to});toast.classList.remove('hidden');toast.classList.add('riding');tripTimer=setTimeout(()=>{vespa.classList.remove('trip');toast.classList.add('hidden');toast.classList.remove('riding')},1500)}"
  ],
  [
    "$('#resetPizza').onclick=()=>{if(confirm('Pizza’s, pizzapunten en Vespa-ritten resetten?')){state.pizzas=state.slices=state.trips=0;sync();message('Pizza’s en Vespa gereset. Je foutenlijst blijft bewaard.')}};$('#resetAll').onclick=()=>{if(confirm('Alle pizza’s, Vespa-ritten, leerroute-lessen, gouden sterren en opgeslagen fouten verwijderen?')){state.pizzas=state.slices=state.trips=state.good=state.streak=0;state.daily={date:localDay(),correct:0};renderDailyGoal();state.mistakes=[];state.route=TopoRoute.fresh();state.wrongOnly=false;state.quizSession=null;state.current=null;state.answered=true;$('#mistakes').textContent='Oefen fouten';sync();if(state.mode==='route')renderRouteHome();else if(state.mode==='learn')renderLearn();else if(state.mode==='exam')resetExam();else next()}};$('#schoolToggle').onchange=e=>{$('#school').classList.toggle('hidden',!e.target.checked);$('#school').classList.remove('on')};",
    "$('#resetPizza').onclick=()=>{if(confirm('Pizza’s, pizzapunten en Vespa-ritten resetten?')){clearRewardCelebrations();state.pizzas=state.slices=state.trips=0;sync();message('Pizza’s en Vespa gereset. Je foutenlijst blijft bewaard.')}};$('#resetAll').onclick=()=>{if(confirm('Alle pizza’s, Vespa-ritten, leerroute-lessen, gouden sterren en opgeslagen fouten verwijderen?')){clearRewardCelebrations();state.pizzas=state.slices=state.trips=state.good=state.streak=0;state.daily={date:localDay(),correct:0};renderDailyGoal();state.mistakes=[];state.route=TopoRoute.fresh();state.wrongOnly=false;state.quizSession=null;state.current=null;state.answered=true;$('#mistakes').textContent='Oefen fouten';sync();if(state.mode==='route')renderRouteHome();else if(state.mode==='learn')renderLearn();else if(state.mode==='exam')resetExam();else next()}};$('#schoolToggle').onchange=e=>{$('#school').classList.toggle('hidden',!e.target.checked);$('#school').classList.remove('on')};"
  ],
  [
    " $('#routeReward').textContent=state.slices+' / 8 punten tot een pizza · '+state.pizzas+' pizza’s gespaard · '+state.trips+' Vespa-ritten gemaakt';$('#journeyDestination').textContent=TopoLearning.journey(state.trips+1).to;drawPizza($('#journeyWheel'),state.slices);$('#journeyPizzaCount').textContent=state.pizzas;$('#journeyTripDots').textContent=(state.pizzas%3)+' / 3 pizza’s voor de volgende rit';",
    " $('#routeReward').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8 punten tot een pizza · '+state.pizzas+' pizza’s gespaard · '+state.trips+' Vespa-ritten gemaakt';$('#journeyDestination').textContent=TopoLearning.journey(state.trips+1).to;drawPizza($('#journeyWheel'),state.slices);$('#journeyPizzaCount').textContent=state.pizzas;$('#journeySliceCount').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8';$('#journeyTripDots').textContent=(state.pizzas%3)+' / 3 pizza’s voor de volgende rit';"
  ],
  [
    " drawPizza($('#journeyWheel'),state.slices);drawPizza($('#rewardPizzaVisual'),state.slices);if($('#lessonReward')){drawPizza($('#lessonReward'),state.slices);$('#lessonRewardText').textContent=state.slices+' / 8 pizzapunten'}\n $('#journeyPizzaCount').textContent=state.pizzas;",
    " drawPizza($('#journeyWheel'),state.slices);drawPizza($('#rewardPizzaVisual'),state.slices);if($('#lessonReward')){drawPizza($('#lessonReward'),state.slices);$('#lessonRewardText').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8 pizzapunten'}\n $('#journeyPizzaCount').textContent=state.pizzas;$('#journeySliceCount').textContent=TopoPizza.name(TopoPizza.flavor(state.pizzas))+' · '+state.slices+' / 8';"
  ],
  [
    "function celebrateReward(reward){if(reward.trip){TopoArt.update(ninoSlots.arrival,{role:TopoArt.roleFor({phase:'arrival',reward})});celebrateTrip(reward.from,reward.to)}}",
    "function celebrateReward(reward){pizzaCelebrations.enqueue({...reward,pizzas:state.pizzas})}\nfunction clearRewardCelebrations(){pizzaCelebrations.clear();clearTimeout(tripTimer);$('#vespaTripToast').classList.add('hidden');$('#vespaIcon').classList.remove('trip')}"
  ],
  [
    "  localStorage.setItem('topo-italie-v3',JSON.stringify(restored));Object.assign(state,restored);state.current=null;state.quizSession=null;state.learnSession=null;state.streak=0;state.wrongOnly=false;sync();mode('route');$('#backupStatus').textContent='Je voortgang is teruggezet. Goede reis!';",
    "  localStorage.setItem('topo-italie-v3',JSON.stringify(restored));clearRewardCelebrations();Object.assign(state,restored);state.current=null;state.quizSession=null;state.learnSession=null;state.streak=0;state.wrongOnly=false;sync();mode('route');$('#backupStatus').textContent='Je voortgang is teruggezet. Goede reis!';"
  ],
  [
    " const icon=document.createElement('div');icon.className='finishIcon';icon.textContent=pause?'🛵':s.kind==='gold'&&passed?'⭐':passed?'🎉':'🌱';screen.append(icon);",
    " const icon=document.createElement('div');icon.className='finishIcon';icon.textContent=pause?'':s.kind==='gold'&&passed?'⭐':passed?'🎉':'🌱';screen.append(icon);"
  ],
  [
    "const ninoSlots=setupNinoIllustrations();",
    "const ninoSlots=setupNinoIllustrations();\nconst pizzaCelebrations=TopoPizza.createCelebrations({document,reducedMotion:()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false,onTrip:event=>{TopoArt.update(ninoSlots.arrival,{role:TopoArt.roleFor({phase:'arrival',reward:event})});celebrateTrip(event.from,event.to)}});"
  ],
  [
    " for(const slot of Object.values(ninoSlots))TopoArt.update(slot,{});",
    " for(const slot of Object.values(ninoSlots)){if(slot===ninoSlots.arrival&&pizzaCelebrations.busy)continue;TopoArt.update(slot,{})}"
  ],
  [
    " $('#vespaTripToast').classList.add('hidden');",
    " if(!pizzaCelebrations.busy)$('#vespaTripToast').classList.add('hidden');"
  ],
  [
    "<span id=\"journeyTripDots\">",
    "<span id=\"journeySliceCount\" aria-live=\"polite\">Margherita · 0 / 8</span><span id=\"journeyTripDots\">"
  ]
];
export function applyPizzaIntegration(source,{reverse=false}={}){for(const pair of (reverse?[...pizzaIntegrationPairs].reverse():pizzaIntegrationPairs)){const [from,to]=reverse?[pair[1],pair[0]]:pair;if(!from||source.split(from).length!==2)throw Error("Pizza integration anchor must occur exactly once: "+from.slice(0,100));source=source.replace(from,()=>to)}return source}

// Exactly the three PR29 artwork-slot hooks; no other illustration policy is excluded.
export function restorePizzaArtUI(source){
 for(const i of [8,9,10]){const [original,changed]=pizzaIntegrationPairs[i];if(source.split(changed).length!==2)throw Error('Unexpected pizza art UI hook '+i);source=source.replace(changed,()=>original);}
 return source;
}
