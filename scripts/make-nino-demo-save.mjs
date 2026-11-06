/* Builds the labelled demo backup: chapter 1, last writing answer open, seven of eight points, two pizzas. */
import {writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url),out=new URL('output/demo/NINO-2-DEMO-vlak-voor-derde-pizza.json',root);
const api=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),browser=await api.chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage();await page.goto(new URL('output/html/TOPO-NINO-Computer-Release.html',root).href);
await page.locator('.ninoProfile [data-profile-cancel]').click();
const data=await page.evaluate(()=>{
 state.route.chapters.city1.stage=2;startRouteLesson('city1','write');
 const s=state.route.active;while(s.index<s.queue.length-1){routeGrade(true);TopoRoute.advance(state.route,ROUTE_CHAPTERS)}
 renderRouteTask();state.good=23;state.pizzas=2;state.slices=7;state.trips=0;state.streak=0;persist();
 return {app:'topo-italie',version:1,savedAt:new Date().toISOString(),note:'DEMO-SAVE, niet echt gespeeld: 2 pizza’s, 7/8 punten, halte 1 tot en met het laatste schrijfantwoord.',progress:JSON.parse(JSON.stringify(progressSnapshot())),profile:{schema:1,name:'DEMO-save',coverColor:'lemon',favoritePizza:'salami'}};
});
await browser.close();writeFileSync(out,JSON.stringify(data,null,2)+'\n');console.log('Demo save',data.progress.route.active.chapterId,data.progress.route.active.index,'/',data.progress.route.active.queue.length);
