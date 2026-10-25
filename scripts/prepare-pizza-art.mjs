// One-time, reproducible derivation; no image generation. Build embeds checked outputs.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),base='assets/nino/rewards/pizza/';
const read=p=>readFileSync(new URL(base+p,root));
const hash=b=>createHash('sha256').update(b).digest('hex');
const source=JSON.parse(read('manifest.json'));
for(const [p,m] of Object.entries(source.files)){const b=read(p);if(b.length!==m.bytes||hash(b)!==m.sha256)throw Error('Source mismatch: '+p)}
const runtime={schema:1,sourceCommit:'15ce46fb556d4e05734d72787b054125f5869cba',frameSize:320,assets:{},assembly:{}};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
try{
 const page=await browser.newPage();
 for(const flavor of source.flavor_order){
  const meta=JSON.parse(read(`slices/${flavor}/manifest.json`));
  const png=b=>'data:image/png;base64,'+b.toString('base64');
  const result=await page.evaluate(async({master,slices,width,height})=>{
   const load=async src=>{const i=new Image();i.src=src;await i.decode();return i};
   const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
   const original=canvas(width,height),o=original.getContext('2d',{willReadFrequently:true});o.drawImage(await load(master),0,0);const expected=o.getImageData(0,0,width,height).data;
   const composed=o.createImageData(width,height),used=new Uint8Array(width*height),atlas=canvas(960,960),a=atlas.getContext('2d');
   let overlap=0;
   for(let n=0;n<8;n++){
    o.clearRect(0,0,width,height);o.drawImage(await load(slices[n]),0,0);const data=o.getImageData(0,0,width,height).data;
    for(let p=0;p<data.length;p+=4){if(!data[p+3])continue;if(used[p/4]++)overlap++;composed.data.set(data.subarray(p,p+4),p)}
    o.putImageData(composed,0,0);const scale=320/Math.max(width,height),w=width*scale,h=height*scale;a.drawImage(original,(n+1)%3*320+(320-w)/2,Math.floor((n+1)/3)*320+(320-h)/2,w,h);
   }
   let maxDifference=0;for(let p=0;p<expected.length;p++)maxDifference=Math.max(maxDifference,Math.abs(expected[p]-composed.data[p]));
   if(maxDifference||overlap)throw Error(`Source reconstruction failed: difference=${maxDifference}, overlap=${overlap}`);
   return {url:atlas.toDataURL('image/webp',.92),maxDifference,overlap};
  },{master:png(read(`masters/pizza-${flavor}.png`)),slices:Array.from({length:8},(_,i)=>png(read(`slices/${flavor}/aligned_full_canvas/pizza-${flavor}-slice-0${i+1}-aligned.png`))),width:meta.original_dimensions[0],height:meta.original_dimensions[1]});
  const bytes=Buffer.from(result.url.split(',')[1],'base64'),path=`runtime/pizza-${flavor}-states.webp`;
  mkdirSync(new URL(base+'runtime/',root),{recursive:true});writeFileSync(new URL(base+path,root),bytes);
  runtime.assets[flavor]={path,bytes:bytes.length,sha256:hash(bytes)};runtime.assembly[flavor]={sourceDimensions:meta.original_dimensions,sourceMaxChannelDifference:result.maxDifference,overlappingPixels:result.overlap,method:'Compose unique aligned source slices at native resolution before one resize; transparent 3x3 atlas, row-major states 0–8.'};
 }
 for(const [key,path] of Object.entries({board:'exports/pizza-board-wood.webp',closed:'exports/pizza-box-closed-pisa.webp',...Object.fromEntries(source.flavor_order.map(f=>['box-'+f,`exports/pizza-box-open-pisa-${f}.webp`]))})){
  const bytes=read(path);runtime.assets[key]={path,bytes:bytes.length,sha256:hash(bytes)};
 }
 writeFileSync(new URL(base+'runtime-manifest.json',root),JSON.stringify(runtime,null,2)+'\n');
 console.log(JSON.stringify(runtime.assembly));console.log('Runtime total bytes:',Object.values(runtime.assets).reduce((s,a)=>s+a.bytes,0));
}finally{await browser.close()}
