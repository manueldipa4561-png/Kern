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

const entry = ['fields', 'icons', 'i18n', 'fieldinfo', 'coop', 'coopask'].map((f) => `export * from './src/scripts/${f}.ts';`).join('\n');
const { text } = buildSync({ stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false }).outputFiles[0];
const { FIELDS, ICONS, FIELD_PICS, picFile, IT, FIELD_INFO, COOP_KEYS, ASK } = await import(`data:text/javascript;base64,${Buffer.from(text).toString('base64')}`);

for (const f of Object.keys(FIELDS)) assert.ok(FIELD_PICS.includes(f) && existsSync(`public/img/f/${f.toLowerCase()}.webp`), `icons.ts: field ${f} has no picture in public/img/f`);
for (const n of FIELD_PICS) assert.ok(existsSync(`public/img/f/${picFile(n)}.webp`), `icons.ts: ${n} has no picture in public/img/f`);
assert.ok(['missions', 'yourkern', 'copilot'].every((n) => FIELD_PICS.includes(n)), 'icons.ts: the three tabs are pictures');
for (const n of ['done']) assert.ok(ICONS[n], `icons.ts: no icon named ${n}`);
for (const [name, body] of Object.entries(ICONS)) {
  assert.equal((body.match(/</g) || []).length, (body.match(/>/g) || []).length, `icons.ts: ${name} has unbalanced tags`);
  assert.ok(name.endsWith('-on') || /class="(b[ps]?|gb|pd)"/.test(body), `icons.ts: ${name} has no lime (a bead or a lime body)`); // -on: the filled tab-bar versions, one solid shape
}
for (const k of ['Text size', 'Small', 'Default', 'Large', 'Larger', 'Done.', 'What to expect', 'A day in it', 'People like', 'People find hard', 'Try the next mission', 'Take it further', 'Three steps outside the app', 'Ask', 'Make', 'Learn', 'Send feedback', 'Terms']) assert.ok(IT[k], `i18n.ts: no Italian for "${k}"`);

// What to expect + Take it further: every field has all of it, in both languages, and none of the words the brand never uses.
const BANNED = /lavor|career|freelance|real work|real job|choose a job/i;
for (const f of Object.keys(FIELDS)) {
  const info = FIELD_INFO[f];
  assert.ok(info, `fieldinfo.ts: field ${f} has no info`);
  assert.ok(info.like.length === 2 && info.hard.length === 2, `fieldinfo.ts: ${f} needs 2 things people like and 2 they find hard`);
  const all = [info.day, ...info.like, ...info.hard, info.steps.ask, info.steps.make, info.steps.learn];
  for (const en of all) {
    assert.ok(IT[en] && IT[en] !== en, `fieldinfo.ts: ${f} has no Italian for "${en.slice(0, 50)}"`);
    assert.ok(!BANNED.test(en) && !BANNED.test(IT[en]), `fieldinfo.ts: ${f} uses a banned word in "${en.slice(0, 50)}"`);
  }
}


const page = readFileSync('src/pages/index.astro', 'utf8');
assert.equal((page.match(/data-k-text="\d"/g) || []).length, 4, 'index.astro: Settings needs four text size steps');
assert.equal((page.match(/data-k-theme="/g) || []).length, 2, 'index.astro: the theme has two choices, dark and light');
assert.equal((page.match(/data-k-tab="/g) || []).length, 3, 'index.astro: three sections');
// Co-op: the friend's task exists for exactly the 12 co-op missions, in both languages, and the strings around it are translated.
assert.deepEqual(Object.keys(ASK).sort(), [...COOP_KEYS].sort(), 'coopask.ts: one line for each co-op mission');
for (const [k, en] of Object.entries(ASK)) { assert.ok(IT[en] && IT[en] !== en, `coopask.ts: no Italian for ${k}`); assert.ok(!BANNED.test(en) && !BANNED.test(IT[en]), `coopask.ts: banned word in ${k}`); }
for (const k of ['Co-op mission: answer it, then send it to a friend to finish together.', 'Finish it with a friend', 'The link carries your answer, so it is only as private as the chat you send it to.', 'Your part', 'Your reply', 'Send back', 'Do the mission yourself', 'Co-op with a friend', '{n} wants your take on “{m}”: {ask} Open the link, it takes a minute.', '{n} answered “{m}”. Open the link to read it.', 'Link copied. Send it to your friend.', 'Link copied. Send it back to your friend.', 'Send to a friend', 'Send again', 'Not sent yet', 'Sent. Waiting for a reply.', 'You', 'Tips from people before you', 'Leave a tip for the next person (optional)', 'Tips you left']) assert.ok(IT[k], `i18n.ts: no Italian for "${k}"`);
for (const id of ['kCoop', 'kCoops', 'kDrCoop', 'kCoopHint', 'kCoSend']) assert.ok(page.includes(`id="${id}"`), `index.astro: missing #${id}`);
for (const id of ['kFld', 'kAbout', 'kFurther', 'kFeed']) assert.ok(page.includes(`id="${id}"`), `index.astro: missing #${id}`);
assert.ok(existsSync('src/pages/terms.astro'), 'terms.astro: the Terms page is missing');
// Mission pictures: every img / imgIt path in missions.ts must be a file in public/.
// A mission opens full screen with a bar of three segments (read, answer, reflect) that app.ts keeps up to date and CSS fills.
assert.equal((page.match(/<div class="k-prog" id="kProg"[^>]*role="progressbar"[^>]*>((?:<i><b><\/b><\/i>){3})<\/div>/g) || []).length, 1, 'index.astro: the mission needs one progress bar with three segments');
assert.ok(/id="kShClose"/.test(page) && /function renderProg\(\)/.test(readFileSync('src/scripts/app.ts', 'utf8')), 'the full-screen mission needs its close button and renderProg()');
const pics = [...readFileSync('src/scripts/missions.ts', 'utf8').matchAll(/\bimg(?:It)?: '(\/img\/m\/[^']+)'/g)].map((m) => m[1]);
assert.ok(pics.length >= 9, `missions.ts: expected the mission pictures, found ${pics.length}`);
for (const p of pics) assert.ok(existsSync(`public${p}`), `missions.ts: picture ${p} is not in public/`);
console.log('design: ok (rem text, icons for every field, 4 text sizes, 2 themes, 3 sections)');
