/* Independently versioned, cosmetic identity. Never reads or awards learning rewards. */
(function(root){
 'use strict';
 const KEY='topo-nino-profile-v1', COLORS=['riviera','terracotta','lemon'], PIZZAS=['margherita','salami','quattro_formaggi'];
 const segments=typeof Intl.Segmenter==='function'?new Intl.Segmenter('nl',{granularity:'grapheme'}):null;
 const graphemes=s=>segments?Array.from(segments.segment(s),v=>v.segment):Array.from(s);
 const normalizeName=s=>graphemes(String(s).trim()).slice(0,24).join('');
 const validate=p=>p===null||!!(p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).length===4&&Object.keys(p).every(k=>['schema','name','coverColor','favoritePizza'].includes(k))&&p.schema===1&&typeof p.name==='string'&&p.name===normalizeName(p.name)&&COLORS.includes(p.coverColor)&&(p.favoritePizza===null||PIZZAS.includes(p.favoritePizza)));
 const copy=p=>p===null?null:{schema:1,name:p.name,coverColor:p.coverColor,favoritePizza:p.favoritePizza};
 let value=null, art={}, active=null;
 try{const raw=JSON.parse(root.localStorage.getItem(KEY));if(validate(raw))value=copy(raw);}catch{}
 function announce(){root.dispatchEvent(new root.CustomEvent('topo-profile-change',{detail:copy(value)}));}
 function importProfile(p){if(!validate(p))throw Error('Ongeldig reisprofiel');if(p===null)root.localStorage.removeItem(KEY);else root.localStorage.setItem(KEY,JSON.stringify(p));value=copy(p);announce();return copy(value);}
 function commitImport(progress,p){
  if(!validate(p)||typeof progress!=='string')throw Error('Ongeldige reservekopie');
  const storage=root.localStorage, old=storage.getItem(KEY);
  // Write optional identity first; a blocked profile store cannot alter progress.
  if(p===null)storage.removeItem(KEY);else storage.setItem(KEY,JSON.stringify(p));
  try{storage.setItem('topo-italie-v3',progress);}catch(error){try{if(old===null)storage.removeItem(KEY);else storage.setItem(KEY,old);}catch{}throw error;}
  value=copy(p);announce();
 }
 function setup(options={}){art=options.art||{};}
 function open({firstRun=false,onDone}={}){
  if(active){active.focus();return active;}
  const doc=root.document, previous=doc.activeElement, initial=copy(value)||{schema:1,name:'',coverColor:'riviera',favoritePizza:null};
  const dialog=doc.createElement('dialog');dialog.className='ninoProfile';dialog.setAttribute('aria-labelledby','ninoProfileTitle');
  dialog.innerHTML='<form><div class="profileScene"><div class="profileBubble"><h2 id="ninoProfileTitle"></h2><p class="profileIntro"></p><p data-profile-favorite role="status" aria-live="polite"></p></div></div><label class="profileName">Jouw naam <span>(mag leeg blijven)</span><input name="name" autocomplete="given-name" aria-describedby="profileNameHelp"></label><small id="profileNameHelp">Maximaal 24 tekens.</small><fieldset><legend>Wat is jouw favoriete pizza?</legend><div class="profileChoices" data-pizzas></div></fieldset><p data-profile-status role="status"></p><div class="profileActions"><button type="button" class="button" data-profile-cancel></button><button class="button" type="submit">Bewaar mijn boekje</button></div></form>';
  const heading=dialog.querySelector('h2'),intro=dialog.querySelector('.profileIntro'),scene=dialog.querySelector('.profileScene');
  heading.textContent=firstRun?'Ciao! Ik ben Nino.':'Jouw Reisboekje';
  intro.textContent=firstRun?'Hoe mag ik je noemen?':'Je keuzes veranderen je oefeningen en verdiende pizza’s niet.';
  const safeImage=(src,alt)=>{if(typeof src!=='string'||!/^data:image\/(?:png|webp|jpeg);base64,/.test(src))return null;const img=doc.createElement('img');img.src=src;img.alt=alt;return img;};
  const welcome=safeImage(art.welcome,'Nino zwaait vanaf zijn Vespa');
  if(firstRun&&welcome){welcome.className='profileWelcome';scene.prepend(welcome);dialog.classList.add('ninoFirstRun');if(safeImage(art.scene,''))scene.style.setProperty('--profile-scene','url("'+art.scene+'")');}
  const input=dialog.querySelector('[name="name"]');input.value=initial.name;
  input.addEventListener('input',()=>{if(!input.dataset.composing)input.value=graphemes(input.value).slice(0,24).join('');});
  input.addEventListener('compositionstart',()=>{input.dataset.composing='true';});input.addEventListener('compositionend',()=>{delete input.dataset.composing;input.value=graphemes(input.value).slice(0,24).join('');});
  function radio(container,name,id,label,checked,src){const wrap=doc.createElement('label'),control=doc.createElement('input'),text=doc.createElement('span');wrap.className='profileChoice';control.type='radio';control.name=name;control.value=id;control.checked=checked;text.textContent=label;wrap.append(control);const img=safeImage(src,'');if(img)wrap.append(img);wrap.append(text);container.append(wrap);}
  const labels={margherita:'Margherita',salami:'Salami',quattro_formaggi:'Quattro Formaggi'},reactions={margherita:'Uitstekende keuze! Margherita is een echte Italiaanse klassieker!',salami:'Uitstekende keuze! Salami, heerlijk!',quattro_formaggi:'Uitstekende keuze! Quattro Formaggi — quattro kazen!'};
  (firstRun?PIZZAS:[null,...PIZZAS]).forEach(p=>radio(dialog.querySelector('[data-pizzas]'),'favoritePizza',p||'',p?labels[p]:'Geen voorkeur',initial.favoritePizza===p,art.pizzas?.[p]));
  const favoriteStatus=dialog.querySelector('[data-profile-favorite]');
  dialog.querySelector('[data-pizzas]').addEventListener('change',e=>{
   const selected=e.target.value;
   favoriteStatus.textContent=(selected?reactions[selected]+' ':'')+'Tijdens je reis verdien je alle drie de pizza’s!';
   if(firstRun){intro.hidden=true;if(welcome){welcome.classList.remove('nod');void welcome.offsetWidth;welcome.classList.add('nod');}}
  });
  if(firstRun)input.addEventListener('input',()=>{const name=normalizeName(input.value);heading.textContent=name?'Ciao, '+name+'!':'Ciao! Ik ben Nino.';});
  if(firstRun)dialog.querySelector('[type="submit"]').textContent='Andiamo!';
  function done(){if(active!==dialog)return;active=null;if(dialog.open&&typeof dialog.close==='function')dialog.close();dialog.remove();if(previous?.isConnected)previous.focus({preventScroll:true});if(typeof onDone==='function')onDone(copy(value));}
  function skip(){if(firstRun&&value===null){try{importProfile(initial);}catch{value=copy(initial);announce();}}done();}
  dialog.querySelector('[data-profile-cancel]').textContent=firstRun?'Overslaan':'Annuleren';dialog.querySelector('[data-profile-cancel]').onclick=skip;
  dialog.addEventListener('cancel',e=>{e.preventDefault();skip();});
  dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,p={schema:1,name:normalizeName(input.value),coverColor:initial.coverColor,favoritePizza:form.querySelector('[name="favoritePizza"]:checked')?.value||null};try{importProfile(p);done();}catch{dialog.querySelector('[data-profile-status]').textContent='Bewaren lukt niet op dit apparaat. Je kunt zonder invullen verdergaan.';}};
  doc.body.append(dialog);active=dialog;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');return dialog;
 }
 root.TopoProfile={current:()=>copy(value),exportProfile:()=>copy(value),validate,normalizeName,importProfile,commitImport,setup,open};
})(window);
