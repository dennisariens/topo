import { cpSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [resolve(root, 'scripts/check-syntax.mjs')], { stdio: 'inherit' });
execFileSync(process.execPath, [resolve(root, 'scripts/validate-map.mjs')], { stdio: 'inherit' });
mkdirSync(resolve(root, 'dist'), { recursive: true });
cpSync(resolve(root, 'index.html'), resolve(root, 'dist/index.html'));
mkdirSync(resolve(root, 'dist/scripts'), { recursive: true });
cpSync(resolve(root, 'scripts/learning-engine.js'), resolve(root, 'dist/scripts/learning-engine.js'));
console.log('Static build: dist/index.html');
