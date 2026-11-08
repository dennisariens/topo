// Builds the NINO Mac DMG and Windows ZIP from the standalone release HTML. Requires macOS (clang, codesign, hdiutil).
// Usage: node scripts/package-installers.mjs 2.0.2 202
// Output: output/installers/NINO-<version>-macOS.dmg, NINO-<version>-Windows.zip, SHA256SUMS.txt (the HTML, DMG and ZIP).
// Signing: ad hoc only. Normal distribution outside this machine still needs a Developer ID signature and notarization.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chmodSync,copyFileSync,existsSync,mkdirSync,mkdtempSync,readFileSync,rmSync,symlinkSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const [version,build]=process.argv.slice(2);
if(!/^\d+\.\d+\.\d+$/.test(version||'')||!/^\d+$/.test(build||''))throw Error('Usage: node scripts/package-installers.mjs <version> <build>');
const root=resolve(import.meta.dirname,'..'),out=join(root,'output/installers'),html=join(root,'output/html/TOPO-NINO-Computer-Release.html');
const run=(cmd,args,opts={})=>execFileSync(cmd,args,{stdio:['ignore','pipe','pipe'],...opts}).toString();
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const htmlSha=sha(html);
if(htmlSha!==sha(join(root,'index.html')))throw Error('Release HTML differs from index.html; run npm run build first');
mkdirSync(out,{recursive:true});
const work=mkdtempSync(join(tmpdir(),'nino-installers-'));
try{
 // macOS: NINO.app with a Mach-O launcher (a script executable makes LaunchServices fail with -10669).
 const app=join(work,'dmg/NINO.app'),contents=join(app,'Contents');
 for(const d of ['MacOS','Resources'])mkdirSync(join(contents,d),{recursive:true});
 run('clang',['-arch','arm64','-arch','x86_64','-mmacosx-version-min=11.0','-O2','-Wall','-Werror','-o',join(contents,'MacOS/NINO'),join(root,'installers/macos/launcher.c')]);
 copyFileSync(join(root,'installers/macos/launch.sh'),join(contents,'Resources/launch.sh'));chmodSync(join(contents,'Resources/launch.sh'),0o755);
 copyFileSync(join(root,'installers/macos/Nino.icns'),join(contents,'Resources/Nino.icns'));
 copyFileSync(html,join(contents,'Resources/NINO.html'));
 const plist={CFBundleDevelopmentRegion:'nl',CFBundleExecutable:'NINO',CFBundleIconFile:'Nino',CFBundleIdentifier:'nl.topo.nino.offline',CFBundleInfoDictionaryVersion:'6.0',CFBundleName:'NINO',CFBundlePackageType:'APPL',CFBundleShortVersionString:version,CFBundleVersion:build,LSMinimumSystemVersion:'11.0',LSUIElement:true};
 writeFileSync(join(contents,'Info.plist'),'<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n'+Object.entries(plist).map(([k,v])=>`\t<key>${k}</key>\n\t`+(v===true?'<true/>':`<string>${v}</string>`)).join('\n')+'\n</dict>\n</plist>\n');
 run('plutil',['-lint',join(contents,'Info.plist')]);
 run('codesign',['--force','--sign','-','--timestamp=none',app]);
 run('codesign',['--verify','--deep','--strict',app]);
 symlinkSync('/Applications',join(work,'dmg/Programma’s'));
 const dmg=join(out,`NINO-${version}-macOS.dmg`);rmSync(dmg,{force:true});
 run('hdiutil',['create','-quiet','-volname',`NINO ${version}`,'-srcfolder',join(work,'dmg'),'-fs','HFS+','-format','UDZO','-imagekey','zlib-level=9',dmg]);
 run('hdiutil',['verify','-quiet',dmg]);

 // Windows: the same HTML, the installer script pinned to this HTML's hash.
 const name=`NINO-${version}-Windows`,folder=join(work,'win',name);mkdirSync(folder,{recursive:true});
 const cmd=readFileSync(join(root,'installers/windows/Installeer NINO.cmd.template'),'utf8').replaceAll('{{HTML_SHA256}}',htmlSha).replaceAll('{{VERSION}}',version);
 if(/\{\{/.test(cmd))throw Error('Unfilled installer template');
 writeFileSync(join(folder,'Installeer NINO.cmd'),cmd);
 for(const f of ['Lees mij.txt','NINO.ico'])copyFileSync(join(root,'installers/windows',f),join(folder,f));
 copyFileSync(html,join(folder,'NINO.html'));
 const zip=join(out,`${name}.zip`);rmSync(zip,{force:true});
 run('zip',['-X','-q','-r',zip,name],{cwd:join(work,'win')});

 const sums=[[html,'TOPO-NINO-Computer-Release.html'],[dmg,`NINO-${version}-macOS.dmg`],[zip,`${name}.zip`]].map(([f,n])=>`${sha(f)}  ${n}`).join('\n')+'\n';
 writeFileSync(join(out,'SHA256SUMS.txt'),sums);process.stdout.write(sums);
}finally{rmSync(work,{recursive:true,force:true});}
