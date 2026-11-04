/* Bounded backup-only patch; progress schemas and learning engines remain exact. */
export const profileBackupPairs = [
 ["savedAt:new Date().toISOString(),progress:progressSnapshot()", "savedAt:new Date().toISOString(),progress:progressSnapshot(),profile:window.TopoProfile.exportProfile()"],
 ["const raw=data.progress;", "const raw=data.progress;if(!window.TopoProfile.validate(data.profile===undefined?null:data.profile))throw Error();"],
 ["localStorage.setItem('topo-italie-v3',JSON.stringify(restored));clearRewardCelebrations();Object.assign(state,restored);", "window.TopoProfile.commitImport(JSON.stringify(restored),data.profile===undefined?null:data.profile);clearRewardCelebrations();Object.assign(state,restored);"]
];
export function applyProfileBackupHooks(source,{inverse=false}={}){
 for(const pair of profileBackupPairs){const [from,to]=inverse?[...pair].reverse():pair;const count=source.split(from).length-1;if(count!==1)throw Error(`Expected exactly one profile backup hook, found ${count}: ${from}`);source=source.replace(from,to);}
 return source;
}
