// Co-op with a friend, no server. The two "with a partner" missions of every field (index 2 and 5, next.ts) can be finished by two people:
// the first sends a link that carries their answer after the # (the part of a link no server receives), the friend opens it, writes their part
// and sends a link back that carries both. A link is untrusted input: only these 12 missions, capped text, no control or text-direction characters.
// Pure on purpose, so npm test can check it (scripts/check-sync.ts). The texts the friend sees are in coopask.ts; the screens are in app.ts.
export type Coop = { v: 1; f: string; i: number; n: string; a: string; r?: string; m?: string }; // n: who sent it, a: their answer, r: the friend's reply, m: who replied
export type CoopRec = { role: 'out' | 'in'; f: string; i: number; at: number; with: string; mine: string; theirs: string }; // out: I answered and sent it. in: I replied to a friend's. with: the friend's first name; mine and theirs: the two texts
export const COOP_KEYS = ['Design', 'Writing', 'Code', 'Video', 'Selling', 'Music'].flatMap((f) => [`${f}.2`, `${f}.5`]);
export const MAX_NAME = 20, MAX_ANSWER = 500, MAX_REPLY = 300;
const MAX_LINK = 3800; // chat apps and browsers handle far longer, but not every share target does

export const clip = (s: string, max: number) => [...s].slice(0, max).join(''); // by whole characters, never half an emoji
// Control, zero-width and text-direction characters go (they flip the text around them or leave a name looking empty); more than one empty line in a row collapses.
const clean = (v: unknown, max: number) => (typeof v === 'string' ? clip(v.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u061C\u200B-\u200F\u2028\u2029\u202A-\u202E\u2066-\u2069\uFEFF]/g, '').replace(/\n{3,}/g, '\n\n'), max).trim() : '');
const toB64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)));

export const coopUrl = (origin: string, c: Coop): string => {
  const body = (a: string) => `${origin}/#coop=${toB64(JSON.stringify({ ...c, a }))}`;
  let a = clip(c.a, MAX_ANSWER), url = body(a);
  while (url.length > MAX_LINK && [...a].length > 20) { a = clip(a, Math.floor([...a].length * 0.8)); url = body(a); } // an answer of all-emoji is the worst case: shorten it rather than fail
  return url;
};

// The address fragment of an opened page (location.hash) -> the co-op it carries, or null for anything that is not a well-formed one.
export const decodeCoop = (hash: string): Coop | null => {
  const m = /^#coop=([A-Za-z0-9_-]{1,5200})$/.exec(hash);
  if (!m) return null;
  try {
    const o = JSON.parse(fromB64(m[1]));
    if (!o || typeof o !== 'object' || o.v !== 1 || !Number.isInteger(o.i) || typeof o.f !== 'string' || !COOP_KEYS.includes(`${o.f}.${o.i}`)) return null;
    const a = clean(o.a, MAX_ANSWER);
    if (!a) return null;
    const out: Coop = { v: 1, f: o.f, i: o.i, n: clean(o.n, MAX_NAME), a };
    const r = clean(o.r, MAX_REPLY);
    if (r) { out.r = r; out.m = clean(o.m, MAX_NAME); }
    return out;
  } catch { return null; }
};

// A reply link arrived for an answer I sent. Returns the new list (the one given is never changed) and what happened:
//   done: it filled a row that was waiting. again: a second friend answered the same text, so it gets its own row.
//   same: this exact reply is already kept. own: it is the reply I sent myself, opened on my own device.
//   stranger: nothing of mine is waiting for it, so nothing is stored (a forwarded or made-up link cannot write into the trail).
export const settleReply = (coops: CoopRec[], c: Coop, now: number): { coops: CoopRec[]; status: 'done' | 'again' | 'same' | 'own' | 'stranger' } => {
  const reply = c.r;
  if (!reply) return { coops, status: 'stranger' };
  if (coops.some((r) => r.role === 'in' && r.f === c.f && r.i === c.i && r.mine === reply && r.theirs === c.a)) return { coops, status: 'own' };
  const out = coops.filter((r) => r.role === 'out' && r.f === c.f && r.i === c.i), exact = out.filter((r) => r.mine.trim() === c.a);
  if (exact.some((r) => r.theirs === reply)) return { coops, status: 'same' };
  const fill = (r: CoopRec): CoopRec => ({ ...r, mine: c.a, with: c.m || r.with, theirs: reply }); // mine becomes what was really sent
  const waiting = exact.find((r) => !r.theirs) ?? [...out].reverse().find((r) => !r.theirs); // an answer edited after it was sent no longer matches word for word: the newest one still waiting takes it
  if (waiting) return { coops: coops.map((r) => (r === waiting ? fill(r) : r)), status: 'done' };
  if (exact.length) return { coops: [...coops, fill({ ...exact[0], at: now, theirs: '' })].slice(-30), status: 'again' };
  return { coops, status: 'stranger' };
};
