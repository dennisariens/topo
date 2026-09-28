/* Pure, dependency-free learning route. Geography stays in index.html. */
(function (root) {
  'use strict';
  const DAY = 86400000;
  const STAGES = ['discover', 'point', 'write', 'codes'];
  const MODES = ['discover', 'point', 'write', 'codeName', 'nameCode'];
  const integer = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  const key = task => task.id + ':' + task.mode;
  const fresh = () => ({ schema: 1, chapters: {}, items: {}, active: null });
  const record = (data, id) => data.chapters[id] || (data.chapters[id] = {
    stage: 0, completedAt: 0, goldAt: 0, nextReviewAt: 0, reviews: 0
  });
  function unlocked(data, chapters, id) {
    const index = chapters.findIndex(chapter => chapter.id === id);
    return index >= 0 && (index === 0 || record(data, chapters[index - 1].id).stage === 4);
  }
  function restore(raw, chapters) {
    const data = fresh();
    if (!raw || raw.schema !== 1) return data;
    const ids = new Set(chapters.flatMap(chapter => chapter.itemIds));
    let previousComplete = true;
    for (const chapter of chapters) {
      const old = raw.chapters?.[chapter.id] || {};
      const stage = previousComplete ? Math.min(4, integer(old.stage)) : 0;
      data.chapters[chapter.id] = {
        stage, completedAt: stage === 4 ? integer(old.completedAt) : 0,
        goldAt: stage === 4 ? integer(old.goldAt) : 0,
        nextReviewAt: stage === 4 ? integer(old.nextReviewAt) : 0,
        reviews: stage === 4 ? integer(old.reviews) : 0
      };
      previousComplete = stage === 4;
    }
    for (const id of ids) {
      const old = raw.items?.[id];
      if (old && typeof old === 'object') data.items[id] = {
        correct: integer(old.correct), wrong: integer(old.wrong),
        streak: integer(old.streak), lastSeen: integer(old.lastSeen), lastWrong: integer(old.lastWrong)
      };
    }
    const s = raw.active, chapter = chapters.find(entry => entry.id === s?.chapterId);
    if (!s || !chapter || !unlocked(data, chapters, chapter.id)) return data;
    const allowed = new Set(chapter.itemIds);
    if (![...STAGES, 'gold', 'review'].includes(s.kind) || !Array.isArray(s.queue) || !s.queue.length || s.queue.length > 120) return data;
    if (!s.queue.every(task => task && allowed.has(task.id) && MODES.includes(task.mode))) return data;
    if (!Array.isArray(s.pending) || !Array.isArray(s.awarded) || !Number.isInteger(s.originalTotal) || s.originalTotal < 1 || s.originalTotal > 28) return data;
    if (s.done && (!s.result || typeof s.result.passed !== 'boolean')) return data;
    if (!Number.isInteger(s.index) || s.index < 0 || s.index > s.queue.length) return data;
    if (s.index === s.queue.length && !s.done) return data;
    const r = record(data, chapter.id), stage = STAGES.indexOf(s.kind);
    if (stage > r.stage || (stage < 0 && r.stage !== 4)) return data;
    data.active = {
      chapterId: chapter.id, kind: s.kind, queue: s.queue.map(task => ({ id: task.id, mode: task.mode })),
      index: s.index, answered: s.answered === true, done: s.done === true,
      originalTotal: Math.max(1, Math.min(28, integer(s.originalTotal))),
      correct: integer(s.correct), wrong: integer(s.wrong),
      pending: Array.isArray(s.pending) ? s.pending.filter(value => s.queue.some(task => key(task) === value)) : [],
      awarded: Array.isArray(s.awarded) ? s.awarded.filter(value => s.queue.some(task => key(task) === value)) : [],
      lastAnswer: s.lastAnswer && typeof s.lastAnswer.ok === 'boolean' ? { ok: s.lastAnswer.ok } : null,
      result: s.done && s.result ? { passed: s.result.passed === true, goldEarned: s.result.goldEarned === true,
        newlyCompleted: s.result.newlyCompleted === true } : null
    };
    return data;
  }
  function shuffle(values, random = Math.random) {
    const a = values.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function makeDeck(ids, modes, random, previousId) {
    const tasks = [];
    for (const mode of modes) {
      const round = shuffle(ids, random), last = tasks.at(-1)?.id || previousId;
      if (round.length > 1 && round[0] === last) [round[0], round[1]] = [round[1], round[0]];
      tasks.push(...round.map(id => ({ id, mode })));
    }
    return tasks;
  }
  function start(data, chapters, chapterId, kind, now = Date.now(), random = Math.random) {
    const chapter = chapters.find(entry => entry.id === chapterId);
    if (!chapter || !unlocked(data, chapters, chapterId)) return false;
    const r = record(data, chapterId), stage = STAGES.indexOf(kind);
    if (stage < 0 && !['gold', 'review'].includes(kind)) return false;
    if (stage > r.stage || (stage < 0 && r.stage !== 4)) return false;
    let ids = chapter.itemIds.slice();
    if (kind === 'review') ids = shuffle(ids, random).sort((a,b) => {
      const x=data.items[a]||{},y=data.items[b]||{};
      const weakness = item => (item.wrong||0)*3-(item.streak||0);
      return weakness(y)-weakness(x)||(x.lastSeen||0)-(y.lastSeen||0);
    }).slice(0,6);
    const modes = kind === 'gold' ? ['point','write'] : kind === 'codes' ? ['codeName','nameCode'] : kind === 'review' ? ['write'] : [kind];
    const previous = data.active?.queue?.[Math.min(data.active.index,data.active.queue.length-1)]?.id;
    if(kind==='review'&&ids.length>1&&ids[0]===previous)[ids[0],ids[1]]=[ids[1],ids[0]];
    const queue = kind==='review'?ids.map(id=>({id,mode:'write'})):makeDeck(ids, modes, random, previous);
    data.active = { chapterId, kind, queue, index: 0, answered: false, done: false,
      originalTotal: queue.length, correct: 0, wrong: 0, pending: queue.map(key), awarded: [], lastAnswer: null, result: null };
    return true;
  }
  function current(data) { const s=data.active; return s&&!s.done?s.queue[s.index]||null:null; }
  function answer(data, chapters, ok, now = Date.now(), random = Math.random) {
    const s=data.active, task=current(data);
    if (!s || !task || s.answered) return { reward: false, ignored: true };
    s.answered=true;s.lastAnswer={ok:!!ok};
    const token=key(task), discover=s.kind==='discover';
    if (ok) { s.correct++;s.pending=s.pending.filter(value=>value!==token); } else { s.wrong++;if(!s.pending.includes(token))s.pending.push(token); }
    let reward=false;
    if(!discover){
      const stats=data.items[task.id]||(data.items[task.id]={correct:0,wrong:0,streak:0,lastSeen:0,lastWrong:0});
      stats.lastSeen=now;
      if(ok){stats.correct++;stats.streak++;if(!s.awarded.includes(token)){reward=true;s.awarded.push(token)}}
      else{stats.wrong++;stats.streak=0;stats.lastWrong=now}
    }
    if(!ok&&s.kind!=='gold'&&s.queue.length<s.originalTotal*4+4){
      const chapter=chapters.find(entry=>entry.id===s.chapterId);
      const alternatives=shuffle(chapter.itemIds.filter(id=>id!==task.id),random);
      const tail=s.queue.slice(s.index+1);
      // Keep feedback and later retrieval distinct. Pad only a short tail, with different places.
      const wait=Math.min(2,alternatives.length);
      let last=s.queue.at(-1)?.id;
      for(let n=tail.length;n<wait;n++){
        const id=alternatives.find(value=>value!==last)||alternatives[0];
        if(id){s.queue.push({id,mode:task.mode});last=id}
      }
      if(s.queue.at(-1)?.id===task.id&&alternatives.length)s.queue.push({id:alternatives[0],mode:task.mode});
      s.queue.push({...task});
    }
    return {reward,ignored:false};
  }
  function advance(data, chapters, now = Date.now()) {
    const s=data.active;if(!s||s.done||!s.answered)return false;
    s.index++;s.answered=false;s.lastAnswer=null;
    if(s.index<s.queue.length)return true;
    const r=record(data,s.chapterId), stage=STAGES.indexOf(s.kind);
    const passed=s.kind==='gold'?s.wrong===0:s.pending.length===0;
    let newlyCompleted=false,goldEarned=false;
    if(passed&&stage===r.stage){r.stage++;if(r.stage===4){r.completedAt=now;r.nextReviewAt=now+DAY;newlyCompleted=true}}
    if(passed&&s.kind==='gold'){goldEarned=!r.goldAt;r.goldAt=r.goldAt||now;r.nextReviewAt=now+DAY}
    if(s.kind==='review'){
      r.reviews=passed&&s.wrong===0?r.reviews+1:0;
      r.nextReviewAt=now+[1,3,7,14][Math.min(r.reviews,3)]*DAY;
    }
    s.done=true;s.answered=true;s.result={passed,goldEarned,newlyCompleted};
    return true;
  }
  function due(data, chapters, now = Date.now()) {
    return chapters.filter(chapter=>{const r=record(data,chapter.id);return r.stage===4&&r.nextReviewAt>0&&r.nextReviewAt<=now;});
  }
  root.TopoRoute={DAY,STAGES,fresh,restore,record,unlocked,start,current,answer,advance,due};
})(typeof window==='undefined'?globalThis:window);
