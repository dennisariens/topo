import{restoreApprovedArea}from'./ipad-update-source.mjs';
import{withoutFocus}from'./focus-source.mjs';
// Exclude only the isolated additive atlas blocks when checking earlier exact-source contracts.
export function withoutDiscovery(html){html=restoreApprovedArea(withoutFocus(html));return html.replace(/\/\* BEGIN DISCOVERY MAP \*\/[\s\S]*?\/\* END DISCOVERY MAP \*\/\n/,'').replace(/\/\/ BEGIN DISCOVERY MAP\n[\s\S]*?\/\/ END DISCOVERY MAP\n/,'');}
