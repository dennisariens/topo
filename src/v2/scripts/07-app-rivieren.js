
// Separate 44-screen-pixel river targets preserve the source centre line.
for(const i of ITEMS.filter(i=>i.kind==='river')){
 const hit=el('path',{d:i.shape,fill:'none',stroke:'transparent','stroke-width':44,'vector-effect':'non-scaling-stroke','pointer-events':'stroke','data-hit-id':i.id,'aria-label':i.name,tabindex:0,role:'button'},$('#riverLayer'));attach(hit,i);
}
$('#routeDockFeedback').setAttribute('aria-live','polite');

