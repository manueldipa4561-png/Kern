// Guards the v2 design: every font size scales with the text size setting (rem, never px), every field has an icon, the text size
// labels are translated, and the theme has two choices. Run: npm test
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';

const css = readFileSync('src/styles/app.css', 'utf8');
// Settings draws the four "A" buttons in px on purpose (the row must not grow with the setting), and an input never goes under 16px (iOS zoom).
const PX_OK = [/\.k-txt button:nth-child\(\d\) \{ font-size: \d+px; \}/g, /font-size: max\(16px, [\d.]+rem\);/g];
let rest = css;
for (const re of PX_OK) rest = rest.replace(re, '');
const px = [...rest.matchAll(/font-size:\s*[\d.]+px|font:[^;{}]*?\d+(?:\.\d+)?px/g)].map((m) => m[0]);
assert.deepEqual(px, [], `app.css: font sizes must be rem so the text size setting scales them, found ${px.slice(0, 3).join(' | ')}`);
assert.match(css, /html \{ font-size: calc\(16px \* var\(--kts, 1\)\)/, 'app.css: the root font size must follow --kts');

const entry = ['fields', 'icons', 'i18n'].map((f) => `export * from './src/scripts/${f}.ts';`).join('\n');
const { text } = buildSync({ stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false }).outputFiles[0];
const { FIELDS, ICONS, IT } = await import(`data:text/javascript;base64,${Buffer.from(text).toString('base64')}`);

for (const f of Object.keys(FIELDS)) assert.ok(ICONS[f], `icons.ts: field ${f} has no icon`);
for (const n of ['missions', 'yourkern', 'copilot', 'done']) assert.ok(ICONS[n], `icons.ts: no icon named ${n}`);
for (const [name, body] of Object.entries(ICONS)) {
  assert.equal((body.match(/</g) || []).length, (body.match(/>/g) || []).length, `icons.ts: ${name} has unbalanced tags`);
  assert.ok(/class="b[ps]?"|class="gb"/.test(body), `icons.ts: ${name} has no lime bead`);
}
for (const k of ['Text size', 'Small', 'Default', 'Large', 'Larger', 'Done.']) assert.ok(IT[k], `i18n.ts: no Italian for "${k}"`);

const page = readFileSync('src/pages/index.astro', 'utf8');
assert.equal((page.match(/data-k-text="\d"/g) || []).length, 4, 'index.astro: Settings needs four text size steps');
assert.equal((page.match(/data-k-theme="/g) || []).length, 2, 'index.astro: the theme has two choices, dark and light');
assert.equal((page.match(/data-k-tab="/g) || []).length, 3, 'index.astro: three sections');
// Mission pictures: every img / imgIt path in missions.ts must be a file in public/.
const pics = [...readFileSync('src/scripts/missions.ts', 'utf8').matchAll(/\bimg(?:It)?: '(\/img\/m\/[^']+)'/g)].map((m) => m[1]);
assert.ok(pics.length >= 9, `missions.ts: expected the mission pictures, found ${pics.length}`);
for (const p of pics) assert.ok(existsSync(`public${p}`), `missions.ts: picture ${p} is not in public/`);
console.log('design: ok (rem text, icons for every field, 4 text sizes, 2 themes, 3 sections)');
