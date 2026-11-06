import {spawn,execFileSync} from 'node:child_process';import {openSync,closeSync,writeFileSync,readFileSync,renameSync,unlinkSync,existsSync} from 'node:fs';
const ps=args=>{try{return execFileSync('ps',args,{encoding:'utf8',env:{PATH:'/usr/bin:/bin',LC_ALL:'C'},stdio:['ignore','pipe','ignore']}).trim();}catch{return '';}};
const startTime=pid=>ps(['-o','lstart=','-p',String(pid)]);
export function processAlive({pid}){const state=ps(['-o','stat=','-p',String(pid)]);return Boolean(state)&&!state.startsWith('Z');}
function tree(root){const rows=ps(['-A','-o','pid=,ppid=']).split('\n').map(l=>l.trim().split(/\s+/).map(Number)),found=[root];for(const pid of found)for(const [child,parent] of rows)if(parent===pid&&!found.includes(child))found.push(child);return found;}
const signal=(pid,name)=>{try{process.kill(pid,name);}catch{}};
// Stop before snapshotting again so a forking descendant cannot escape the recorded tree.
function stopTree(root){const seen=new Set();for(let round=0;round<3;round++)for(const pid of tree(root))if(!seen.has(pid)){seen.add(pid);signal(pid,'SIGSTOP');}for(const pid of seen)signal(pid,'SIGKILL');return [...seen];}
export async function terminateAction(file){if(!existsSync(file))return {terminated:false,pids:[]};const action=JSON.parse(readFileSync(file));unlinkSync(file);if(!processAlive(action)||startTime(action.pid)!==action.startedAt)return {terminated:false,pids:[]};const pids=stopTree(action.pid);for(let i=0;i<200&&pids.some(pid=>processAlive({pid}));i++)await new Promise(r=>setTimeout(r,25));if(pids.some(pid=>processAlive({pid})))throw Error('Action tree survived termination');return {terminated:true,pids};}
// V1 runProcess never exposes its child, so V2 persists exact action identity for a replacement controller.
export function runTracked(command,args,{cwd,env,log,timeoutMs,actionFile,meta={}}){return new Promise(done=>{const fd=openSync(log,'a'),start=Date.now(),child=spawn(command,args,{cwd,env,shell:false,detached:true,stdio:['ignore',fd,fd]});closeSync(fd);let timedOut=false,spawnError=null;
 child.once('spawn',()=>{writeFileSync(actionFile+'.tmp',JSON.stringify({...meta,pid:child.pid,startedAt:startTime(child.pid)}));renameSync(actionFile+'.tmp',actionFile);});
 const timer=setTimeout(()=>{timedOut=true;terminateAction(actionFile).catch(()=>{});},timeoutMs);child.on('error',e=>{spawnError=e;});
 child.on('close',(code,sig)=>{clearTimeout(timer);if(existsSync(actionFile))unlinkSync(actionFile);done({exitCode:code??1,signal:sig,timedOut,durationMs:Date.now()-start,error:spawnError?.message});});});}
