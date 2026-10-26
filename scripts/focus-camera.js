/* Focus camera: presentation only; the single source SVG stays 890 × 1235.
 * Load after discovery-map.js. The layout owner calls update(active).
 * No source-SVG styles/attributes are written: picker clones remain canonical.
 */
(function (root) {
 'use strict';
 const WORLD = { width: 890, height: 1235 }, MAX_ZOOM = 4;
 const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
 function fitPlan(width, height, zoom = 1, center = { x: 445, y: 617.5 }) {
  if (!(width > 0 && height > 0)) return null;
  const fit = Math.min(width / WORLD.width, height / WORLD.height);
  const scale = fit * clamp(Number.isFinite(zoom) ? zoom : 1, 1, MAX_ZOOM);
  const w = WORLD.width * scale, h = WORLD.height * scale;
  const stageW = Math.max(width, w), stageH = Math.max(height, h);
  const left = (stageW - w) / 2, top = (stageH - h) / 2;
  return { fit, scale, w, h, stageW, stageH, left, top,
   scrollLeft: clamp(left + center.x * scale - width / 2, 0, stageW - width),
   scrollTop: clamp(top + center.y * scale - height / 2, 0, stageH - height) };
 }
 let controller = null;
 function setup() {
  const map = document.getElementById('map'), atlas = root.TopoAtlas;
  const canvas = map?.parentElement, area = map?.closest('.atlasViewport');
  const tools = document.querySelector('.mapTools');
  // Discovery owns the wrapper and API; never create a competing wrapper.
  if (!atlas || !canvas?.classList.contains('atlasCanvas') || !area || !tools) return null;
  let active = false, level = 1, cameraMode = 'overview', last = null;
  let lastW = 0, lastH = 0, center = { x: 445, y: 617.5 }, explorationKey = null;
  let saved = null, pending = 0;
  const properties = ['width', 'height', '--focus-world-width', '--focus-world-height',
   '--focus-world-left', '--focus-world-top'];
  const nav = document.createElement('div');
  nav.className = 'focusCameraTools';
  nav.setAttribute('role', 'group');nav.setAttribute('aria-label', 'Kaart in beeld');
  function button(text, action) {
   const b = document.createElement('button');b.type = 'button';b.textContent = text;
   b.onclick = action;nav.append(b);return b;
  }
  const fullButton = button('Heel Italië', () => overview());
  const chapterButton = button('Zoom op hoofdstuk', () => chapter());
  const hint = document.createElement('span');
  hint.className='focusCameraHint';hint.hidden=true;hint.textContent='Kies één hoofdstuk om in te zoomen';
  nav.append(hint);tools.append(nav);
  function updateButtons() {
   const ctx=context(),available=!!ctx.ids?.length && ctx.ids.length < 45 && !!bounds(ctx.ids);
   if(chapterButton.disabled!==!available)chapterButton.disabled=!available;
   chapterButton.title=available?'Zoom in op alle plaatsen van dit hoofdstuk':'Kies één hoofdstuk om in te zoomen';
   hint.hidden=available;fullButton.setAttribute('aria-pressed',String(cameraMode==='overview'));
   chapterButton.setAttribute('aria-pressed',String(cameraMode==='chapter'&&available));
  }
  function writeStyle(name, value) {
   if (canvas.style.getPropertyValue(name) !== value) canvas.style.setProperty(name, value);
  }
  function readCenter() {
   return last ? { x: (area.scrollLeft + lastW / 2 - last.left) / last.scale,
    y: (area.scrollTop + lastH / 2 - last.top) / last.scale } : { ...center };
  }
  function outputs() {
   const text = Math.round(level * 100) + '%';
   for (const n of document.querySelectorAll('.atlasZoom button:last-child')) {
    if (n.textContent !== text) n.textContent = text;
   }
  }
  function render() {
   if (!active) return;
   const w = area.clientWidth, h = area.clientHeight, p = fitPlan(w, h, level, center);
   if (!p) return;
   last = p;lastW = w;lastH = h;
   writeStyle('width', p.stageW + 'px');writeStyle('height', p.stageH + 'px');
   for (const [name, value] of Object.entries({ width: p.w, height: p.h, left: p.left, top: p.top })) {
    writeStyle('--focus-world-' + name, value + 'px');
   }
   area.scrollLeft = p.scrollLeft;area.scrollTop = p.scrollTop;
   center = readCenter();outputs();updateButtons();
  }
  function resize() {
   if (!active || !area.clientWidth || !area.clientHeight ||
       (area.clientWidth === lastW && area.clientHeight === lastH)) return;
   center = readCenter();
   // Keyboard/VisualViewport resize must not refit a chapter or reveal an answer.
   // Preserve world scale and pan center for manual/chapter cameras when possible.
   if (last && cameraMode !== 'overview') {
    level = clamp(last.scale / Math.min(area.clientWidth / WORLD.width,
     area.clientHeight / WORLD.height), 1, MAX_ZOOM);
   }
   render();
  }
  function overview() {
   if (!active) return;
   level = 1;cameraMode = 'overview';center = { x: 445, y: 617.5 };render();
  }
  function zoom(value) {
   if (!active || !Number.isFinite(Number(value))) return;
   center = readCenter();level = clamp(Number(value), 1, MAX_ZOOM);
   cameraMode = level === 1 ? 'overview' : 'manual';
   if (level === 1) center = { x: 445, y: 617.5 };
   render();
  }
  function context() {
   // Use group/chapter membership, NEVER state.current or a queue's answer ID.
   if (typeof state === 'undefined' || typeof ITEMS === 'undefined') return { key: null, ids: null };
   if (state.mode === 'route') {
    const route = state.route?.active, id = route?.chapterId;
    const chapter = typeof ROUTE_CHAPTERS === 'undefined' ? null : ROUTE_CHAPTERS.find(c => c.id === id);
    return { key: state.questionMode === 'discover' && route && !route.done ? 'route:' + id : null,
     ids: id === 'smart' ? null : chapter?.itemIds || null };
   }
   const group = document.getElementById('groupSelect')?.value;
   // Mixed/smart/all groups get the safe full-map context.
   const ids = !group || ['all', 'mistakes', 'smart'].includes(group) ? null :
    (typeof groupItems === 'function' ? groupItems().map(i => i.id) : null);
   return { key: state.mode === 'learn' ? 'learn:' + group : null, ids };
  }
  function bounds(ids) {
   if (!ids?.length || typeof elements === 'undefined' || typeof ITEMS === 'undefined') return null;
   const boxes = [];
   for (const id of ids) {
    const item = ITEMS.find(i => i.id === id), node = elements[id];
    if (!item || !node || !map.contains(node)) return null;
    try {
     const b = node.getBBox();
     if (![b.x, b.y, b.width, b.height].every(Number.isFinite)) return null;
     // Source positions supplement tiny point/microstate geometry, not a new hit area.
     boxes.push(b);
     if (Number.isFinite(item.px) && Number.isFinite(item.py)) {
      boxes.push({ x: item.px, y: item.py, width: 0, height: 0 });
     }
    } catch (_) { return null; }
   }
   const x = Math.min(...boxes.map(b => b.x)), y = Math.min(...boxes.map(b => b.y));
   const right = Math.max(...boxes.map(b => b.x + b.width)), bottom = Math.max(...boxes.map(b => b.y + b.height));
   const pad = Math.max(35, Math.max(right - x, bottom - y) * .12);
   const left = Math.max(0, x - pad), top = Math.max(0, y - pad);
   return { x: left, y: top, width: Math.min(890, right + pad) - left,
    height: Math.min(1235, bottom + pad) - top };
  }
  function chapter() {
   if (!active) return;
   const b = bounds(context().ids), w = area.clientWidth, h = area.clientHeight;
   if (!b || b.width <= 0 || b.height <= 0 || !w || !h) { updateButtons();return; }
   const fit = Math.min(w / WORLD.width, h / WORLD.height);
   level = clamp(Math.min(w / b.width, h / b.height) / fit, 1, MAX_ZOOM);
   center = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
   cameraMode = 'chapter';render();
  }
  function enter() {
   saved = {
    zoom: Object.getOwnPropertyDescriptor(atlas, 'zoom'),
    scale: Object.getOwnPropertyDescriptor(atlas, 'scale'),
    oldScale: atlas.scale,
    styles: properties.map(name => [name, canvas.style.getPropertyValue(name), canvas.style.getPropertyPriority(name)]),
    buttons: [...document.querySelectorAll('.atlasZoom button')].map(node => [node, node.onclick])
   };
   active = true;last = null;lastW = lastH = 0;
   Object.defineProperty(atlas, 'zoom', { configurable: true, enumerable: true, writable: true, value: zoom });
   Object.defineProperty(atlas, 'scale', { configurable: true, enumerable: true, get: () => level });
   for (const [node] of saved.buttons) {
    const buttons = [...node.parentElement.querySelectorAll('button')], index = buttons.indexOf(node);
    node.onclick = () => index === buttons.length - 1 ? overview() : zoom(level + (index === 0 ? -.5 : .5));
   }
   overview();
   explorationKey = context().key;
   if (explorationKey) chapter();
  }
  function exit() {
   active = false;explorationKey = null;
   Object.defineProperty(atlas, 'zoom', saved.zoom);Object.defineProperty(atlas, 'scale', saved.scale);
   for (const [node, onclick] of saved.buttons) node.onclick = onclick;
   for (const [name, value, priority] of saved.styles) {
    if (value) canvas.style.setProperty(name, value, priority);else canvas.style.removeProperty(name);
   }
   // Return control to the original private V1 zoom closure, including its outputs.
   atlas.zoom(saved.oldScale || 1);last = null;saved = null;
  }
  area.addEventListener('keydown', e => {
   if (!active || e.target !== area || !['+', '=', '-', 'Home'].includes(e.key)) return;
   // Capture prevents the original anonymous V1 bubble handler from zooming twice.
   e.preventDefault();e.stopImmediatePropagation();
   e.key === 'Home' ? overview() : zoom(level + (e.key === '-' ? -.5 : .5));
  }, true);
  // Arrow keys and native touch/trackpad scroll remain owned by the original area.
  function queueResize() {
   if (!active || pending) return;
   pending = root.requestAnimationFrame(() => { pending = 0;resize(); });
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(queueResize).observe(area);
  root.addEventListener('resize', queueResize);
  return {
   update(wanted) {
    const next = !!wanted && document.body.dataset.focusMode === 'true';
    if (next && !active) { enter();return; }
    if (!next && active) { exit();return; }
    if (!active) return;
    resize();updateButtons();
    const key = context().key;
    // Entry/chapter only. Grading, Next, typing, theme and repeated observer calls
    // never move the camera. Re-entering exploration permits one fresh context fit.
    if (key && key !== explorationKey) chapter();
    explorationKey = key;
   },
   overview, chapter, zoom,
   snapshot: () => ({ active, zoom: level, mode: cameraMode, center: readCenter(),
    worldScale: last?.scale || 0, viewport: [lastW, lastH] })
  };
 }
 root.TopoFocusCamera = {
  update(active) { if (!controller) controller = setup();controller?.update(active); },
  overview() { controller?.overview(); },
  chapter() { controller?.chapter(); },
  zoom(value) { controller?.zoom(value); },
  snapshot() { return controller?.snapshot() || { active: false }; },
  fitPlan
 };
})(typeof window !== 'undefined' ? window : globalThis);
