/* NOW-only copy from PR #6 at d746ac9d. Embedded in the third app script. */
(function(root){
 'use strict';
 const messages={
  'ENTRY.FIRST':'Ciao! Ik ben Nino. Zin in Italië?',
  'ENTRY.RETURN':'Welkom terug. Zullen we verdergaan?',
  'ENTRY.RESUME':'We gaan verder waar je was.',
  'ENTRY.COMPLETE':'Alle elf haltes gedaan. Tijd om op te frissen.',
  'ENTRY.START':'Start mijn reis',
  'ENTRY.START_SMART':'Mijn slimme rondje · 6 vragen',
  'DISCOVER.OPEN':'Eerst kijken. Daarna zelf zoeken.',
  'DISCOVER.PLACE':'Dit is {place}. Zeg de naam eens hardop.',
  'DISCOVER.CLOSE':'Mooi bekeken. Klaar om aan te wijzen?',
  'DISCOVER.ISLANDS':'Twee eilanden. Kun jij ze uit elkaar houden?',
  'DISCOVER.VOLCANO':'Twee vulkanen, twee verschillende plekken.',
  'DISCOVER.MICROSTATE':'Vaticaanstad ligt helemaal binnen Rome.',
  'PROMPT.WRITE':'Schrijf de naam van de gemarkeerde plek.',
  'PROMPT.SMART_OPEN':'Een kort rondje: zoeken en schrijven.',
  'PROMPT.DUE':'Eens kijken wat je nog weet.',
  'PROMPT.GOLD_OPEN':'De gouden proef: alles goed voor goud.',
  'ANSWER.OK_POINT':['Goed gevonden!','Ja, dat is {place}.','Precies aangewezen.'],
  'ANSWER.OK_WRITE':['Goed geschreven!','Precies, {place}.','Die naam zat goed.'],
  'ANSWER.OK_REVIEW':['Goed onthouden!','Deze heb je nog paraat.','Die vond je weer terug.'],
  'ANSWER.OK_REPLAY':['Goed onthouden!','Nog steeds raak.','Ja, deze zit erin.'],
  'ANSWER.OK_PIZZA':'Perfetto! Een pizza compleet.',
  'ANSWER.OK_TRIP':'Andiamo! Nino rijdt naar {rewardCity}.',
  'ANSWER.WRONG_POINT_KNOWN':'Dat was {chosen}. Gezocht: {place}.',
  'ANSWER.WRONG_POINT_UNKNOWN':'Dit is de plek van {place}.',
  'ANSWER.WRONG_WRITE':'De juiste naam is {place}.',
  'ANSWER.WRONG_GOLD':'Deze proef is nog niet foutloos.',
  'ANSWER.SKIP':'Geen probleem. Dit was {place}.',
  'ROUND.PAUSE':'Even parkeren. Zes vragen gedaan.',
  'ROUND.PAUSE_LONG':'Nog meer plekken te gaan. Zin om door te rijden?',
  'ROUND.RESULT_PERFECT':'Alles goed in dit rondje!',
  'ROUND.RESULT_MIXED':'Je hebt {total} vragen gedaan. Verder oefenen?',
  'ROUND.RESULT_NO_RETRIEVAL':'Je hebt de plekken bekeken.',
  'CHAPTER.FINISH':'Deze halte is afgerond!',
  'CHAPTER.NEXT':'Volgende thema: {nextTopic}.',
  'CHAPTER.GOLD':'Perfetto! Goud verdiend.',
  'CHAPTER.GOLD_REPLAY':'Goud behouden. Nog steeds sterk!',
  'CHAPTER.GOLD_MISSED':'Nog niet foutloos. Dat kan later.'
 };
 const visits=new Map();
 function resolve(event,context={}){
  const pool=messages[event],visit=visits.get(event)||0;
  if(Array.isArray(pool))visits.set(event,visit+1);
  const template=Array.isArray(pool)?pool[visit%pool.length]:pool;
  return typeof template==='string'?template.replace(/\{(\w+)\}/g,(_,key)=>String(context[key]??'')):'';
 }
 function answer(context){
  const {ok,mode,place,chosen,skipped,kind,reward,earned=true}=context;
  // Preserve existing Toets feedback and real milestones, without new assistance.
  if(mode==='exam')return ok?'Goed! '+place+'.'+(reward?.trip?' '+resolve('ANSWER.OK_TRIP',{rewardCity:reward.to}):reward?.pizza?' Een pizza verdiend.':''):'Het juiste antwoord is '+place+'.';
  if(ok){
   const event=reward?.trip?'ANSWER.OK_TRIP':reward?.pizza?'ANSWER.OK_PIZZA':!earned?'ANSWER.OK_REPLAY':kind==='review'?'ANSWER.OK_REVIEW':mode==='point'?'ANSWER.OK_POINT':'ANSWER.OK_WRITE';
   return resolve(event,{place,rewardCity:reward?.to});
  }
  const event=skipped?'ANSWER.SKIP':mode==='point'?(chosen?'ANSWER.WRONG_POINT_KNOWN':'ANSWER.WRONG_POINT_UNKNOWN'):'ANSWER.WRONG_WRITE';
  return resolve(event,{place,chosen})+(kind==='gold'?' '+resolve('ANSWER.WRONG_GOLD'):'');
 }
 root.TopoNino={resolve,answer};
})(typeof window==='undefined'?globalThis:window);
