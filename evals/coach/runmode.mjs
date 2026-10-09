// "Try your prompt on the AI" with the real model: four prompts (EN, IT, DE, FR), like the Prompting missions, go through the real coach function in run mode.
// Prints each reply's length and opening, so a person can read them. Needs ANTHROPIC_API_KEY: run it with  npm run eval:coach:all -- run  (asks for the key once).
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { default: handler } = await import(pathToFileURL(path.join(here, '../../netlify/functions/coach.mts')).href);
const PROMPTS = [
  ['en', 'You are a quiz master. Ask me one question at a time about the water cycle, wait for my answer, and tell me if I was right before the next one.'],
  ['it', 'Scrivi un post Instagram per un laboratorio di ceramica: ogni sabato alle 10, 6 posti, 35 € argilla inclusa. Tono caldo e un po’ ironico, massimo 60 parole.'],
  ['de', 'Erstelle eine Tabelle, wer wem wie viel schuldet: Anna hat 60 € für Lebensmittel bezahlt, Ben 20 € für Putzmittel, wir sind vier Leute in der WG.'],
  ['fr', "Aide-moi à choisir entre deux appartements. Ce qui compte pour mon amie : être près de la gare, la lumière, et un loyer sous 700 €. Pose-moi d'abord des questions."],
];
let ok = 0;
for (const [i, [lang, prompt]] of PROMPTS.entries()) {
  const req = new Request('http://eval.local/api/coach', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'run', field: 'Prompting', lang, prompt }) });
  const res = await handler(req, { ip: `10.9.9.${i + 1}` }), out = await res.json();
  if (out.reply) ok++;
  console.log(`${lang} ${res.status} ${out.reply ? `${out.reply.length} chars: ${out.reply.slice(0, 160).replace(/\n/g, ' ')}` : `no reply (${out.error})`}`);
}
console.log(`Try your prompt: ${ok} of ${PROMPTS.length} replies came back.`);
