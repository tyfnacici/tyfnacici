// Contrast gate for the design tokens (no dependencies).
// Reads final token values from :root{} and :root[data-theme="dark"]{} blocks in
// load order custom.css -> liquid.css; alpha is flattened over --tb-bg.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const files = ['custom.css', 'liquid.css'].map((f) => join(root, 'assets/css/extended', f));

const light = {};
const dark = {};
for (const f of files) {
  const css = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /^(:root(?:\[data-theme="dark"\])?)\s*\{([^}]*)\}/gm;
  let m;
  while ((m = re.exec(css))) {
    const target = m[1] === ':root' ? light : dark;
    for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) target[d[1]] = d[2].trim();
  }
}
// Dark blocks win over :root by specificity, whatever the file order.
const themes = { light, dark: { ...light, ...dark } };

function parse(v) {
  v = v.trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(v);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  m = /^rgba?\(([^)]+)\)$/i.exec(v);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  }
  throw new Error(`cannot parse color: ${v}`);
}
const flatten = (c, bg) => [0, 1, 2].map((i) => c[i] * c[3] + bg[i] * (1 - c[3]));
const lum = (c) => {
  const [r, g, b] = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const texts = ['--tb-fg', '--tb-muted', '--tb-muted-2', '--secondary', '--m-on-muted'];
const surfaces = ['--tb-bg', '--tb-surface', '--m-c1', '--m-c2', '--m-c3', '--m-c4', '--lg-glass', '--lg-glass-hi'];
let fail = 0;
const rows = [];
for (const [name, t] of Object.entries(themes)) {
  const bg = parse(t['--tb-bg']).slice(0, 3);
  const get = (k) => {
    if (!t[k]) throw new Error(`${name}: missing token ${k}`);
    return flatten(parse(t[k]), bg);
  };
  for (const s of surfaces) {
    const sc = get(s);
    for (const x of texts) {
      const need = x === '--tb-fg' && s === '--tb-bg' ? 7 : 4.5;
      const fg = flatten(parse(t[x] || (() => { throw new Error(`${name}: missing token ${x}`); })()), sc);
      const r = ratio(fg, sc);
      const ok = r >= need;
      if (!ok) fail++;
      rows.push(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(5)} ${x.padEnd(14)} on ${s.padEnd(13)} ${r.toFixed(2)} (>= ${need})`);
    }
  }
}
console.log(rows.join('\n'));
console.log(fail ? `contrast FAILED (${fail})` : 'contrast OK');
process.exit(fail ? 1 : 0);
