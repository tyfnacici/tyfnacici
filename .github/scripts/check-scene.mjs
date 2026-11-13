// Static guard for static/js/scene3d.js (no dependencies).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = readFileSync(join(root, 'static/js/scene3d.js'), 'utf8');
const bundle = readFileSync(join(root, 'static/js/vendor/three.module.min.js'), 'utf8');
const errs = [];

const exp = /export\s*\{([^}]*)\}\s*;?\s*$/.exec(bundle.trim()) || /export\s*\{([^}]*)\}/.exec(bundle);
const exported = new Set(exp ? exp[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()) : []);
if (!exported.size) errs.push('cannot read export list of three bundle');
for (const n of new Set([...src.matchAll(/\bT\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]))) {
  if (!exported.has(n)) errs.push(`T.${n} is not exported by the vendored three bundle`);
}

const parts = /const PARTS = mobile \? (\d+) : (\d+);/.exec(src);
if (!parts) errs.push('PARTS line not found');
else if (Math.max(+parts[1], +parts[2]) > 400) errs.push(`particle count ${Math.max(+parts[1], +parts[2])} > 400`);

const dpr = /Math\.min\(devicePixelRatio \|\| 1, mobile \? ([\d.]+) : ([\d.]+)\)/.exec(src);
if (!dpr) errs.push('DPR cap not found');
else if (Math.max(+dpr[1], +dpr[2]) > 1.5) errs.push(`DPR cap ${Math.max(+dpr[1], +dpr[2])} > 1.5`);

if (/(import\s*\(|from\s+|import\s+)['"]https?:\/\//.test(src) || /https?:\/\//.test(src)) errs.push('http(s) URL found in scene3d.js');

if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log('scene OK');
