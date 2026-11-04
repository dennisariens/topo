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
  dialog.innerHTML='<form><h2 id="ninoProfileTitle"></h2><p class="profileIntro"></p><label class="profileName">Jouw naam <span>(mag leeg blijven)</span><input name="name" autocomplete="given-name" aria-describedby="profileNameHelp"></label><small id="profileNameHelp">Maximaal 24 tekens. Je kunt alles later aanpassen in je Reisboekje.</small><fieldset><legend>Kleur van je boekje</legend><div class="profileChoices" data-colors></div></fieldset><fieldset><legend>Jouw lievelingspizza <span>(mag leeg blijven)</span></legend><div class="profileChoices" data-pizzas></div></fieldset><p data-profile-favorite role="status" aria-live="polite"></p><p data-profile-status role="status"></p><div class="profileActions"><button type="button" class="button" data-profile-cancel></button><button class="button" type="submit">Bewaar mijn boekje</button></div></form>';
  dialog.querySelector('h2').textContent=firstRun?'Ciao! Ik ben Nino.':'Jouw Reisboekje';
  dialog.querySelector('.profileIntro').textContent=firstRun?'Reis met mij door Italië. Maak je boekje persoonlijk, of begin meteen.':'Maak je boekje persoonlijk. Je keuzes veranderen je oefeningen en verdiende pizza’s niet.';
  const safeImage=(src,alt)=>{if(typeof src!=='string'||!/^data:image\/(?:png|webp|jpeg);base64,/.test(src))return null;const img=doc.createElement('img');img.src=src;img.alt=alt;return img;};
  const welcome=safeImage(art.welcome,'Nino heet je welkom');if(firstRun&&welcome){welcome.className='profileWelcome';dialog.querySelector('h2').before(welcome);}
  const input=dialog.querySelector('[name="name"]');input.value=initial.name;
  input.addEventListener('input',()=>{if(!input.dataset.composing)input.value=graphemes(input.value).slice(0,24).join('');});
  input.addEventListener('compositionstart',()=>{input.dataset.composing='true';});input.addEventListener('compositionend',()=>{delete input.dataset.composing;input.value=graphemes(input.value).slice(0,24).join('');});
  function radio(container,name,id,label,checked,src){const wrap=doc.createElement('label'),control=doc.createElement('input'),text=doc.createElement('span');wrap.className='profileChoice';control.type='radio';control.name=name;control.value=id;control.checked=checked;text.textContent=label;wrap.append(control);const img=safeImage(src,'');if(img)wrap.append(img);wrap.append(text);container.append(wrap);if(name==='coverColor')wrap.dataset.color=id;}
  COLORS.forEach((c,i)=>radio(dialog.querySelector('[data-colors]'),'coverColor',c,['Rivièra','Terracotta','Citroen'][i],initial.coverColor===c));
  [null,...PIZZAS].forEach((p,i)=>radio(dialog.querySelector('[data-pizzas]'),'favoritePizza',p||'',['Geen voorkeur','Margherita','Salami','Quattro Formaggi'][i],initial.favoritePizza===p,art.pizzas?.[p]));
  const favoriteStatus=dialog.querySelector('[data-profile-favorite]');
  dialog.querySelector('[data-pizzas]').addEventListener('change',e=>{
   const selected=e.target.value;
   favoriteStatus.textContent=selected?'Uitstekende keuze! '+({margherita:'Margherita',salami:'Salami',quattro_formaggi:'Quattro Formaggi'}[selected])+'. Tijdens je reis verdien je alle drie de pizza’s!':'Tijdens je reis verdien je alle drie de pizza’s!';
  });
  const cover=safeImage(art.cover,'Voorbeeld van je Reisboekje');if(cover){cover.className='profileCoverPreview';cover.dataset.color=initial.coverColor;dialog.querySelector('[data-colors]').after(cover);dialog.querySelector('[data-colors]').addEventListener('change',e=>{cover.dataset.color=e.target.value;});}
  if(firstRun)dialog.querySelector('[type="submit"]').textContent='Andiamo! Begin mijn reis';
  function done(){if(active!==dialog)return;active=null;if(dialog.open&&typeof dialog.close==='function')dialog.close();dialog.remove();if(previous?.isConnected)previous.focus({preventScroll:true});if(typeof onDone==='function')onDone(copy(value));}
  function skip(){if(firstRun&&value===null){try{importProfile(initial);}catch{value=copy(initial);announce();}}done();}
  dialog.querySelector('[data-profile-cancel]').textContent=firstRun?'Begin zonder invullen':'Annuleren';dialog.querySelector('[data-profile-cancel]').onclick=skip;
  dialog.addEventListener('cancel',e=>{e.preventDefault();skip();});
  dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,p={schema:1,name:normalizeName(input.value),coverColor:form.querySelector('[name="coverColor"]:checked').value,favoritePizza:form.querySelector('[name="favoritePizza"]:checked').value||null};try{importProfile(p);done();}catch{dialog.querySelector('[data-profile-status]').textContent='Bewaren lukt niet op dit apparaat. Je kunt zonder invullen verdergaan.';}};
  doc.body.append(dialog);active=dialog;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');return dialog;
 }
 root.TopoProfile={current:()=>copy(value),exportProfile:()=>copy(value),validate,normalizeName,importProfile,commitImport,setup,open};
})(window);
