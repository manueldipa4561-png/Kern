// Checks that every mission is complete and translated: same count in all four data files, rounds of 3,
// 3 steps / 3 quality bars / 3 hints each, and an Italian text for every string. Run: npm test
import assert from 'node:assert/strict';
import { buildSync } from 'esbuild';

// The data files import each other without extensions, so bundle them in memory instead of importing directly.
const entry = ['fields', 'missions', 'helps', 'easy', 'i18n', 'next', 'sponsors'].map((f) => `export * from './src/scripts/${f}.ts';`).join('\n');
const { text } = buildSync({ stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false }).outputFiles[0];
const { FIELDS, MX, HELPS, EASY, IT, CLASHES, PER_ROUND, SPONSORS } = await import(`data:text/javascript;base64,${Buffer.from(text).toString('base64')}`);

const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
// supabase/schema.sql limits kern_signs.mission to 0..MAX_MISSIONS-1: widen it there before adding a round.
const MAX_MISSIONS = 6;

// A brand deal points at a real mission and has a name and a #rrggbb colour.
for (const [key, s] of Object.entries(SPONSORS)) {
  const [f, i] = key.split('.');
  assert.ok(FIELDS[f] && /^\d$/.test(i) && Number(i) < FIELDS[f].m.length, `sponsors.ts: "${key}" is not a mission`);
  assert.ok(s.name?.trim() && /^#[0-9a-f]{6}$/i.test(s.color), `sponsors.ts: "${key}" needs a name and a #rrggbb colour`);
  const brand = s.name.replace(/\s*\(demo\)$/, '');
  assert.ok(MX[f][i].who.includes(brand), `sponsors.ts: "${key}" names ${brand}, but that mission is about "${MX[f][i].who}"`);
}
assert.deepEqual(CLASHES, [], 'the same English text has two different Italian versions, one overwrites the other');

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
    for (const s of strings([m, x, h, e])) {
      assert.ok(IT[s], `${at}: no Italian for "${s.slice(0, 60)}"`);
      assert.ok(s.length < 25 || IT[s] !== s, `${at}: Italian is the same as English for "${s.slice(0, 60)}"`);
    }
  }
}
console.log(`content: ok (${Object.values(FIELDS).reduce((n, f) => n + f.m.length, 0)} missions)`);
