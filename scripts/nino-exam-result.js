(function setupNinoExamResult(){
 const dialog = document.createElement('dialog');
 dialog.className = 'ninoExamResult';
 dialog.setAttribute('aria-labelledby','ninoExamTitle');
 dialog.innerHTML = '<h2 id="ninoExamTitle">Toets afgerond!</h2><div class="examArt"></div><strong class="examScore"></strong><p class="examGroup"></p><p class="examMessage"></p><div class="examActions"><button type="button" data-share hidden>Deel score</button><a data-email>E-mail score</a><button type="button" data-copy>Kopieer score</button><button type="button" class="examDone">Terug naar resultaat</button></div><p role="status" class="examStatus"></p><textarea readonly hidden aria-label="Scoretekst"></textarea>';
 document.body.append(dialog);
 const find = selector => dialog.querySelector(selector);
 const note = find('.examStatus'), textBox = find('textarea'), share = find('[data-share]');
 const email = find('[data-email]'), copy = find('[data-copy]'), done = find('.examDone');
 let shareText = '';
 done.onclick = () => dialog.close();
 dialog.addEventListener('close', () => document.querySelector('#next')?.focus({preventScroll:true}));
 share.hidden = typeof navigator.share !== 'function';
 share.onclick = async () => {
  try { await navigator.share({title:'Mijn NINO-toetsscore',text:shareText}); }
  catch (error) { if(error.name !== 'AbortError') note.textContent = 'Delen lukt hier niet. Kies E-mail score of Kopieer score.'; }
 };
 copy.onclick = async () => {
  try { await navigator.clipboard.writeText(shareText); note.textContent = 'Score gekopieerd.'; }
  catch { textBox.hidden = false; textBox.focus(); textBox.select(); note.textContent = 'Kopieer de geselecteerde scoretekst.'; }
 };
 function show() {
  const correct = state.examCorrect, total = state.examTotal;
  if(!total || correct < 0 || correct > total || dialog.open) return;
  const group = document.querySelector('#groupSelect')?.selectedOptions[0]?.textContent.trim() || 'Italië';
  const perfect = correct === total, art = find('.examArt');
  art.replaceChildren(TopoArt.create(document,{role:perfect?'success':'encourage'},'exam-result'));
  find('.examScore').textContent = correct+' van '+total+' goed';
  find('.examGroup').textContent = group;
  find('.examMessage').textContent = perfect ? 'Bravissimo! Alles goed. Bedankt voor het maken van de toets! — Nino' : 'Goed dat je de toets hebt gemaakt! Oefen de lastige plekken nog eens. A presto! — Nino';
  shareText = 'Ik heb de NINO-toets Topografie Italië gemaakt.\nOnderwerp: '+group+'\nScore: '+correct+' van '+total+' goed.';
  email.href = 'mailto:?subject='+encodeURIComponent('Mijn NINO-toetsscore')+'&body='+encodeURIComponent(shareText);
  textBox.value = shareText;
  textBox.hidden = true;
  note.textContent = '';
  dialog.showModal();
  done.focus();
 }
 const originalFinish = finishExam;
 finishExam = function(){originalFinish();show();};
})();
