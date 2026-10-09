// Checks that every mission is complete and translated: same count in all four data files, rounds of 3,
// 3 steps / 3 quality bars / 3 hints each, and an Italian text for every string. Run: npm test
import assert from 'node:assert/strict';
import { buildSync } from 'esbuild';
import { PER_ROUND as STATS_PER_ROUND } from './stats-core.mjs';

// The data files import each other without extensions, so bundle them in memory instead of importing directly.
const entry = ['fields', 'missions', 'helps', 'easy', 'i18n', 'next', 'sponsors', 'loot', 'demo', 'play'].map((f) => `export * from './src/scripts/${f}.ts';`).join('\n');
const { text } = buildSync({ stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false }).outputFiles[0];
const { FIELDS, MX, HELPS, EASY, IT, CLASHES, PER_ROUND, SPONSORS, RELICS, SAMPLE_ANSWERS, SAMPLE_IDEA, sampleChat, swapSample } = await import(`data:text/javascript;base64,${Buffer.from(text).toString('base64')}`);

const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
// supabase/schema.sql limits kern_signs.mission and kern_events.mission to 0..MAX_MISSIONS-1: widen both there before adding a round.
const MAX_MISSIONS = 6;

// A brand deal points at a real mission and has a name and a #rrggbb colour.
for (const [key, s] of Object.entries(SPONSORS)) {
  const [f, i] = key.split('.');
  assert.ok(FIELDS[f] && /^\d$/.test(i) && Number(i) < FIELDS[f].m.length, `sponsors.ts: "${key}" is not a mission`);
  assert.ok(s.name?.trim() && /^#[0-9a-f]{6}$/i.test(s.color), `sponsors.ts: "${key}" needs a name and a #rrggbb colour`);
  assert.ok(!/demo/i.test(s.name), `sponsors.ts: "${key}" says demo, which a real user would take for the demo profile: use (sample)`);
  const brand = s.name.replace(/\s*\(sample\)$/, '');
  assert.ok(MX[f][i].who.includes(brand), `sponsors.ts: "${key}" names ${brand}, but that mission is about "${MX[f][i].who}"`);
}
// The demo profile's sample trail (src/scripts/demo.ts): real missions and drops, both languages, inside the field limits, and a language switch swaps it back and forth.
const DROPS = ['spark', 'gem', 'jackpot', ...RELICS.map((r) => r.id)], taken = new Set();
for (const d of SAMPLE_ANSWERS) {
  const at = `demo.ts: ${d.f}.${d.i}`;
  assert.ok(FIELDS[d.f]?.m[d.i], `${at} is not a mission`);
  assert.ok(!taken.has(`${d.f}.${d.i}`), `${at} appears twice`);
  taken.add(`${d.f}.${d.i}`);
  assert.ok(!d.d || DROPS.includes(d.d), `${at}: "${d.d}" is not a drop`);
  for (const [name, pair, max] of [['t', d.t, 2000], ['hard', d.hard, 140], ['tip', d.tip, 140]]) {
    if (!pair) continue;
    assert.ok(pair[0].trim() && pair[1].trim() && pair[0] !== pair[1], `${at}.${name}: needs an English and a different Italian text`);
    assert.ok(pair[0].length <= max && pair[1].length <= max, `${at}.${name}: over ${max} characters`);
    assert.equal(swapSample(pair[0], pair, true), pair[1]);
    assert.equal(swapSample(pair[1], pair, false), pair[0]);
    assert.equal(swapSample('a visitor wrote this', pair, true), 'a visitor wrote this', `${at}.${name}: a text of the visitor's own must stay`);
  }
}
for (const [en, it] of SAMPLE_IDEA) assert.ok(en.trim() && it.trim() && en !== it && en.length <= 140 && it.length <= 140, `demo.ts: an idea version needs two different texts of at most 140 characters ("${en.slice(0, 30)}")`);
for (const m of sampleChat(true)) if (m.who === 'ai') assert.ok(IT[m.t], `demo.ts: no Italian for the coach line "${m.t.slice(0, 50)}"`);
assert.equal(sampleChat(false).length, SAMPLE_IDEA.length * 2, 'demo.ts: every idea version is followed by one coach line');
assert.equal(STATS_PER_ROUND, PER_ROUND, 'scripts/stats-core.mjs counts finished rounds with its own PER_ROUND: update it to match src/scripts/next.ts');
assert.deepEqual(CLASHES, [],'the same English text has two different Italian versions, one overwrites the other');
// One apostrophe style in Italian: a straight one between letters (l'app) stands out next to the typographic one (l’app) used everywhere else.
for (const [en, it] of Object.entries(IT)) assert.ok(!/\p{L}'\p{L}/u.test(it), `i18n: the Italian for "${en.slice(0, 50)}" has a straight apostrophe, write ’`);
// No job-world words anywhere a person reads in the app, English or Italian (they may appear only in the pitch deck).
const BANNED_UI = /lavor|career|freelanc|real work|real job|choose a job|\bjobs?\b|impieg/i;
const banned = Object.entries(IT).filter(([en, it]) => BANNED_UI.test(en) || BANNED_UI.test(it)).map(([en]) => en.slice(0, 50));
assert.deepEqual(banned, [], `i18n: job-world words in the app copy: ${banned.join(' | ')}`);

// The app counts rounds from the current field and searches the other fields with that count, so all fields must match.
const counts = [...new Set(Object.values(FIELDS).map((f) => f.m.length))];
assert.equal(counts.length, 1, `every field needs the same number of missions, found ${counts.join(', ')}`);
assert.ok(counts[0] <= MAX_MISSIONS, `${counts[0]} missions per field, but supabase/schema.sql only accepts signs on missions 0-${MAX_MISSIONS - 1}`);

for (const f of Object.keys(FIELDS)) {
  const n = FIELDS[f].m.length;
  assert.ok(n >= PER_ROUND && n % PER_ROUND === 0, `${f}: missions come in rounds of ${PER_ROUND}, found ${n}`);
  for (const [name, list] of [['MX', MX[f]], ['HELPS', HELPS[f]], ['EASY', EASY[f]]]) assert.equal(list?.length, n, `${f}: ${name} has ${list?.length} entries, fields.ts has ${n}`);
  assert.equal(new Set(FIELDS[f].m.map((m) => m[1])).size, n, `${f}: two missions share a title`);

  for (let i = 0; i < n; i++) {
    const at = `${f} #${i}`, m = FIELDS[f].m[i], x = MX[f][i], h = HELPS[f][i], e = EASY[f][i];
    assert.equal(m.length, 3, `${at}: fields.ts entry needs label, title, blurb`);
    assert.equal(x.steps.length, 3, `${at}: needs 3 steps`);
    assert.equal(x.bar.length, 3, `${at}: needs 3 quality bars`);
    assert.equal(h.hints.length, 3, `${at}: needs 3 hints`);
    assert.equal(e.steps.length, 3, `${at}: easy version needs 3 steps`);
    assert.ok(Number.isInteger(x.mins) && x.mins >= 2 && x.mins <= 5, `${at}: mins ${x.mins} is outside 2-5 (missions are snackable)`);
    assert.equal(typeof x.asset.mono, 'boolean', `${at}: asset.mono must be true or false`);
    for (const [k, v] of Object.entries({ who: x.who, brief: x.brief, twist: x.twist, ex: h.ex, easyBrief: e.brief, easyEx: e.ex })) assert.ok(v.trim(), `${at}: ${k} is empty`);
    for (const s of strings([m, x, h, e]).filter((t) => !t.startsWith('/img/m/'))) { // picture paths are files, not copy (check-design.mjs checks they exist)
      assert.ok(IT[s], `${at}: no Italian for "${s.slice(0, 60)}"`);
      assert.ok(s.length < 25 || IT[s] !== s, `${at}: Italian is the same as English for "${s.slice(0, 60)}"`);
    }
  }
}
console.log(`content: ok (${Object.values(FIELDS).reduce((n, f) => n + f.m.length, 0)} missions)`);
