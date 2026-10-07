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

console.log(`distress screen: ok (${HEAVY_TEXTS.length} phrases pause, ${FINE_TEXTS.length} do not)`);
