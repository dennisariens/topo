// Presentation is isolated; never exclude geographic, hotfix or learning source from audits.
export function withoutFocus(html){return html.replace(/\/\* BEGIN FOCUS MODE \*\/[\s\S]*?\/\* END FOCUS MODE \*\/\n?/,'').replace(/\/\/ BEGIN FOCUS MODE\n[\s\S]*?\/\/ END FOCUS MODE\n/,'');}
