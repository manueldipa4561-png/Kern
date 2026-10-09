// Checks the distress screen: the same regex sits in the app (src/scripts/app.ts) and on the server (netlify/functions/coach.mts), and it
// catches what people really type, with or without accents and with straight or curly apostrophes. Run: npm test
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FILES = ['src/scripts/app.ts', 'netlify/functions/coach.mts'];
const literals = FILES.map((f) => {
  const m = readFileSync(f, 'utf8').match(/^const HEAVY = (\/.+\/[a-z]*);$/m);
  assert.ok(m, `${f}: no "const HEAVY = /.../;" line found`);
  return m[1];
});
assert.equal(literals[0], literals[1], `HEAVY differs between ${FILES.join(' and ')}: the app and the server must pause on the same words`);
const cut = literals[0].lastIndexOf('/');
const HEAVY = new RegExp(literals[0].slice(1, cut), literals[0].slice(cut + 1));

// Must pause: the phrases testers sent, in both spellings of "più", and the English ones.
const HEAVY_TEXTS = [
  'Non voglio piu vivere', 'Non voglio più vivere', 'NON VOGLIO PIÙ VIVERE', "non voglio piu' vivere", 'Non voglio piu vivere e non so cosa scrivere',
  'Mi voglio uccidere', 'Penso di togliermi la vita', 'Mi faccio del male da solo', 'Vorrei sparire per sempre', 'Sono senza speranza, sto malissimo',
  'voglio morire', 'Penso al suicidio', 'Ho pensato di farla finita', 'Non ce la faccio piu', 'Non ce la faccio più', "Non ce la faccio piu'",
  "non vedo via d'uscita", 'non vedo via d’uscita', 'non vedo una via d’uscita', 'non riesco piu a vivere', 'non voglio piu stare qui',
  'I want to kill myself', "I don't want to live", 'I don’t want to live', 'I dont want to live', 'I feel hopeless', 'I want to end it all',
];
// Must not pause: ordinary words that sit close to those.
const FINE_TEXTS = [
  'A poster for Friday dinner', 'Voglio vivere di musica', 'I am hopeful about this design', 'Il bar non ha piu tavoli', 'la piu bella idea',
  'voglio un logo piu grande', 'non vedo la via principale nel disegno', 'Non vedo l’ora di iniziare', "I can't wait to start", 'Una idea con speranza e coraggio',
  'non ce la faccio a finire il logo oggi',
];
for (const t of HEAVY_TEXTS) assert.ok(HEAVY.test(t), `HEAVY must pause on "${t}"`);
for (const t of FINE_TEXTS) assert.ok(!HEAVY.test(t), `HEAVY must not pause on "${t}"`);

// The pause itself: the server's PAUSE and the app's HEAVY_REPLY (Italian in i18n.ts) are the same fixed text, with the checked numbers.
const pause = readFileSync(FILES[1], 'utf8').match(/^const PAUSE = \{ en: (".+?"), it: (".+?") \};$/m);
const appReply = readFileSync(FILES[0], 'utf8').match(/^const HEAVY_REPLY = (".+");$/m);
assert.ok(pause && appReply, 'no "const PAUSE = { en: "...", it: "..." };" in coach.mts or no "const HEAVY_REPLY = "...";" in app.ts');
const [en, it] = [JSON.parse(pause[1]), JSON.parse(pause[2])];
assert.equal(JSON.parse(appReply[1]), en, 'the app and the server must show the same English pause');
assert.ok(readFileSync('src/scripts/i18n.ts', 'utf8').includes(`${JSON.stringify(en)}: ${JSON.stringify(it)}`), 'i18n.ts must translate the pause with the server\'s Italian text');
for (const n of ['116 123', '112', '999']) assert.ok(en.includes(n), `English pause lost ${n}`);
for (const n of ['02 2327 2327', '112']) assert.ok(it.includes(n), `Italian pause lost ${n}`);

console.log(`distress screen: ok (${HEAVY_TEXTS.length} phrases pause, ${FINE_TEXTS.length} do not, same pause text with helplines in app and server)`);
