// npm run eval:coach:all: asks for the key once, runs the baseline (Haiku 4.5) and v1 (Haiku 5.5), then builds report.html.
// The key goes to the two runs through their environment only; it is never printed or written anywhere.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getKey } from './key.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
let key;
try { key = await getKey(); } catch (e) { console.error(e.message); process.exit(2); }
const env = { ...process.env, ANTHROPIC_API_KEY: key };
const step = (...args) => { if (spawnSync(process.execPath, args, { env, stdio: 'inherit' }).status !== 0) process.exit(1); };
for (const [variant, model] of [['baseline', 'claude-haiku-4-5-20251001'], ['v1', 'claude-haiku-5-5']]) {
  console.log(`\n== ${variant} (${model}) ==`);
  step('--experimental-strip-types', path.join(here, 'run.mjs'), '--variant', variant, '--model', model);
}
step(path.join(here, 'build-report-lite.mjs'), here);
console.log('\nDone. Open evals/coach/report.html. Then delete the key in the Console (Settings, API keys).');
