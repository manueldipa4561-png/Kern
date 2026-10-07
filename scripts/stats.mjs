// Prints the usage numbers: who opted in to anonymous counts and what they did. Run: npm run stats
//   SUPABASE_SERVICE_KEY=... npm run stats             the report
//   SUPABASE_SERVICE_KEY=... npm run stats -- --json   the same numbers as JSON
// It reads kern_events with the SERVICE key, which can read the whole database: keep it on your own computer (shell or .env,
// which git ignores), never in Netlify and never in a PUBLIC_ variable. The URL is the same one the app uses.
import { summarize, format } from './stats-core.mjs';

const fail = (message) => { console.error(message); process.exit(1); };
try { process.loadEnvFile('.env'); } catch { /* no .env file: the environment is enough */ }

const url = (process.env.PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_KEY || '';
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) fail('PUBLIC_SUPABASE_URL is missing or is not https://<project>.supabase.co. Put it in .env (see .env.example).');
if (!key) fail('SUPABASE_SERVICE_KEY is missing. Supabase, Project Settings, API: copy the service_role (secret) key into your shell or .env. Never put it in Netlify.');
if (key === process.env.PUBLIC_SUPABASE_ANON_KEY) fail('That is the public key. The report needs the service_role (secret) key.');

const PAGE = 1000;
const MAX_ROWS = 500000; // a guard against a server that ignores Range and would send the same page for ever
const rows = [];
for (;;) {
  const from = rows.length;
  const res = await fetch(`${url}/rest/v1/kern_events?select=aid,ev,field,mission,brand,lang,created_at&order=id.asc`, {
    // Legacy keys are JWTs and go in Authorization too; the newer sb_secret_ keys go in apikey only.
    headers: { apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}), 'Range-Unit': 'items', Range: `${from}-${from + PAGE - 1}` },
  });
  if (res.status === 416) break; // asked past the last row
  if (!res.ok) fail(`Supabase answered ${res.status}. Did you run supabase/schema.sql? ${(await res.text()).slice(0, 200)}`);
  const page = await res.json();
  if (!page.length) break;
  rows.push(...page); // the server may send fewer than asked (its Max Rows setting), so carry on from what arrived
  if (rows.length > MAX_ROWS) fail(`More than ${MAX_ROWS} rows in kern_events: delete the old ones first (see docs/ANALYTICS.md).`);
}

const summary = summarize(rows);
console.log(process.argv.includes('--json') ? JSON.stringify(summary, null, 2) : format(summary));
