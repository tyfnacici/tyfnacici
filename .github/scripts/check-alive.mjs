// Static guard for the lively-card layer (no dependencies).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const js = readFileSync(join(root, 'assets/js/motion.js'), 'utf8');
const css = readFileSync(join(root, 'assets/css/extended/liquid.css'), 'utf8');
const errs = [];
for (const k of ['prefers-reduced-motion', 'saveData', 'cards-alive--full', 'cards-alive--lite', '__cardsAlive']) {
  if (!js.includes(k)) errs.push(`motion.js missing ${k}`);
}
const t = /const TILT = (\d+(?:\.\d+)?)|TILT = (\d+(?:\.\d+)?)/.exec(js);
if (!t || Number(t[1] ?? t[2]) > 8) errs.push('TILT missing or > 8');
if (!/\.site-nav::before\s*\{[^}]*backdrop-filter/.test(css)) errs.push('.site-nav::before backdrop-filter missing');
if (!css.includes('@keyframes card-float')) errs.push('@keyframes card-float missing');
const rm = [...css.matchAll(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/g)].map((m) => m[1]).join('\n');
if (!/card-float|\.cards-alive/.test(rm)) errs.push('reduced-motion block does not cover card-float / .cards-alive');
if (errs.length) { console.error(errs.join('\n')); console.log('alive FAILED'); process.exit(1); }
console.log('alive OK');
