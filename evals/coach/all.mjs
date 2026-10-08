// npm run eval:coach:all [-- v2 v3]: asks for the key once, runs the variants in variants.json that have no results yet (or the ones you name), then builds report.html.
// The key goes to the runs through their environment only; it is never printed or written anywhere.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getKey } from './key.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const variants = JSON.parse(readFileSync(path.join(here, 'variants.json'), 'utf8'));
const named = process.argv.slice(2);
const todo = Object.keys(variants).filter((v) => (named.length ? named.includes(v) : !existsSync(path.join(here, v, 'results.jsonl'))));
if (!todo.length) { console.log('Nothing to run: every variant already has results. Name one to run it again: npm run eval:coach:all -- v2'); process.exit(0); }
let key;
try { key = await getKey(); } catch (e) { console.error(e.message); process.exit(2); }
const env = { ...process.env, ANTHROPIC_API_KEY: key };
const step = (...args) => { if (spawnSync(process.execPath, args, { env, stdio: 'inherit' }).status !== 0) process.exit(1); };
for (const v of todo) {
  const { model, prompt, note } = variants[v];
  console.log(`\n== ${v}: ${note} (${model}, prompt ${prompt}) ==`);
  step('--experimental-strip-types', path.join(here, 'run.mjs'), '--variant', v, '--model', model, '--prompt', prompt);
}
step(path.join(here, 'build-report-lite.mjs'), here);
console.log('\nDone. Open evals/coach/report.html. Then delete the key in the Console (Settings, API keys).');
