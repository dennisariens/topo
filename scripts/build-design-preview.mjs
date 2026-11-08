// Separate owner design preview: the candidate app plus an in-memory state switcher and a ride preview button.
// The regular app files never contain this code.
import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html');if(html.includes('NINO_DESIGN_PREVIEW'))throw Error('index.html must not contain the design preview');
const css='.ninoPreviewBar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 12px;padding:10px 12px;background:#fff3d7;color:#193e36;font:600 14px/1.3 system-ui,sans-serif;border-bottom:2px dashed #c49a4a}.ninoPreviewBar a,.ninoPreviewBar button{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:1px solid #789387;border-radius:9px;background:#fff;color:#163d35;font:inherit;text-decoration:none;cursor:pointer}.ninoPreviewBar a[aria-current]{background:#163d35;color:#fff}.ninoPreviewBar button{background:#c4332a;border-color:#c4332a;color:#fff}@media print{.ninoPreviewBar{display:none}}/* Phone and iPad: the app header is fixed, so the preview bar floats at the bottom of the home screen and steps aside during lessons. */body[data-focus-shell="true"] .ninoPreviewBar{position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:60;padding:8px;border:2px dashed #c49a4a;border-radius:14px;box-shadow:0 8px 24px #3b271633}body[data-focus-shell="true"] .ninoPreviewBar strong{flex-basis:100%;text-align:center;font-size:13px}body[data-focus-mode="true"] .ninoPreviewBar{display:none}';
const inject='<head>\n<script>\n'+read('scripts/design-preview.js')+'</script>\n<style>'+css+'</style>';
if(html.indexOf('<head>')<0)throw Error('No <head>');
const out=html.replace('<head>',()=>inject).replace(/<title>([^<]*)<\/title>/,(m,t)=>'<title>Ontwerppreview · '+t+'</title>');
writeFileSync(new URL('output/html/NINO-2-Ontwerppreview-2026-11-07-r2.html',root),out);
console.log('Design preview: output/html/NINO-2-Ontwerppreview-2026-11-07-r2.html');
