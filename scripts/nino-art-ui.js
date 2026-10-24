/* App-facing illustration slots; ephemeral presentation, never learner progress. */
function setupNinoIllustrations(){
 const slots={};
 const heading=$('.routeHero h2'),intro=$('#routeIntro');
 const entry=document.createElement('div');entry.className='ninoWelcomeLine';
 const copy=document.createElement('div');copy.className='ninoWelcomeCopy';heading.before(entry);copy.append(heading,intro);
 slots.welcome=TopoArt.create(document,{},'welcome');slots.welcome.id='welcomeArt';entry.append(slots.welcome,copy);
 slots.chapter=TopoArt.create(document,{},'scene');slots.chapter.id='chapterScene';$('#routeCards').before(slots.chapter);
 slots.lesson=TopoArt.create(document,{},'lesson');slots.lesson.id='lessonArt';$('.ninoLesson').prepend(slots.lesson);
 slots.practice=TopoArt.create(document,{},'practice');slots.practice.id='practiceArt';$('#freeCoach').prepend(slots.practice);
 slots.arrival=TopoArt.create(document,{},'arrival');slots.arrival.id='arrivalArt';$('#vespaTripToast').prepend(slots.arrival);
 const arrivalCopy=document.createElement('div');arrivalCopy.className='arrivalCopy';
 arrivalCopy.append($('#vespaTripText'));const label=document.createElement('small');label.textContent='Reisillustratie · Italië';arrivalCopy.append(label);$('#vespaTripToast').append(arrivalCopy);
 return slots;
}
const ninoSlots=setupNinoIllustrations();
function updateLessonArt(role){
 TopoArt.update(ninoSlots.lesson,{role});$('.ninoLesson').classList.toggle('illustrated',!ninoSlots.lesson.hidden);
}
function updatePracticeArt(role){
 TopoArt.update(ninoSlots.practice,{role});$('#freeCoach').classList.toggle('illustrated',!ninoSlots.practice.hidden);
}
function clearIllustrations(){
 for(const slot of Object.values(ninoSlots))TopoArt.update(slot,{});
 $('.ninoLesson').classList.remove('illustrated');$('#freeCoach').classList.remove('illustrated');
 $('#vespaTripToast').classList.add('hidden');
}
