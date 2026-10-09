// Checks "Try your prompt on the AI" (mode 'run' in netlify/functions/coach.mts) on the real function, with the model mocked: only Prompting,
// only 20-1500 characters, heavy words pause before any model call, and the model gets the person's prompt alone. Run: npm test
import assert from 'node:assert/strict';

process.env.ANTHROPIC_API_KEY = 'mock';
let sent = null, text = 'Monday: maths. Tuesday: history. Wednesday: rest.';
globalThis.fetch = async (_url, init) => { sent = JSON.parse(init.body); return new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 }); };
const { default: handler } = await import('../netlify/functions/coach.mts');

let ip = 0; // a fresh address per call: the function's rate limit is per IP
const run = async (body) => {
  sent = null;
  const req = new Request('http://check.local/api/coach', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'run', lang: 'en', field: 'Prompting', ...body }) });
  const res = await handler(req, { ip: `10.9.0.${++ip}` });
  return { status: res.status, ...(await res.json()) };
};
const P = 'Write a three-line plan for my study week, one line per day.';

for (const field of ['Design', 'prompting', undefined]) {
  assert.equal((await run({ field, prompt: P })).status, 400, `run mode must refuse field ${field}`);
  assert.equal(sent, null, `field ${field} reached the model`);
}
for (const prompt of ['x'.repeat(1501), 'too short', '   ', 42]) {
  assert.equal((await run({ prompt })).status, 400, `run mode must refuse a prompt of ${String(prompt).length} characters`);
  assert.equal(sent, null, 'a refused prompt reached the model');
}
const heavy = await run({ prompt: 'Write a note for my mum, I want to end it all', lang: 'it' });
assert.match(heavy.reply, /metto in pausa la missione/, 'heavy words get the fixed pause');
assert.equal(sent, null, 'heavy words reached the model');

const ok = await run({ prompt: `  ${P}  ` });
assert.equal(ok.reply, text);
assert.deepEqual(sent.messages, [{ role: 'user', content: P }], 'the model gets the trimmed prompt alone');
assert.equal(sent.max_tokens, 450);
assert.ok(!sent.system.includes('KERN.AI'), 'run mode must not use the coach prompt');
assert.equal((await run({ prompt: 'x'.repeat(1500) })).status, 200, '1500 characters is allowed');

for (text of ['Here is your piano di lavoro.', '  ']) assert.equal((await run({ prompt: P })).status, 502, `reply "${text}" must not reach the app`);
console.log('try your prompt: ok (Prompting only, 20-1500 characters, heavy words pause, only the prompt is sent)');
