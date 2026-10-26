import{readFileSync,writeFileSync}from'node:fs';import{withoutFocus}from'./focus-source.mjs';
const root=new URL('../',import.meta.url),file=new URL('index.html',root),read=p=>readFileSync(new URL(p,root),'utf8');
let html=withoutFocus(read('index.html'));
const css='/* BEGIN FOCUS MODE */\n'+read('scripts/focus-camera.css')+'\n'+read('scripts/focus-mode.css')+'/* END FOCUS MODE */\n';
const code='// BEGIN FOCUS MODE\n'+read('scripts/focus-camera.js')+'\n'+read('scripts/focus-mode.js')+'// END FOCUS MODE\n';
const endStyle=html.lastIndexOf('</style>');if(endStyle<0)throw Error('Missing style');html=html.slice(0,endStyle)+css+html.slice(endStyle);
const init=html.lastIndexOf("sync();mode('route');");if(init<0)throw Error('Missing initialization');html=html.slice(0,init)+code+html.slice(init);writeFileSync(file,html);console.log('Focus Mode embedded: original input, visual viewport sheet, one unchanged map; fully offline');
