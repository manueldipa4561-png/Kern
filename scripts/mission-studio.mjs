#!/usr/bin/env node
// Mission Studio: Claude drafts ONE bilingual mission, the draft is treated as untrusted input and checked by rules, and a human reviews it.
//   node scripts/mission-studio.mjs --field Selling --kind zero --subject "Crunchino, a chickpea snack" [--notes "..."]
//        [--model claude-sonnet-5-5] [--out drafts] [--dry-run] [--from-json file.json]
// ANTHROPIC_API_KEY must be set for a live draft. --dry-run prints the prompt (no network); --from-json replays a saved answer.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { GATES, KINDS, ROOT, buildPrompt, escapeOdd, loadLive, parseModelText, toSnippets, validateDraft, writeFiles } from './mission-studio-core.mjs';

const MODEL = process.env.STUDIO_MODEL || 'claude-sonnet-5-5';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_TOKENS = 8000, TIMEOUT_MS = 60_000, RETRY_WAIT_MS = 2000;
const USAGE = 'usage: node scripts/mission-studio.mjs --field <Field> --kind improve|zero|partner --subject "<what it is about>" [--notes "..."] [--model id] [--out dir] [--dry-run] [--from-json file]';

// Every message passes through escapeOdd (line by line): nothing the model or the API sent can carry terminal escape sequences.
const die = (msg, code = 2) => { console.error(`mission-studio: ${String(msg).split('\n').map(escapeOdd).join('\n')}`); process.exit(code); };

// One call to the Messages API, one retry on 429/5xx or a network error. The key only ever goes in the header: never logged.
async function askClaude({ key, model, system, user }) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: MAX_TOKENS, system, messages: [{ role: 'user', content: user }] }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'error', // the key travels in a header: never follow a redirect to another host
      });
    } catch (err) {
      if (attempt === 0) { await new Promise((r) => setTimeout(r, RETRY_WAIT_MS)); continue; }
      throw new Error(`could not reach the Anthropic API (${err.name})`);
    }
    if ((res.status === 429 || res.status >= 500) && attempt === 0) { await new Promise((r) => setTimeout(r, RETRY_WAIT_MS)); continue; }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`the Anthropic API answered ${res.status}${data?.error?.message ? `: ${escapeOdd(String(data.error.message).slice(0, 200))}` : ''}`);
    if (data.stop_reason === 'max_tokens') throw new Error('the answer was cut off (max_tokens): try again');
    const text = (Array.isArray(data.content) ? data.content : []).filter((c) => c?.type === 'text').map((c) => c.text).join('');
    if (!text.trim()) throw new Error('the model answered with no text');
    return text;
  }
}

async function main() {
  let a;
  try {
    a = parseArgs({ options: { field: { type: 'string' }, kind: { type: 'string' }, subject: { type: 'string' }, notes: { type: 'string' }, model: { type: 'string', default: MODEL }, out: { type: 'string', default: 'drafts' }, 'dry-run': { type: 'boolean', default: false }, 'from-json': { type: 'string' } }, strict: true }).values;
  } catch (err) { die(`${err.message}\n${USAGE}`); }

  const live = await loadLive();
  if (!a.field || !Object.hasOwn(live.FIELDS, a.field)) die(`--field must be one of ${Object.keys(live.FIELDS).join(', ')}\n${USAGE}`);
  if (!a.kind || !Object.hasOwn(KINDS, a.kind)) die(`--kind must be one of ${Object.keys(KINDS).join(', ')}\n${USAGE}`);
  if (!/^[\w.-]{1,64}$/.test(a.model)) die('--model looks wrong');
  const fromJson = a['from-json'];
  if (!fromJson && !(a.subject?.trim().length >= 3)) die(`--subject is required (3+ characters)\n${USAGE}`);

  const docs = readFileSync(join(ROOT, 'docs', 'MISSIONS.md'), 'utf8');
  const { system, user, index } = buildPrompt({ live, docs, field: a.field, kind: a.kind, subject: a.subject, notes: a.notes });
  if (a['dry-run']) { console.log(`=== SYSTEM ===\n${system}\n\n=== USER ===\n${user}`); return 0; }

  let text;
  if (fromJson) text = readFileSync(fromJson, 'utf8');
  else {
    const key = process.env.ANTHROPIC_API_KEY?.trim();
    if (!key) die('ANTHROPIC_API_KEY is not set. Export it in your shell, or use --dry-run or --from-json (no key needed).');
    console.log(`Asking ${a.model} for a ${a.field} / ${a.kind} mission...`);
    text = await askClaude({ key, model: a.model, system, user });
  }

  const base = `${a.field}-${a.kind}-${new Date().toISOString().replace(/\.\d+Z$/, 'Z').replace(/[-:]/g, '')}`;
  let draft;
  try { draft = parseModelText(text); } catch (err) {
    const [file] = writeFiles(a.out, base, { 'raw.txt': `${escapeOdd(JSON.stringify(text))}\n` }); // a JSON string with odd characters escaped, safe to cat
    console.error(`FAIL  ${err.message}. The raw answer is saved in ${file}`);
    return 1;
  }

  const results = validateDraft(draft, { live, field: a.field, kind: a.kind, index });
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.rule}${r.ok ? '' : `: ${r.detail}`}`);
  const failed = results.filter((r) => !r.ok);
  const blocked = failed.some((r) => GATES.has(r.rule));
  const files = { json: `${escapeOdd(JSON.stringify(draft, null, 2))}\n`, ...(blocked ? {} : Object.fromEntries(Object.entries(toSnippets(draft, index)).map(([k, v]) => [`${k}.txt`, v]))) };
  const written = writeFiles(a.out, base, files);

  console.log(`\n${failed.length ? `${failed.length} rule(s) FAILED` : 'All rules passed'}. Files:\n${written.map((f) => `  ${f}`).join('\n')}`);
  if (blocked) console.log(`A format or safety rule failed (${[...GATES].join(', ')}): only the JSON was saved, with odd characters escaped, and no code snippets. Run again.`);
  else console.log(`
Next steps (a human decides, nothing ships on its own):
  1. Review the draft with the checklist "Review an AI draft" in docs/MISSIONS.md${failed.length ? ' and fix the FAILs above by hand' : ''}.
  2. Paste the four snippets at the SAME index (${index}, round ${Math.floor(index / live.PER_ROUND) + 1}) of ${a.field}:
     .fields.txt -> src/scripts/fields.ts   .missions.txt -> MX in missions.ts
     .helps.txt  -> src/scripts/helps.ts    .easy.txt     -> src/scripts/easy.ts
     To replace an existing mission instead, paste over the one at the same kind (index % 3 = ${KINDS[a.kind]}) and fix the number in the label.
  3. A round is 3 missions and every field needs the same count: npm test stays red until all fields match
     (and MAX_MISSIONS in scripts/check-content.mjs + supabase/schema.sql allow the new indexes). Then run: npm test`);
  return failed.length ? 1 : 0;
}

main().then((code) => { process.exitCode = code; }, (err) => die(err.message, 1));
