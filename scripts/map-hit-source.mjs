import{restoreApprovedIpadUI}from'./ipad-update-source.mjs';
import{withoutFocus}from'./focus-source.mjs';
// Audit adapter: restore exactly the replaced legacy resolver, not arbitrary app changes.
export function restoreLegacyMapHit(html,reference){html=restoreApprovedIpadUI(withoutFocus(html));
 const start=reference.indexOf('// Neutral location picker:'),end=reference.indexOf('// Separate 44-screen-pixel river targets',start);
 if(start<0||end<0)throw Error('Pinned baseline map resolver not found');
 const marker=/\/\/ BEGIN MAP HIT\n[\s\S]*?\/\/ END MAP HIT\n\n/;
 if(!marker.test(html))throw Error('Missing bounded map resolver change');
 return html.replace(marker,()=>reference.slice(start,end));
}
