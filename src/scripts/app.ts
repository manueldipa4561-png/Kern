// KERN app logic. State lives in this browser (localStorage key kern:v1); with an account it also syncs (cloud.ts).
//
//  profile ──> field ──> mission ──> answer ──> reflection ──> signals ──> Kern card ──> share
//                           ^            │ (draft autosaved)      │
//                           └────────────┴── yourKERN / Trail ◄───┘
import { IT, t2 } from './i18n';
import { icon } from './icons';
import { FIELDS } from './fields';
import { FIELD_INFO } from './fieldinfo';
import { COOP_KEYS, MAX_ANSWER, MAX_NAME, MAX_REPLY, clip, coopUrl, decodeCoop, settleReply, type Coop, type CoopRec } from './coop';
import { ASK } from './coopask';
import { SCORE, rowsOf, verdict } from './compare';
import { MX } from './missions';
import { RELICS, rollDrop, type Drop } from './loot';
import { nextSpot, roundOf, PER_ROUND } from './next';
import { SPONSORS } from './sponsors';
import { HELPS } from './helps';
import { EASY } from './easy';
import { SAMPLE_ANSWERS, SAMPLE_IDEA, sampleAnswers, sampleChat, sampleMine, swapSample, type Pair } from './demo';
import * as cloud from './cloud';
import * as stats from './stats';
import { akey, ver, stamp, mergeAnswers, type Tomb } from './sync';
import { inTime, clampCount } from './valid';

type Feel = 'flow' | 'ok' | 'drag';
type Again = 'yes' | 'maybe' | 'no';
type Refl = { e?: Feel; again?: Again; hard?: string; tip?: string; sid?: number }; // sid: the tip's shared sign, if published
type Answer = { f: string; i: number; t: string; at: number; ed?: number; r?: Refl; x?: number; d?: string }; // x: extra stones (bonuses, drop), d: drop id (loot.ts)
type Msg = { who: 'ai' | 'me'; t: string; typing?: boolean; p?: string }; // p: the person's own words quoted in front of a scripted question, kept apart so a language switch still translates the question
type Theme = 'dark' | 'light';
type Lang = 'en' | 'it';
type Habit = { t: string; c: string; l: [number, string][] }; // t: the tiny habit, c: the cue (after I...), l: [day number, relic id found that day or ''] per day done
type State = { v: 1; name: string; field: string; fields: string[]; onboarded: boolean; stones: number; answers: Answer[]; drafts: Record<string, string>; msgs: Msg[]; mine: string[]; lang: Lang; theme: Theme; text: number; guess: string; saves: number; badges: string[]; dared: boolean; gone: Tomb[]; habit: Habit; easy: boolean; coops: CoopRec[] }; // text: the text size step in Settings (0 small, 1 default, 2 large, 3 larger)

// Demo profile (open /?demo, switch off with /?demo=off): a lived-in trail to show KERN in a minute. It has its own storage key,
// never syncs, never publishes a sign and is never counted, so it cannot touch real data.
// Rewrites the address without one query parameter. An odd path such as // must never throw (it would stop the app half-way).
function dropParam(q: URLSearchParams, name: string) {
  q.delete(name);
  const rest = q.toString();
  try { history.replaceState(null, '', location.pathname.replace(/^\/{2,}/, '/') + (rest ? '?' + rest : '') + location.hash); } catch { /* leave the address as it is */ }
}
try {
  const q = new URLSearchParams(location.search), d = q.get('demo');
  if (d !== null) {
    const v = d.trim().toLowerCase();
    if (['off', '0', 'false', 'no'].includes(v)) { localStorage.removeItem('kern:mode'); localStorage.removeItem('kern:demo'); } // leaving throws the sample away, whatever a visitor typed in it; anything else unknown leaves the mode as it is
    else if (['', '1', 'true', 'on', 'yes', 'demo'].includes(v)) localStorage.setItem('kern:mode', 'demo');
    dropParam(q, 'demo'); // keeps other parameters, such as a dare link
  }
} catch { /* storage blocked: no demo */ }
const DEMO = (() => { try { return localStorage.getItem('kern:mode') === 'demo'; } catch { return false; } })();
const CLOUD = cloud.enabled && !DEMO;
const KEY = DEMO ? 'kern:demo' : 'kern:v1';
const PEND = 'kern:rm-signs'; // ids of signs still to be removed from the trail
// Delete my data, Log out and Delete my account also clear what sits beside the trail: the demo and the copy set aside when a trail could not be read.
// Once the account is gone so is the list of signs still to be removed (a plain Log out or Delete keeps it: those signs must still go at the next sign-in). The demo never touches any of it.
const wipeExtras = (accountGone = false) => { if (DEMO) return; try { for (const k of ['kern:demo', 'kern:mode', 'kern:v1:unreadable', ...(accountGone ? [PEND] : [])]) localStorage.removeItem(k); } catch { /* nothing stored */ } };
const eraseStats = () => (DEMO ? Promise.resolve() : stats.erase()); // the demo must never touch the real usage-count record
const OPEN = "What is your idea? Write it in your own words first. I won't suggest one."; // the co-pilot's first line (the demo chat starts with it too)
const DROP_IDS = ['spark', 'gem', 'jackpot', ...RELICS.map((r) => r.id)];
const FEELS: Feel[] = ['flow', 'ok', 'drag'];
const AGAINS: Again[] = ['yes', 'maybe', 'no'];
const fresh = (): State => ({ v: 1, name: '', field: 'Design', fields: [], onboarded: false, stones: 0, answers: [], drafts: {}, msgs: [], mine: [], lang: navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en', theme: 'dark', text: 1, guess: '', saves: 0, badges: [], dared: false, gone: [], habit: { t: '', c: '', l: [] }, easy: false, coops: [] });
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
// A name is cut by whole characters (never half an emoji) and holds no text-direction controls (U+202A-202E, U+2066-2069): they flip the text around them and leave the avatar empty.
const cleanName = (v: unknown) => (typeof v === 'string' ? [...v.replace(/[\u202A-\u202E\u2066-\u2069]/g, '')].slice(0, 40).join('') : '');
const cleanR = (r: unknown): Refl | undefined => {
  if (!r || typeof r !== 'object') return undefined;
  const o = r as Record<string, unknown>, out: Refl = {};
  if (FEELS.includes(o.e as Feel)) out.e = o.e as Feel;
  if (AGAINS.includes(o.again as Again)) out.again = o.again as Again;
  if (str(o.hard, 140).trim()) out.hard = str(o.hard, 140).trim();
  if (str(o.tip, 140).trim()) out.tip = str(o.tip, 140).trim();
  if (out.tip && Number.isSafeInteger(o.sid) && (o.sid as number) > 0) out.sid = o.sid as number;
  return Object.keys(out).length ? out : undefined;
};
const cleanHabit = (h: unknown): Habit => {
  const o = (h && typeof h === 'object' ? h : {}) as Record<string, unknown>;
  const l: [number, string][] = Array.isArray(o.l) ? o.l.filter((e): e is [number, string] => Array.isArray(e) && Number.isInteger(e[0]) && e[0] > 0 && typeof e[1] === 'string' && (e[1] === '' || DROP_IDS.includes(e[1]))).map((e): [number, string] => [e[0], e[1]]).slice(-90) : [];
  return { t: str(o.t, 60).trim(), c: str(o.c, 60).trim(), l };
};
const cleanCoops = (v: unknown): CoopRec[] => (Array.isArray(v)
  ? v.filter((c) => c && (c.role === 'out' || c.role === 'in') && typeof c.f === 'string' && Number.isInteger(c.i) && COOP_KEYS.includes(`${c.f}.${c.i}`) && inTime(c.at) && typeof c.mine === 'string' && c.mine.trim())
    .map((c): CoopRec => ({ role: c.role, f: c.f, i: c.i, at: c.at, with: str(c.with, MAX_NAME), mine: str(c.mine, MAX_ANSWER), theirs: str(c.theirs, MAX_ANSWER) })).slice(-30)
  : []);
// Stored or synced data is untrusted input: keep only well-formed values.
const sanitize = (s: any): State | null => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const d = fresh();
  try {
    if (!s || typeof s !== 'object' || s.v !== 1) return null;
    const drafts: Record<string, string> = {};
    if (s.drafts && typeof s.drafts === 'object') for (const [k, v] of Object.entries(s.drafts)) { const [f, i, ...rest] = k.split('.'); if (!rest.length && FIELDS[f] && /^\d$/.test(i ?? '') && Number(i) < FIELDS[f].m.length && typeof v === 'string' && v) drafts[k] = v.slice(0, 2000); }
    const field: string = FIELDS[s.field] ? s.field : 'Design';
    const answers: Answer[] = Array.isArray(s.answers)
      ? s.answers.filter((a: Answer) => a && FIELDS[a.f] && Number.isInteger(a.i) && a.i >= 0 && a.i < FIELDS[a.f].m.length && typeof a.t === 'string' && inTime(a.at))
        .map((a: Answer) => ({ f: a.f, i: a.i, t: a.t.slice(0, 2000), at: a.at, ed: inTime(a.ed) ? a.ed : undefined, r: cleanR(a.r), x: Number.isInteger(a.x) && a.x! > 0 ? Math.min(a.x!, 600) : undefined, d: typeof a.d === 'string' && DROP_IDS.includes(a.d) ? a.d : undefined }))
      : [];
    // Interests: the fields someone chose to explore, in their order. Older saves have none: use the answered ones.
    const fields = [...new Set([...(Array.isArray(s.fields) ? s.fields : answers.map((a) => a.f)), ...(s.onboarded ? [field] : [])])]
      .filter((f): f is string => typeof f === 'string' && !!FIELDS[f]);
    return {
      ...d,
      name: cleanName(s.name),
      field,
      fields,
      onboarded: !!s.onboarded,
      stones: clampCount(s.stones),
      answers,
      drafts,
      msgs: Array.isArray(s.msgs) ? s.msgs.filter((m: Msg) => m && (m.who === 'ai' || m.who === 'me') && typeof m.t === 'string').map((m: Msg): Msg => ({ who: m.who, t: m.t.slice(0, 500), ...(m.who === 'ai' && typeof m.p === 'string' && m.p ? { p: m.p.slice(0, 200) } : {}) })) : [],
      mine: Array.isArray(s.mine) ? s.mine.filter((m: unknown) => typeof m === 'string').map((m: string) => m.slice(0, 140)) : [],
      lang: s.lang === 'it' || s.lang === 'en' ? s.lang : d.lang,
      theme: s.theme === 'light' ? 'light' : 'dark', // two themes, dark first (a profile saved with the old "system" choice becomes dark)
      text: s.text === 0 || s.text === 2 || s.text === 3 ? s.text : 1,
      guess: str(s.guess, 200),
      saves: clampCount(s.saves),
      badges: Array.isArray(s.badges) ? s.badges.filter((b: unknown) => typeof b === 'string' && b.length < 20).slice(0, 50) : [],
      dared: !!s.dared,
      habit: cleanHabit(s.habit),
      easy: !!s.easy,
      coops: cleanCoops(s.coops),
      gone: Array.isArray(s.gone) ? s.gone.filter((g: unknown) => Array.isArray(g) && typeof g[0] === 'string' && g[0].length < 40 && inTime(g[1])).map((g: Tomb): Tomb => [g[0], g[1]]).slice(-200) : [],
    };
  } catch { return null; }
};
// Sample trail for the demo (texts in demo.ts): 6 answers in 3 fields, all reflected, about 530 stones (rank Cairn), a few finds, three versions of an idea in KERN.AI. Badges are earned from the answers themselves.
const demoState = (): State => {
  let real: { lang?: string; theme?: string; text?: number } = {};
  try { real = JSON.parse(localStorage.getItem('kern:v1') || '{}') || {}; } catch { /* no real profile to read */ }
  const lang: Lang = real.lang === 'it' || real.lang === 'en' ? real.lang : fresh().lang, theme: Theme = real.theme === 'light' ? 'light' : 'dark', text = real.text;
  const it = lang === 'it', answers = sampleAnswers(it, Date.now());
  return sanitize({ v: 1, name: 'Giulia', field: 'Design', fields: ['Design', 'Writing', 'Video'], onboarded: true, stones: answers.reduce((s, a) => s + 50 + (a.r ? 20 : 0) + (a.x || 0), 0), answers, msgs: [{ who: 'ai', t: OPEN }, ...sampleChat(it)], mine: sampleMine(it), dared: true, lang, theme, text, guess: 'Saved. This sharpens your KERN.' }) || fresh(); // guess: the reply to "A first guess" (That feels right), not a sentence of its own
};
let recovered = ''; // set when a saved trail could not be read in full at start-up: the notice to show once the app is up
let seen: string | null = null; // the trail as storage held it when this page last read or wrote it (absorb)
const load = (): State => {
  let raw: string | null = null, saved: any = null, ok: State | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  try { raw = localStorage.getItem(KEY); } catch { /* storage blocked */ }
  seen = raw;
  try { saved = JSON.parse(raw || 'null'); ok = sanitize(saved); } catch { /* unreadable: kept below */ }
  const lost = ok && Array.isArray(saved?.answers) ? saved.answers.length - ok.answers.length : 0; // answers of a mission this build does not know, or damaged ones
  if (ok && !lost) return ok;
  if (raw && !DEMO) { // the next save would replace it: keep what was there (the demo is only a sample, nothing to keep)
    recovered = ok ? "Some of your saved answers couldn't be read. A copy was kept on this device." : "We couldn't read your saved trail, so you are starting fresh. A copy was kept on this device.";
    try { localStorage.setItem(KEY + ':unreadable', raw.slice(0, 400000)); } catch { /* no room for the copy */ }
  }
  return ok ?? (DEMO ? demoState() : fresh());
};
const S = load();
const snapshot = () => ({ ...S, msgs: S.msgs.filter((m) => !m.typing).slice(-60) });
let saveFailed = false;
const UNSAVED = "Couldn't save on this device. Copy your answer somewhere safe.";
// Returns whether the browser kept the write. A failure is said once from here (drafts save while typing and must not nag);
// every moment that would claim "saved" checks the result and says it again.
function save(): boolean {
  if (absorb()) queueMicrotask(refresh);
  let kept = true;
  try { const json = JSON.stringify(snapshot()); localStorage.setItem(KEY, json); seen = json; saveFailed = false; }
  catch { kept = false; if (!saveFailed) { saveFailed = true; say("Couldn't save on this device. Check your browser storage settings."); } }
  schedulePush();
  return kept;
}
// Another tab may have saved since this page last looked (it was busy with a sheet open, or frozen, or restored from the back/forward cache and
// missed the event): take that copy in before this page writes, so the write cannot replace it. Same merge as a synced copy (newest answer wins, deletes stick).
function absorb(): boolean {
  let now: string | null = null;
  try { now = localStorage.getItem(KEY); } catch { return false; }
  if (!now || now === seen) return false;
  seen = now;
  try { mergeIn(JSON.parse(now)); return true; } catch { return false; }
}
const refresh = () => { setLvl(); renderProgress(); renderChat(); };

// Cloud sync (only when signed in): debounced upload of the whole state; retried on the next save or when back online.
let user: cloud.User | null = null, pushT = 0, syncOk = true, pulled = false; // pulled: this device has seen the cloud copy; never push before that, or an empty device would overwrite the trail
function schedulePush() {
  if (!user) return;
  clearTimeout(pushT);
  pushT = window.setTimeout(async () => {
    if (!user) return;
    try {
      if (!pulled) { const remote = await cloud.pull(user.id); if (remote) mergeIn(remote); pulled = true; renderMe(); applyField(false); }
      await cloud.push(user.id, snapshot()); if (!syncOk) say('Synced again.'); syncOk = true; }
    catch { if (syncOk) say("Couldn't sync. Your trail is safe on this device and will sync later."); syncOk = false; }
    renderAcct();
  }, 1200);
}
addEventListener('online', () => { if (user && !syncOk) schedulePush(); flushSigns(); });
// Merge a synced copy into this device (sync.ts rules: newest answer wins, deletes stick), keep local settings.
const mergeIn = (raw: unknown) => {
  const r = sanitize(raw); if (!r) return;
  const m = mergeAnswers(S.answers, r.answers, S.gone, r.gone);
  S.answers = m.answers; S.gone = m.gone;
  S.stones = S.answers.reduce((s, a) => s + worth(a), 0); // stones are exactly what the merged answers earned
  if (!S.name) S.name = r.name;
  if (!S.onboarded && r.onboarded) { S.onboarded = true; S.field = r.field; }
  S.fields = [...new Set([...S.fields, ...r.fields, S.field])]; // interests from every device
  const rd = Object.fromEntries(Object.entries(r.drafts).filter(([k]) => !S.answers.some((a) => `${a.f}.${a.i}` === k)));
  S.drafts = { ...rd, ...S.drafts };
  if (!S.mine.length && r.mine.length) { S.mine = r.mine; S.msgs = r.msgs; }
  S.saves = Math.max(S.saves, r.saves);
  if (!S.guess) S.guess = r.guess;
  S.badges = [...new Set([...S.badges, ...r.badges])];
  S.dared = S.dared || r.dared;
  const ck = (c: CoopRec) => `${c.role}.${c.f}.${c.i}.${c.at}`, cm = new Map(S.coops.map((c) => [ck(c), c])); // co-ops from every device; a reply that arrived on one fills the other
  for (const c of r.coops) { const o = cm.get(ck(c)); if (!o) cm.set(ck(c), c); else if (!o.theirs && c.theirs) { o.theirs = c.theirs; o.with = o.with || c.with; } }
  S.coops = [...cm.values()].sort((a, b) => a.at - b.at).slice(-30);
  if (!S.habit.t && r.habit.t) { S.habit.t = r.habit.t; S.habit.c = r.habit.c; }
  const hl = new Map<number, string>(); // days done on any device; a day that found something keeps it
  for (const [d, id] of [...S.habit.l, ...r.habit.l]) if (!hl.get(d)) hl.set(d, id);
  S.habit.l = [...hl].sort((a, b) => a[0] - b[0]).slice(-90);
};

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const kScr = $('kScr');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isIt = () => S.lang === 'it';
const tr = (s: string) => (S.lang === 'it' && IT[s]) || s;
const setT = (el: Element, en: string) => { (el as HTMLElement).dataset.en = en; el.innerHTML = tr(en); };
// Dynamic text built in code: clear data-en so a language switch does not overwrite it.
const setD = (el: Element, text: string) => { (el as HTMLElement).dataset.en = ''; el.textContent = text; };
const pressed = (attr: string, val: string) => document.querySelectorAll<HTMLElement>(`[data-k-${attr}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(`data-k-${attr}`) === val)));
const F = () => FIELDS[S.field] || FIELDS.Design;
const day = (t: number) => new Date(t).toLocaleDateString(isIt() ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'short' });
const doneIn = (f: string) => new Set(S.answers.filter((a) => a.f === f).map((a) => a.i));
const doneSet = () => doneIn(S.field);
// Rounds: the screen shows 3 missions at a time. base() is the index of the first mission of the round in play; the
// rows, trail and counters work on 0-2 inside that window (winDone), everything stored uses the full index.
const total = (f = S.field) => FIELDS[f]?.m.length ?? PER_ROUND;
const base = (f = S.field) => roundOf(doneIn(f), total(f)) * PER_ROUND;
const winDone = () => { const d = doneSet(), b = base(); return new Set([0, 1, 2].filter((k) => d.has(b + k))); };
let peek = ''; // "field:base()" of the round whose NEXT round is on show in the list: a look ahead, never a lock. Keyed by field too, so it cannot leak to another field
const peekKey = () => `${S.field}:${base()}`;
const peeking = () => peek === peekKey() && base() + PER_ROUND < total();
const viewBase = () => base() + (peeking() ? PER_ROUND : 0); // first mission of the three rows on screen

const toast = $('kToast'), toastT = $('kToastT'), toastB = $('kToastB');
let tT = 0, toastAct: (() => void) | null = null;
let clearT = 0; // the words go once the fade is over: a faded toast must not leave its last message for a screen reader to find
const hideToast = () => {
  toast.classList.remove('on', 'act'); toastAct = null; toastB.hidden = true;
  clearTimeout(clearT); clearT = window.setTimeout(() => { if (!toast.classList.contains('on')) toastT.textContent = ''; }, 400);
};
// Short message at the bottom; with `undo`, shows an Undo button for a few seconds (Gmail-style).
function say(en: string, undo?: () => void) {
  toastT.textContent = tr(en);
  toastAct = undo || null; toastB.hidden = !undo; toastB.textContent = tr('Undo');
  toast.classList.toggle('act', !!undo); toast.classList.add('on');
  if (undo) toastB.focus({ preventScroll: true }); // keyboard and screen-reader users land on Undo
  clearTimeout(tT); tT = window.setTimeout(hideToast, undo ? 8000 : 2800);
}
// A badge is news nobody asked for, so it never takes the place of an Undo that is still on screen, and never lands on a sheet someone is filling in
// (it covered the last self-check row): it waits its turn, and shows once the sheet is closed.
const sayBadge = (text: string) => {
  if (toastAct || topLayer()) { window.setTimeout(() => sayBadge(text), 1000); return; }
  say(text); if ('vibrate' in navigator) navigator.vibrate([20, 40, 20]);
};
const reveal = (el: Element) => el.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
// A screen or state swaps under the user's finger: focus its heading, or keyboard and screen-reader focus falls to the page body.
// syncInert first: a layer that was just closed may still hold the screen behind it inert, and a focus() there is refused.
const land = (el: HTMLElement) => { syncInert(); el.tabIndex = -1; el.focus({ preventScroll: true }); };
// A step swap (answer, reflection, reward, next mission) puts a different button under the same thumb: ignore a second tap within 450 ms.
let tapLockUntil = 0;
const once = (fn: () => void) => () => { if (performance.now() < tapLockUntil) return; tapLockUntil = performance.now() + 450; fn(); };
kScr.appendChild(toast); // a direct child of the screen, so a screen reader still hears it while a sheet makes the app shell inert
toastB.addEventListener('click', () => { const f = toastAct; hideToast(); if (f) f(); });
// An Undo waits while the pointer rests on it, and gets a few more seconds once the pointer leaves.
toast.addEventListener('pointerenter', () => clearTimeout(tT));
toast.addEventListener('pointerleave', () => { if (toastAct) tT = window.setTimeout(hideToast, 4000); });

// Static text: remember the English source so language switches are lossless.
const kTxt = kScr.querySelectorAll<HTMLElement>('.k-l:not(.k-finds-h), h4, h5, p, .k-sig, .k-chips span, .k-tile span, .k-done span, .k-tag span, .k-tag strong, .k-ask button, .k-btn, .k-ask-btn, .k-go, .k-sk, .k-win, .k-check span, .k-seg button, .k-tabs .tt, #kXAsk, .k-streak small, .k-finds-h span');
kTxt.forEach((e) => { e.dataset.en = e.innerHTML.trim(); });
// Headings: the page is an h1 (screen-reader only), panes (h4) and cards (h5). Levels 2 and 3 are what a screen reader announces; the tags keep the look.
kScr.querySelectorAll('h4').forEach((h) => h.setAttribute('aria-level', '2'));
kScr.querySelectorAll('h5').forEach((h) => h.setAttribute('aria-level', '3'));
const SAMPLE = { guess: $('kGuess').dataset.en!, why: $('kWhy').dataset.en!, ai: $('kAiSig').dataset.en!, card: $('kCardH').dataset.en!, cardL: $('kCardL').dataset.en!, drawn: ['Shaping ideas', 'Writing', 'Solo work'], cardC: ['Shaping ideas', 'Writing'] };

// Launch loader
const kLoad = $('kLoad');
if (still) kLoad.classList.add('off');
else { kLoad.classList.add('go'); window.setTimeout(() => kLoad.classList.add('off'), S.name ? 1900 : 2600); }

// Theme
const applyTheme = () => {
  const light = S.theme === 'light';
  kScr.classList.toggle('light', light);
  document.documentElement.classList.toggle('light', light);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#E8E6DA' : '#0F140E');
  pressed('theme', S.theme);
};
document.querySelectorAll<HTMLElement>('[data-k-theme]').forEach((b) => b.addEventListener('click', () => { S.theme = b.dataset.kTheme as Theme; save(); applyTheme(); }));

// Text size: every font size in app.css is in rem, so the root size scales all the text. One button per step in Settings.
const TEXT_SCALE = [0.92, 1, 1.14, 1.3];
const applyText = () => { document.documentElement.style.setProperty('--kts', String(TEXT_SCALE[S.text] ?? 1)); pressed('text', String(S.text)); };
document.querySelectorAll<HTMLElement>('[data-k-text]').forEach((b) => b.addEventListener('click', () => { S.text = Number(b.dataset.kText); save(); applyText(); }));

// View Transitions (Chrome, Safari 18+, Firefox 144+): tab panes slide in the direction you move,
// the chosen field object flies into the mission card. Older browsers get the plain swap.
type VT = { ready: Promise<void>; updateCallbackDone: Promise<void>; finished: Promise<void> };
const startVT = (document as Document & { startViewTransition?: (cb: () => unknown) => VT }).startViewTransition?.bind(document);
let vtBusy = false, vtSeq = 0;
// Runs cb inside a View Transition with `cls` on <html> while it plays. A skipped transition (rapid taps,
// hidden tab) still runs cb; its promises then reject by design, so they are caught here.
const runVT = (cls: string, cb: () => unknown, after?: () => void) => {
  const root = document.documentElement, seq = ++vtSeq;
  root.classList.add(cls);
  const t = startVT!(cb);
  t.ready.catch(() => { /* skipped */ }); t.updateCallbackDone.catch(() => { /* skipped */ });
  t.finished.catch(() => { /* skipped */ }).finally(() => { if (seq === vtSeq) root.classList.remove('vt-tab', 'vt-hero'); after?.(); });
};

// Tabs
const tabs = kScr.querySelectorAll<HTMLElement>('[data-k-tab]');
const tabIds = [...tabs].map((x) => 'k-' + x.dataset.kTab);
let wanted = ''; // the pane the latest tap asked for: a swap runs a frame after its tap, and must show this one, so an earlier swap can never overrule a later tap
tabs.forEach((t) => t.addEventListener('click', () => {
  const next = 'k-' + t.dataset.kTab, cur = kScr.querySelector<HTMLElement>('.k-pane.on');
  wanted = next;
  tabs.forEach((x) => { x.classList.toggle('on', x === t); x.setAttribute('aria-current', String(x === t)); });
  const swap = () => {
    kScr.querySelectorAll('.k-pane').forEach((p) => { p.classList.remove('leaving'); p.classList.toggle('on', p.id === wanted); });
    kScr.querySelector<HTMLElement>('.k-body')!.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };
  moveInd(t, true);
  if (still || !cur || cur.id === next || vtBusy) return swap();
  if (startVT) {
    document.documentElement.dataset.dir = tabIds.indexOf(next) > tabIds.indexOf(cur.id) ? 'fwd' : 'back';
    runVT('vt-tab', swap); // only the pane animates; the tab bar stays live so its capsule slides
  } else { cur.classList.add('leaving'); window.setTimeout(swap, 140); }
}));
const goTab = (name: string) => kScr.querySelector<HTMLElement>(`[data-k-tab="${name}"]`)!.click();

// Tab indicator: one pill that slides to the active tab, stretching while it travels.
const nav = kScr.querySelector<HTMLElement>('.k-tabs')!;
const ind = document.createElement('span');
ind.className = 'k-ind'; ind.setAttribute('aria-hidden', 'true'); nav.appendChild(ind);
let indX = -1, indT = 0;
function moveInd(btn: HTMLElement, animate: boolean) {
  const x = btn.offsetLeft + btn.offsetWidth / 2 - ind.offsetWidth / 2;
  const travel = Math.abs(x - indX);
  clearTimeout(indT);
  if (!animate || still || indX < 0 || travel < 1) {
    ind.classList.add('snap'); ind.style.transform = `translateX(${x}px)`;
    void ind.offsetWidth; ind.classList.remove('snap');
  } else {
    ind.style.transform = `translateX(${(x + indX) / 2}px) scaleX(${Math.min(1.5, 1 + travel / 300)})`;
    indT = window.setTimeout(() => { ind.style.transform = `translateX(${x}px)`; }, 160);
  }
  indX = x;
}
const onTab = () => kScr.querySelector<HTMLElement>('.k-tabs button.on')!;
new ResizeObserver(() => moveInd(onTab(), false)).observe(nav);

// Sheets (answer + settings): backdrop tap and Escape close them, focus returns where it was.
const kSheet = $('kSheet'), kSet = $('kSet'), kFld = $('kFld');
// Whatever layer is on top (sheet, reward, login, onboarding) makes everything behind it inert:
// no Tab, clicks or screen reader reaching the page under a dialog.
const LAYERS = ['kReward', 'kPwS', 'kSet', 'kFld', 'kSheet', 'kStart', 'kLogin'].map((id) => $(id)); // top first
const topLayer = () => LAYERS.find((l) => !l.hidden && (!l.classList.contains('k-start') || l.classList.contains('on')));
const syncInert = () => {
  const top = topLayer();
  for (const c of kScr.children) (c as HTMLElement).inert = !!top && c !== top && c.id !== 'kToast' && c.id !== 'kLoad';
};
const layerWatch = new MutationObserver(syncInert);
LAYERS.forEach((l) => layerWatch.observe(l, { attributes: true, attributeFilter: ['hidden', 'class'] }));
let lastFocus: HTMLElement | null = null;
const openSheetEl = (sh: HTMLElement, focus: HTMLElement) => {
  lastFocus = document.activeElement as HTMLElement; sh.hidden = false; syncInert();
  sh.querySelector('.k-sh-in')?.scrollTo(0, 0); // start at the top, whatever the last sheet was scrolled to
  focus.focus({ preventScroll: true });
};
const closeSheet = (sh: HTMLElement) => {
  const reveal = sh === kSheet && !$('kShD').hidden; // closed from the drop screen (Escape or backdrop): refresh stones and rank like Continue does
  sh.hidden = true; syncInert(); if (sh === kSheet) flushDraft(); lastFocus?.focus();
  if (reveal) { setLvl(); renderProgress(); }
};
[kSheet, kSet, kFld].forEach((sh) => {
  sh.addEventListener('click', (e) => { if (e.target === sh) closeSheet(sh); });
  sh.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeSheet(sh); } });
});
// The grab handle is a handle: drag it down to close the sheet. A short drag springs back.
const SWIPE_CLOSE_PX = 80;
kScr.querySelectorAll<HTMLElement>('.k-sheet').forEach((sh) => {
  const inner = sh.querySelector<HTMLElement>('.k-sh-in')!, grab = sh.querySelector<HTMLElement>('.k-grab')!;
  let startY = 0, dy = 0;
  const settle = () => { inner.style.translate = ''; };
  grab.addEventListener('pointerdown', (e) => { startY = e.clientY; dy = 0; grab.setPointerCapture(e.pointerId); });
  grab.addEventListener('pointermove', (e) => {
    if (!grab.hasPointerCapture(e.pointerId)) return;
    dy = Math.max(0, e.clientY - startY); inner.style.translate = `0 ${dy}px`;
  });
  grab.addEventListener('pointerup', (e) => { grab.releasePointerCapture(e.pointerId); settle(); if (dy >= SWIPE_CLOSE_PX) closeSheet(sh); });
  grab.addEventListener('pointercancel', settle);
});

// Ranks
const RANKS: [string, number][] = [['Pebble', 0], ['Stone', 100], ['Cairn', 300], ['Ridge', 700], ['Summit', 1500]];
const RIT: Record<string, string> = { Pebble: 'Ciottolo', Stone: 'Pietra', Cairn: 'Cairn', Ridge: 'Cresta', Summit: 'Vetta' };
const rn = (n: string) => (isIt() && RIT[n]) || n;
const rankIdx = (s: number) => RANKS.reduce((a, r, i) => (s >= r[1] ? i : a), 0);
// Points and ranks are cut from the interface; this only keeps the answer box placeholder in step with the language.
const setLvl = () => { $<HTMLTextAreaElement>('kTa').placeholder = tr('Write it your way.'); };

// Signals: which kind of mission you light up on, from your own reflections. The kind is the mission index % 3
// (improve what exists, start from zero, work with someone), so each round adds evidence for the same three kinds.
const KIND_EN = ['improve what already exists', 'start from zero', 'work with someone'];
const KIND_IT = ['migliori ciò che esiste già', 'parti da zero', 'collabori con qualcuno'];
const KSHORT = ['Improving things', 'Starting from zero', 'Working with others'];
const FEEL_EN: Record<Feel, string> = { flow: 'Time flew', ok: 'It was fine', drag: 'It dragged' };
const AGAIN_EN: Record<Again, string> = { yes: 'Yes', maybe: 'Maybe', no: 'No' };
const DRAGGED = 0.5; // a kind is only called a drag when its average is this low: a lone "It was fine" scores 1 and is not one
const readSignals = () => {
  const by = [0, 1, 2].map((i) => S.answers.filter((a) => a.f === S.field && a.i % PER_ROUND === i && a.r?.e)); // by kind: every round has one of each
  const rated = by.map((l, i) => ({ i, v: l.length ? l.reduce((s, a) => s + SCORE[a.r!.e!], 0) / l.length : -1 })).filter((x) => x.v >= 0).sort((a, b) => b.v - a.v);
  if (!rated.length) return null;
  const best = rated[0].i, low = rated[rated.length - 1];
  const worst = rated.length > 1 && low.v < rated[0].v && low.v <= DRAGGED ? low.i : -1;
  const last = (i: number) => by[i][by[i].length - 1];
  const lowest = (i: number) => by[i].reduce((m, a) => (SCORE[a.r!.e!] <= SCORE[m.r!.e!] ? a : m)); // the answer behind a drag: the latest one with the lowest mark
  return { best, worst, n: rated.length, bestA: last(best), worstA: worst >= 0 ? lowest(worst) : null };
};
const chips = (box: HTMLElement, list: string[]) => { box.innerHTML = ''; list.forEach((t) => { const s = document.createElement('span'); s.textContent = t; box.appendChild(s); }); };
const renderSignals = () => {
  const sg = readSignals(), it = isIt(), K = it ? KIND_IT : KIND_EN;
  const done = doneSet().size;
  $('kSample').hidden = !!sg;
  if (!sg) {
    setT($('kGuess'), SAMPLE.guess); setT($('kWhy'), SAMPLE.why); setT($('kCardH'), SAMPLE.card); setT($('kCardL'), SAMPLE.cardL);
    chips($('kDrawn'), SAMPLE.drawn.map(tr)); chips($('kCardC'), SAMPLE.cardC.map(tr));
  } else {
    const title = (a: Answer) => tr(FIELDS[a.f].m[a.i][1]);
    const feel = (a: Answer) => tr(FEEL_EN[a.r!.e!]);
    setD($('kGuess'), it
      ? `Sembri accenderti quando ${K[sg.best]}${sg.worst >= 0 ? ` e faticare quando ${K[sg.worst]}` : ''}.`
      : `You seemed to light up when you ${K[sg.best]}${sg.worst >= 0 ? ` and drag when you ${K[sg.worst]}` : ''}.`);
    setD($('kWhy'), it
      ? `Perché lo pensiamo: hai segnato "${feel(sg.bestA)}" su ${title(sg.bestA)}${sg.worstA ? ` e "${feel(sg.worstA)}" su ${title(sg.worstA)}` : ''}.`
      : `Why we think so: you marked "${feel(sg.bestA)}" on ${title(sg.bestA)}${sg.worstA ? ` and "${feel(sg.worstA)}" on ${title(sg.worstA)}` : ''}.`);
    setD($('kCardH'), it ? `Ti accendi quando ${K[sg.best]}.` : `You light up when you ${K[sg.best]}.`);
    setD($('kCardL'), done === 3 && sg.n === 3 ? tr('3 missions · first guess')
      : done > 3 && sg.n === 3 ? (it ? `${done} missioni · ipotesi più precisa` : `${done} missions · sharper guess`)
      : (it ? `Basata su ${sg.n} ${sg.n === 1 ? 'riflessione' : 'riflessioni'} su 3 · iniziale` : `Based on ${sg.n} of 3 reflections · early`));
    chips($('kDrawn'), [tr(S.field), tr(KSHORT[sg.best])]);
    chips($('kCardC'), [tr(S.field), tr(KSHORT[sg.best])]);
  }
  // Energy per kind of mission in this field: the average of your own "how did it feel" answers.
  const meter = $('kMeter');
  meter.innerHTML = '';
  let any = false;
  [0, 1, 2].forEach((i) => {
    const l = S.answers.filter((a) => a.f === S.field && a.i % PER_ROUND === i && a.r?.e);
    const v = l.length ? l.reduce((s, a) => s + SCORE[a.r!.e!], 0) / (l.length * 2) : 0;
    any ||= l.length > 0;
    const row = document.createElement('div'), lab = document.createElement('span'), val = document.createElement('b'), bar = document.createElement('i'), fill = document.createElement('s');
    row.className = 'k-mt'; lab.textContent = tr(KSHORT[i]); val.textContent = l.length ? Math.round(v * 100) + '%' : '–';
    fill.style.width = v * 100 + '%'; bar.append(fill); row.append(lab, val, bar); meter.append(row);
  });
  setT($('kMeterN'), any ? 'From your reflections. Not a test.' : 'Reflect after a mission to fill this.');
  const n = S.mine.length;
  if (n >= 2) setD($('kAiSig'), it ? `Hai riscritto la tua idea ${n} volte in KERN.AI. Confronta la versione 1 con l’ultima.` : `You rewrote your idea ${n} times in KERN.AI. Compare version 1 with your latest one.`);
  else setT($('kAiSig'), 'Write your idea in KERN.AI. Your versions show up here.'); // never a made-up insight shown as if it were yours
  renderCompare();
};
// Fields side by side: once two fields have a reflection, each one's average energy next to how many reflections it rests on (compare.ts).
const renderCompare = () => {
  const card = $('kFcmp'), it = isIt(), rows = rowsOf(S.answers, Object.keys(FIELDS)), v = verdict(rows);
  card.hidden = v === 'none';
  if (card.hidden) return;
  setD($('kFcmpT'), v === 'early' ? (it ? 'Siamo all’inizio. Prova una seconda missione in ognuno.' : 'Early days. Try a second mission in each.')
    : v === 'close' ? (it ? 'Ancora troppo vicini per dire.' : 'Too close to call yet.')
    : it ? `${tr(rows[0].f)} ti ha dato più energia finora.` : `${tr(rows[0].f)} gave you the most energy so far.`);
  $('kFcmpM').replaceChildren(...rows.map((r) => {
    const row = document.createElement('div'), lab = document.createElement('span'), val = document.createElement('b'), bar = document.createElement('i'), fill = document.createElement('s');
    row.className = 'k-mt'; lab.textContent = tr(r.f); val.textContent = `${Math.round(r.v * 100)}% · ${r.n}`;
    fill.style.width = `${r.v * 100}%`; bar.append(fill); row.append(lab, val, bar); return row;
  }));
};

// Home: greeting, next mission, the three missions with status.
// Your interests on Missions: switch path in one tap (progress is kept per field), or add more.
const switchField = (f: string) => {
  if (f === S.field || !FIELDS[f]) return;
  peek = ''; S.field = f; save(); applyField(false); pop();
};
const renderFields = () => {
  const box = $('kFields');
  box.innerHTML = '';
  S.fields.forEach((f) => {
    const b = document.createElement('button'), im = document.createElement('span'), t = document.createElement('span'), n = document.createElement('small');
    b.type = 'button'; b.className = 'k-fchip' + (f === S.field ? ' on' : ''); b.setAttribute('aria-pressed', String(f === S.field));
    im.className = 'k-fi'; im.setAttribute('aria-hidden', 'true'); im.innerHTML = icon(f);
    t.textContent = tr(f);
    n.textContent = `${doneIn(f).size}/${total(f)}`;
    b.append(im, t, n); b.addEventListener('click', () => switchField(f)); box.appendChild(b);
  });
  const add = document.createElement('button');
  add.type = 'button'; add.className = 'k-fchip k-fadd'; add.textContent = `+ ${tr('Add')}`; add.setAttribute('aria-label', tr('Add interests'));
  add.addEventListener('click', () => openStart(true)); box.appendChild(add);  const on = box.querySelector<HTMLElement>('.on'); // with more paths than fit, the one in play stays in view
  if (on) box.scrollTo({ left: Math.max(0, on.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft - 20), behavior: 'instant' as ScrollBehavior });
};
// What to expect in the field on show (a day in it, what people like and find hard) and three steps outside the app (fieldinfo.ts).
const listOf = (id: string, items: string[]) => $(id).replaceChildren(...items.map((t) => Object.assign(document.createElement('li'), { textContent: tr(t) })));
const renderAbout = () => {
  const f = tr(S.field);
  setD($('kAbout'), isIt() ? `Cosa aspettarsi: ${f}` : `What to expect: ${f}`);
};
const openAbout = () => {
  const info = FIELD_INFO[S.field];
  if (!info) return;
  $('kFlI').innerHTML = icon(S.field);
  setD($('kFlT'), tr(S.field)); setD($('kFlD'), tr(info.day));
  listOf('kFlL', info.like); listOf('kFlH', info.hard);
  setT($('kFlGo'), kAdd.dataset.kAns === 'card' ? 'See your Kern card' : 'Try the next mission'); // a finished round has no next mission: the button leads where kAdd leads
  openSheetEl(kFld, $('kFlGo'));
};
$('kAbout').addEventListener('click', openAbout);
$('kFlX').addEventListener('click', () => closeSheet(kFld));
$('kFlGo').addEventListener('click', () => { closeSheet(kFld); kAdd.click(); });
// Take it further: shown once the field on show has an answer, so it follows something the person did.
const renderFurther = () => {
  const info = FIELD_INFO[S.field], card = $('kFurther');
  card.hidden = !info || !doneIn(S.field).size;
  if (card.hidden) return;
  setD($('kFuL'), `${tr('Take it further')} · ${tr(S.field)}`);
  $('kFuO').replaceChildren(...(['ask', 'make', 'learn'] as const).map((k) => {
    const li = document.createElement('li'), b = document.createElement('b'), t = document.createElement('span');
    b.textContent = tr({ ask: 'Ask', make: 'Make', learn: 'Learn' }[k]); t.textContent = tr(info.steps[k]);
    li.append(b, t); return li;
  }));
};
document.addEventListener('visibilitychange', () => { if (!document.hidden) { if (absorb()) setLvl(); renderProgress(); track('visit'); } }); // habit button, boost, streak and dots go stale overnight otherwise
const kAdd = $('kAdd'), kAdd2 = $('kAdd2');
// Usage counts without names (stats.ts): asked once on Home, switchable in Settings. Off until yes. Without Supabase there is nowhere to send them, so neither control shows.
const kStat = $('kStat'), kStatSet = $('kStatSet');
const track = (ev: stats.Ev, f?: string, i?: number) => { if (!DEMO) stats.track(ev, f, i, S.lang); }; // a demo is never counted
function renderStat() {
  kStat.hidden = DEMO || !(stats.available && S.onboarded && !stats.decided());
  kStatSet.hidden = DEMO || !stats.available;
  setT(kStatSet, stats.isOn() ? 'Usage counts: on' : 'Usage counts: off');
}
// The card hides itself when answered, so focus moves to the main button instead of falling to the page.
const afterStatChoice = (message: string) => { say(message); renderStat(); kAdd.focus({ preventScroll: true }); };
const countsOn = () => afterStatChoice(stats.turnOn(S.lang) ? 'Thanks. You can switch this off in Settings.' : "Couldn't switch it on in this browser.");
$('kStY').addEventListener('click', countsOn);
$('kStN').addEventListener('click', () => { stats.decline(); afterStatChoice('Okay. Nothing will be counted. You can change this in Settings.'); });
let armedAt = 0; // the first tap explains, a second tap within 8 seconds switches counting on
kStatSet.addEventListener('click', async () => {
  if (!stats.isOn()) {
    if (Date.now() - armedAt > 8000) {
      armedAt = Date.now();
      setT(kStatSet, 'Tap again to switch on (no names, see Privacy)');
      say('Counts what you do (opened, answered, shared), never your name or your words. Tap again to switch on.');
      window.setTimeout(renderStat, 8000);
      return;
    }
    armedAt = 0; countsOn(); return;
  }
  say((await stats.turnOff()) ? 'Usage counts are off. What was counted is deleted.' : "Counts are off. We couldn't reach the server to delete the earlier ones: they expire after 12 months.");
  renderStat();
});
// A round was just finished and the next one is not started: Home celebrates the Kern card first, and the pill and the Trail say the same.
const roundJustDone = () => { const b = base(), d = winDone(); return b > 0 && ![0, 1, 2].some((k) => d.has(k) || S.drafts[`${S.field}.${b + k}`]); };
// The word for a mission's state, the same on Home and in the Trail.
const stateWord = (done: boolean, next: boolean, draft: boolean) => (done ? 'Done' : next ? 'Next' : draft ? 'Draft' : 'Not started');
const renderHome = () => {
  renderStat();
  renderFields(); renderAbout(); renderFurther(); renderCoopIn();
  const f = F(), b = base(), round = b / PER_ROUND, done = winDone(), next = [0, 1, 2].find((k) => !done.has(k)), it = isIt();
  // fresh: a round was just finished and the next one is not started. Celebrate the Kern card first, then offer the new missions.
  const fresh = roundJustDone();
  setD($('kHi'), S.name ? `${it ? 'Ciao' : 'Hi'} ${S.name}` : (it ? 'Ciao' : 'Hi'));
  const glyph = next === undefined || fresh ? 'yourkern' : S.field, kNxIc = $('kNxIc');
  if (kNxIc.dataset.g !== glyph) { kNxIc.dataset.g = glyph; kNxIc.innerHTML = icon(glyph); }
  kAdd2.hidden = !fresh;
  if (next === undefined || fresh) {
    if (fresh) setD($('kNxL'), it ? `Round ${round} completato` : `Round ${round} complete`);
    else setD($('kNxL'), it ? `Le tue ${total()} missioni sono fatte` : `Your ${total()} missions are done`);
    setT($('kNxT'), 'Your Kern card is ready.');
    setT($('kNxP'), fresh ? 'See what your answers say about how you work, or keep going with 3 new missions.' : 'See what your answers say about how you work, and share it.');
    setT(kAdd, 'See your Kern card'); kAdd.dataset.kAns = 'card';
    if (fresh) { setD(kAdd2, it ? `Inizia il round ${round + 1}` : `Start round ${round + 1}`); kAdd2.dataset.kAns = String(b); }
  } else {
    const m = f.m[b + next];
    setD($('kNxL'), round
      ? (it ? `Round ${round + 1} · missione ${next + 1} di 3` : `Round ${round + 1} · mission ${next + 1} of 3`)
      : (it ? `Prossimo passo · missione ${next + 1} di 3` : `Your next step · mission ${next + 1} of 3`));
    setT($('kNxT'), m[1]); setT($('kNxP'), m[2]);
    setT(kAdd, S.drafts[`${S.field}.${b + next}`] ? 'Continue your draft' : 'Add your answer'); kAdd.dataset.kAns = String(b + next);
  }
  const finished = next === undefined || fresh; // the card is about the Kern card now, so no time chip
  const mins = finished ? 0 : MX[S.field]?.[b + (next ?? 0)]?.mins;
  $('kNxM').innerHTML = mins ? `<span class="k-l">~${mins} min</span>` : '';
  // The list shows the round in play, or a look at the next one (never a lock: every round is open).
  const looking = peeking(), vb = viewBase(), vr = vb / PER_ROUND, vdone = new Set([0, 1, 2].filter((k) => doneSet().has(vb + k)));
  if (vr) setD($('kMsL'), it ? `Round ${vr + 1} · le tue 3 missioni` : `Round ${vr + 1} · your 3 missions`); else setT($('kMsL'), 'Your 3 missions');
  const more = b + PER_ROUND < total(), peekBtn = $('kPeek');
  peekBtn.hidden = !more;
  if (more) setD(peekBtn, looking ? (it ? `‹ Torna al round ${round + 1}` : `‹ Back to round ${round + 1}`) : (it ? `Round ${round + 2} · altre 3 missioni ›` : `Round ${round + 2} · 3 more missions ›`));
  const nb = boostOf(S.field), nbEl = $('kNxB');
  nbEl.hidden = !nb || finished;
  if (nb) setD(nbEl, `${boostTxt(nb.m)} · ${tr(f.m[nb.i][1])}`);
  [0, 1, 2].forEach((i) => {
    const a = vb + i, row = $('kMR' + i), isNext = !looking && i === next;
    const st = stateWord(vdone.has(i), isNext, !!S.drafts[`${S.field}.${a}`]);
    row.classList.toggle('done', vdone.has(i)); row.classList.toggle('next', isNext);
    setT(row.querySelector('b')!, f.m[a][1]);
    const bo = boostOf(S.field), isB = !!bo && bo.i === a;
    row.classList.toggle('boost', isB);
    setD(row.querySelector('small')!, `${tr(f.m[a][0])} · ${tr(st)}${isCoop(S.field, a) ? ' · Co-op' : ''}${isB ? ' · ' + boostTxt(bo!.m) : ''}`);
  });
};

// The pill and the three steps of the Trail: the round in play and where each of its missions stands.
const renderSteps = () => {
  const it = isIt(), b = base(), round = b / PER_ROUND, done = winDone(), n = done.size, next = [0, 1, 2].find((k) => !done.has(k));
  const justDone = roundJustDone(), tb = justDone ? b - PER_ROUND : b; // until the next round is started, the Trail shows the round that was just finished
  $('kPill').textContent = justDone ? (it ? `Round ${round} fatto` : `Round ${round} done`) : round ? `Round ${round + 1} · ${n}/3` : it ? `${n} su 3 fatte` : `${n} of 3 done`;
  $('kRing').style.setProperty('--p', String(justDone ? 1 : n / 3));
  [0, 1, 2].forEach((i) => {
    setT($('kTr' + i), F().m[tb + i][1]);
    const st = $('kTr' + i).parentElement!, fin = justDone || done.has(i), now = !justDone && i === next;
    st.className = 'k-st' + (fin ? ' fin' : now ? ' now' : '');
    setT(st.querySelector('p')!, stateWord(fin, now, !!S.drafts[`${S.field}.${tb + i}`]));
  });
};
// Progress: pill, trail, answers list, signs, real stats from saved answers.
const renderProgress = () => {
  const it = isIt();
  renderSteps();
  const kc = $('kTrK');
  const ready = doneSet().size >= PER_ROUND; // the Kern card unlocks with round 1 and sharpens with every round after
  kc.className = 'k-st' + (ready ? ' now' : '');
  setT(kc.querySelector('p')!, ready ? 'Ready to share' : 'Ready when your 3 missions are done');
  const box = $('kAns');
  box.innerHTML = '';
  if (!S.answers.length) { const p = document.createElement('p'); p.textContent = tr('No answers yet. Pick a mission and add yours.'); box.appendChild(p); }
  S.answers.slice(-5).reverse().forEach((a, k) => {
    const idx = S.answers.length - 1 - k;
    const row = document.createElement('div'); row.className = 'k-an';
    const title = tr(FIELDS[a.f].m[a.i][1]);
    const l = document.createElement('span'); l.className = 'k-l';
    l.textContent = `${title} · ${day(a.at)}${a.r?.e ? ' · ' + tr(FEEL_EN[a.r.e]) : ''}`;
    const p = document.createElement('p'); p.textContent = a.t;
    const acts = document.createElement('div'); acts.className = 'k-an-act';
    // The same two words repeat on every row: the answer's title tells a screen reader which one it is (the visible word comes first)
    const ed = document.createElement('button'); ed.type = 'button'; ed.textContent = tr('Edit'); ed.setAttribute('aria-label', `${tr('Edit')}: ${title}`); ed.addEventListener('click', () => openEdit(idx));
    const del = document.createElement('button'); del.type = 'button'; del.textContent = tr('Delete'); del.setAttribute('aria-label', `${tr('Delete')}: ${title}`); del.addEventListener('click', once(() => deleteAnswer(idx)));
    acts.append(ed, del);
    row.append(l, p, acts); box.appendChild(row);
  });
  const signs = $('kSigns'), tips = S.answers.filter((a) => a.r?.tip);
  signs.innerHTML = '';
  if (!tips.length) { const p = document.createElement('p'); p.textContent = tr('After each mission, leave a short review for the next person.'); signs.appendChild(p); }
  tips.slice(-3).reverse().forEach((a) => {
    const d = document.createElement('div'); d.className = 'k-sign';
    const q = document.createElement('p'); q.textContent = `“${a.r!.tip}”`;
    const s = document.createElement('span'); s.className = 'k-l'; s.textContent = tr(FIELDS[a.f].m[a.i][1]);
    d.append(q, s); signs.appendChild(d);
  });
  $('kCnt').textContent = String(S.answers.length);
  const WEEK = 6048e5, now = Date.now();
  const weeks = [0, 1, 2, 3].map((w) => S.answers.some((a) => now - a.at >= w * WEEK && now - a.at < (w + 1) * WEEK));
  // Last 28 days as a grid (oldest first); a day lights up when you answered something on it.
  const midnight = (t: number) => new Date(t).setHours(0, 0, 0, 0);
  const made = new Set(S.answers.map((a) => midnight(a.at))), today = new Date(midnight(now));
  const cal = $('kDots'); cal.innerHTML = '';
  for (let k = 27; k >= 0; k--) {
    const d = new Date(today); d.setDate(today.getDate() - k);
    const c = document.createElement('i');
    if (made.has(d.getTime())) c.className = 'f';
    if (!k) c.classList.add('t');
    cal.appendChild(c);
  }
  const w = weeks.filter(Boolean).length;
  $('kRhy').textContent = it ? `In ${w} delle ultime 4 settimane hai creato qualcosa.` : `${w} of the last 4 weeks you made something.`;
  renderHome(); renderSignals(); renderBadges(); renderLoot(); renderCoops();
};

// Badges (Duolingo/Strava style): earned once, kept even if an answer is later deleted.
const WEEKNUM = (t: number) => Math.floor(t / 6048e5);
const BADGES: { id: string; t: string; d: string; ok: () => boolean }[] = [
  { id: 'first', t: 'First step', d: 'Your first answer', ok: () => S.answers.length > 0 },
  { id: 'reflect', t: 'Honest look', d: 'Your first reflection', ok: () => S.answers.some((a) => a.r) },
  { id: 'sign', t: 'Trail marker', d: 'Left a review for the next person', ok: () => S.answers.some((a) => a.r?.tip) },
  { id: 'full', t: 'Full trail', d: 'All 3 missions in one field', ok: () => Object.keys(FIELDS).some((f) => { const d = doneIn(f); return [0, 1, 2].every((i) => d.has(i)); }) },
  { id: 'deep', t: 'Deep dive', d: 'Every mission in one field', ok: () => Object.keys(FIELDS).some((f) => doneIn(f).size >= total(f)) },
  { id: 'twice', t: 'Do it twice', d: '3 versions of an idea in KERN.AI', ok: () => S.mine.length >= 3 },
  { id: 'dare', t: 'Challenger', d: 'Dared a friend', ok: () => S.dared },
  { id: 'steady', t: 'Steady', d: 'Made something in 3 different weeks', ok: () => new Set(S.answers.map((a) => WEEKNUM(a.at))).size >= 3 },
  { id: 'habit7', t: 'Habit builder', d: '7 days of your tiny habit', ok: () => S.habit.l.length >= 7 },
  { id: 'explorer', t: 'Explorer', d: 'Answered in 2 different fields', ok: () => new Set(S.answers.map((a) => a.f)).size >= 2 },
];
let booted = false;
function renderBadges() {
  const box = $('kBadges'), fresh: string[] = [];
  box.innerHTML = '';
  BADGES.forEach((b) => {
    if (!S.badges.includes(b.id) && b.ok()) { S.badges.push(b.id); fresh.push(b.t); }
    const got = S.badges.includes(b.id);
    const el = document.createElement('div'); el.className = 'k-badge' + (got ? ' got' : '');
    el.setAttribute('role', 'img'); // a plain div's aria-label is not exposed; the label names the badge, what it asks for and whether it is yours yet
    el.setAttribute('aria-label', `${tr(b.t)}: ${tr(b.d)} (${tr(got ? 'earned' : 'locked')})`);
    const m = document.createElement('i'); m.textContent = tr(b.t)[0]; m.setAttribute('aria-hidden', 'true');
    const t = document.createElement('b'); t.textContent = tr(b.t);
    const d = document.createElement('small'); d.textContent = tr(b.d);
    el.append(m, t, d); box.appendChild(el);
  });
  if (!fresh.length) return;
  save();
}

// Delete with Undo; stones earned by that answer are taken back so nothing can be farmed.
// Deletes made while the Undo toast is up join one batch, and Undo brings them all back.
// Each delete leaves a tombstone so it also sticks on the user's other synced devices.
const worth = (a: Answer) => 50 + (a.r ? 20 : 0) + (a.x || 0);
let binned: Answer[] = [], binnedCoops: CoopRec[] = []; // answers just deleted (Undo puts them back) and the co-op rows that went with them
function deleteAnswer(idx: number) {
  const a = S.answers[idx]; if (!a) return;
  if (!toastAct) { binned = []; binnedCoops = []; }
  binned.push(a);
  S.answers.splice(idx, 1);
  const mineCoops = S.coops.filter((r) => r.role === 'out' && r.f === a.f && r.i === a.i && (r.at === a.at || r.mine.trim() === clip(a.t, MAX_ANSWER).trim())); // the answer, and with it what it sent and what came back
  binnedCoops.push(...mineCoops); S.coops = S.coops.filter((r) => !mineCoops.includes(r));
  unshareSign(a); // its sign leaves the trail too; Undo shares it again
  S.gone = [...S.gone, [akey(a), stamp(ver(a))] as Tomb].slice(-200);
  S.stones = Math.max(0, S.stones - worth(a)); save(); setLvl(); renderProgress();
  const n = binned.length;
  say(n > 1 ? tr('{n} answers deleted.').replace('{n}', String(n)) : 'Answer deleted.', () => {
    binned.forEach((b) => {
      const t = S.gone.find(([k]) => k === akey(b))?.[1] || 0;
      S.gone = S.gone.filter(([k]) => k !== akey(b));
      b.ed = stamp(Math.max(t, ver(b))); // newer than its tombstone, so the restore wins on every device
      const i = S.answers.findIndex((x) => x.at > b.at);
      S.answers.splice(i < 0 ? S.answers.length : i, 0, b); S.stones += worth(b);
      shareSign(b);
    });
    S.coops = [...S.coops, ...binnedCoops].sort((x, y) => x.at - y.at).slice(-30);
    binned = []; binnedCoops = []; save(); setLvl(); renderProgress();
  });
}

// Co-pilot chat (scripted: it only asks, never proposes the idea)
const chatEl = $('kChat'), inEl = $<HTMLInputElement>('kIn'), cmp = $('kCmp');
let busy = false, gen = 0; // gen: bumped by startChat, so a reply that was in flight when the chat restarted is dropped
// Distress words (English and Italian, with or without accents and curly apostrophes). The same line sits in netlify/functions/coach.mts: scripts/check-heavy.mjs fails npm test when they differ.
const HEAVY = /(kill(ing)? myself|kill me\b|suicid|self.?harm|hurt(ing)? myself|end (my life|it all)|take my (own )?life|hopeless|want(ed)? to die|wish i (was|were) (dead|gone)|better off dead|(no|any) reason to live|don['’]?t want to (live|be here|wake up)|cut(ting)? myself|voglio morire|vorrei morire|farla finita|mi (voglio |vorrei |devo )?(uccid|ammazz|impicc)|uccider(mi|e me)|ammazzar(mi|e me)|impiccar(mi|e me)|tagliarmi le vene|mi taglio le vene|togliermi la vita|togliermi di mezzo|farmi del male|mi faccio del male|autolesion|non (voglio|riesco) pi[uù]['’]? (a )?vivere|non voglio pi[uù]['’]? stare qui|meglio morto|meglio morta|non ce la faccio pi[uù]|senza speranza|non vedo (una )?via d['’]?uscita|vorrei sparire|voglio sparire)/i;
const HEAVY_REPLY = "This sounds heavy, so I'm pausing the mission. Please talk to someone you trust or a local helpline. If you are in danger, call your local emergency number.";
const ASKED = /(give me|tell me|what should|write it for me|any ideas|dammi|dimmi|che idea|scrivilo tu|cosa dovrei)/i;
const STUCK = /(stuck|don'?t know|do not know|no idea|not sure|blank|boh|non so|bloccat|nessuna idea)/i;
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const Q_STUCK = [t2('Let us make it smaller. What is one sentence you could write in 30 seconds?', 'Facciamolo più piccolo. Qual è una frase che potresti scrivere in 30 secondi?'), t2('Forget good. What would the roughest version look like?', 'Dimentica il bello. Come sarebbe la versione più grezza?'), t2('Who is it for? Name one real person.', 'Per chi è? Fai il nome di una persona vera.')];
const Q_SMALL = [t2('What is the smallest part of it you could finish today?', 'Qual è la parte più piccola che potresti finire oggi?'), t2('If you only had 5 minutes, what would you do first?', 'Se avessi solo 5 minuti, cosa faresti per prima cosa?')];
const Q_MORE = [[t2('What would make that clearer for someone brand new?', 'Cosa lo renderebbe più chiaro per chi è nuovo?'), t2('If a friend read that, what would they ask first?', 'Se un amico lo leggesse, cosa chiederebbe per prima cosa?')], [t2('What is the strongest word in that, and what would you cut?', 'Qual è la parola più forte e cosa taglieresti?'), t2('What did you change from your first version, and why?', 'Cosa hai cambiato rispetto alla prima versione, e perché?')]];
// Echo the user's own opening words back, so the question is clearly about their idea.
const echo = (v: string) => { const w = v.split(/\s+/); return `“${w.slice(0, 6).join(' ')}${w.length > 6 ? '…' : ''}” `; };
let announced = '';
// A line as it reads now. The coach's scripted lines are stored as English keys (with the person's own quoted words in front) and the chips they tapped too,
// so a language switch translates them; everything else the person typed stays as typed.
const chipKeys = [...document.querySelectorAll<HTMLElement>('#kEx span')].map((c) => c.dataset.en);
const said = (m: Msg) => (m.who === 'ai' ? (m.p ?? '') + tr(m.t) : chipKeys.includes(m.t) ? tr(m.t) : m.t);
// The three dots of "KERN.AI is typing". The words are for a screen reader (an aria-label on a paragraph is ignored); last, so the dots keep their nth-child timing.
const typingDots = () => `<i></i><i></i><i></i><span class="k-sr">${tr('KERN.AI is typing')}</span>`;
const renderChat = () => {
  const lastAi = [...S.msgs].reverse().find((m) => !m.typing);
  if (lastAi && lastAi.who === 'ai' && said(lastAi) !== announced) { announced = said(lastAi); $('kSr').textContent = announced; }
  chatEl.innerHTML = '';
  S.msgs.forEach((m) => {
    const p = document.createElement('p'); p.className = 'k-msg ' + (m.who === 'me' ? 'k-me' : 'k-ai');
    if (m.typing) { p.classList.add('k-typing'); p.innerHTML = typingDots(); }
    else p.textContent = said(m);
    chatEl.appendChild(p);
  });
  chatEl.scrollTop = chatEl.scrollHeight;
  inEl.placeholder = tr('Your idea, your words…');
  const show = S.mine.length >= 3 && !busy;
  cmp.hidden = !show;
  if (show) { $('kV1').textContent = S.mine[0]; $('kV3').textContent = S.mine[S.mine.length - 1]; }
};
const aiSay = (t: string, p?: string) => {
  S.msgs.push({ who: 'ai', t: '', typing: true }); renderChat();
  const g = gen;
  window.setTimeout(() => { if (g !== gen) return; S.msgs.pop(); S.msgs.push(p ? { who: 'ai', t, p } : { who: 'ai', t }); busy = false; save(); renderChat(); renderSignals(); renderBadges(); }, still ? 0 : 750);
};
const startChat = () => {
  gen++;
  S.msgs = [{ who: 'ai', t: OPEN }]; S.mine = []; busy = false; inEl.value = '';
  save(); renderChat();
};
// Live co-pilot: asks netlify/functions/coach.mts, which calls Claude with the rules "only ask, never answer".
// If there is no key, no network or any error, the scripted coach below answers instead, so the chat always works.
let liveOk: boolean | null = null;
const setLive = (ok: boolean) => {
  if (liveOk === ok) return;
  liveOk = ok; setT($('kAiLbl'), ok ? 'You are talking to an AI · live replies' : 'You are talking to an AI · offline preview');
};
async function askAI(extra?: { mission?: { title: string; brief: string }; messages?: { who: string; t: string }[] }): Promise<string | null> {
  if (DEMO) return null; // a demo never sends what is typed anywhere: the scripted coach answers
  const ctl = new AbortController(), to = window.setTimeout(() => ctl.abort(), 10000);
  try {
    const r = await fetch('/api/coach', {
      method: 'POST', headers: { 'content-type': 'application/json' }, signal: ctl.signal,
      body: JSON.stringify({ lang: S.lang, field: extra?.mission ? cur.f : S.field, versions: extra ? 0 : S.mine.length, mission: extra?.mission, messages: extra?.messages ?? S.msgs.filter((m) => !m.typing).slice(-12).map((m) => ({ who: m.who, t: said(m) })) }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j?.reply === 'string' && j.reply.trim() ? j.reply.trim().slice(0, 500) : null;
  } catch { return null; } finally { clearTimeout(to); }
}
const scripted = (v: string) => {
  if (ASKED.test(v)) return aiSay("I won't hand you the idea. What is the first thing that comes to mind, even if it's rough?");
  if (STUCK.test(v)) return aiSay(pick(Q_STUCK));
  S.mine.push(v);
  if (S.mine.length < 3) return aiSay(pick([F().qs[S.mine.length - 1], ...Q_MORE[S.mine.length - 1]]), echo(v));
  if (S.mine.length === 3) return aiSay('You wrote it 3 times and each version changed. That is your evidence. Compare the first and the last.');
  aiSay('Save it to yourKERN, or start over with a new idea.');
};
const sendChat = () => {
  const v = inEl.value.trim(); if (!v || busy) return;
  inEl.value = ''; S.msgs.push({ who: 'me', t: v }); busy = true; renderChat();
  if (HEAVY.test(v)) return aiSay(HEAVY_REPLY);
  S.msgs.push({ who: 'ai', t: '', typing: true }); renderChat();
  const g = gen;
  askAI().then((reply) => {
    if (g !== gen) return;
    S.msgs = S.msgs.filter((m) => !m.typing);
    if (!reply) { setLive(false); scripted(v); return; }
    setLive(true);
    if (!ASKED.test(v) && !STUCK.test(v)) S.mine.push(v); // versions still count the same way
    S.msgs.push({ who: 'ai', t: reply }); busy = false; save(); renderChat(); renderSignals(); renderBadges();
  });
};
$('kSend').addEventListener('click', sendChat);
inEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); sendChat(); } }); // the Enter that confirms an IME word (Japanese, Chinese, Korean) is not "send"; Safari reports it as keyCode 229
document.querySelectorAll<HTMLElement>('#kEx span').forEach((c, i) => {
  const go = () => {
    if (i === 1) return startChat();
    if (i >= 2) { if (busy) return; S.msgs.push({ who: 'me', t: c.dataset.en || '' }); busy = true; renderChat(); return aiSay(pick(i === 2 ? Q_STUCK : Q_SMALL)); }
    inEl.value = tr(F().idea).replace(/^[^:]+:\s*/, ''); inEl.focus(); };
  c.addEventListener('click', go);
  c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});
$('kSaveV').addEventListener('click', () => { S.saves++; say(save() ? 'Saved to yourKERN. Every version counts as evidence.' : UNSAVED); });
$('kToAi').addEventListener('click', () => goTab('copilot'));

// Field: trail titles, progress, chat.
const applyField = (resetChat: boolean) => {
  if (resetChat || !S.msgs.length) startChat(); else renderChat();
  renderProgress();
};

// Answer sheet: step 1 answer (draft autosaved), step 2 quick reflection.
const kTa = $<HTMLTextAreaElement>('kTa'), kShA = $('kShA'), kShR = $('kShR');
let cur: { f: string; i: number; dare: boolean; edit: number } = { f: 'Design', i: 0, dare: false, edit: -1 };
let lastAns: Answer | null = null, dT = 0; // lastAns: the answer being reflected on
let lastBoost: { i: number; m: number } | null = null; // the daily boost as promised on screen, read before the answer moves the round (boostOf depends on progress)
const dKey = () => `${cur.f}.${cur.i}`;
function flushDraft() {
  clearTimeout(dT);
  if (kShA.hidden || cur.edit >= 0) return; // edits are not drafts
  const v = kTa.value.trim() ? kTa.value.slice(0, 2000) : '';
  if (v) S.drafts[dKey()] = v; else delete S.drafts[dKey()];
  save(); renderHome(); renderSteps(); // a first draft in the next round ends the "just finished" moment on the pill and the Trail too
  const note = !v ? NOTE_DEFAULT : saveFailed ? "Couldn't save on this device" : 'Draft saved on this device';
  // The browser cuts a longer paste or stops the typing at the limit without a word: say so, so the end of the text is not lost unseen.
  if (kTa.value.length >= kTa.maxLength) setD(kSaved, `${tr(note)} · ${tr('Limit reached: {n} characters.').replace('{n}', String(kTa.maxLength))}`); else setT(kSaved, note);
  kSaved.hidden = false;
}
kTa.addEventListener('input', () => { clearTimeout(dT); dT = window.setTimeout(flushDraft, 500); });
// Signs on the trail: the tip each person leaves after a mission is shown, without a name, to the next
// people who open it (cloud.ts, table kern_signs). No account, no sharing: the tip stays on the device.
const shareable = (t: string) => t.trim().length >= 3 && !/(https?:\/\/|www\.|@|\d{6,})/i.test(t);
const sharing = new WeakSet<Answer>(); // uploads in flight: a quick delete + Undo must not publish the sign twice
function shareSign(a: Answer) {
  const tip = a.r?.tip;
  if (!user || !tip || a.r?.sid || sharing.has(a) || !shareable(tip)) return;
  sharing.add(a);
  cloud.addSign(a.f, a.i, tip).then((id) => {
    sharing.delete(a);
    if (!S.answers.includes(a)) { cloud.removeSign(id).catch(() => { /* row has no name */ }); return; } // deleted meanwhile
    if (a.r && id > 0) { a.r.sid = id; save(); }
  }).catch(() => { sharing.delete(a); /* stays on this device */ });
}
const pend = (): number[] => { try { const v = JSON.parse(localStorage.getItem(PEND) || '[]'); return Array.isArray(v) ? v.filter((n) => Number.isSafeInteger(n) && n > 0).slice(0, 50) : []; } catch { return []; } };
const setPend = (l: number[]) => { try { localStorage.setItem(PEND, JSON.stringify(l.slice(0, 50))); } catch { /* storage blocked */ } };
const flushSigns = () => { if (!user) return; for (const id of pend()) cloud.removeSign(id).then(() => setPend(pend().filter((x) => x !== id))).catch(() => { /* retried on the next sign-in or when back online */ }); };
function unshareSign(a: Answer) {
  const id = a.r?.sid; if (!id) return; // still uploading: shareSign removes it on arrival if the answer is gone
  delete a.r!.sid;
  setPend([...pend(), id]); flushSigns();
}
const kShS = $('kShS');
let signReq = 0;
const renderTrailSigns = (f: string, i: number) => {
  const req = ++signReq;
  const note = (en: string) => { kShS.innerHTML = ''; const p = document.createElement('p'); p.className = 'k-sign-empty'; setT(p, en); kShS.appendChild(p); };
  if (!CLOUD) return note('When people finish this mission, the reviews they leave for you appear here.');
  note('Loading reviews…');
  cloud.signs(f, i).then((list) => {
    if (req !== signReq) return;
    const ok = list.filter((s) => shareable(s.tip));
    if (!ok.length) return note('No reviews on this mission yet. Finish it and leave the first one.');
    kShS.innerHTML = '';
    ok.forEach((s) => {
      const d = document.createElement('div'), q = document.createElement('p'), w = document.createElement('span');
      d.className = 'k-sign'; q.textContent = `“${s.tip}”`; w.className = 'k-l';
      setD(w, `${tr('Someone who finished it')} · ${day(Date.parse(s.at) || Date.now())}`);
      d.append(q, w); kShS.appendChild(d);
    });
  }).catch(() => { if (req === signReq) note("Couldn't load reviews right now."); });
};
const setRfNote = () => setT($('kRfN'), user ? 'Shared without your name with the next people on this trail.'
  : CLOUD ? 'Stays on this device. Log in to share it, without your name, with the next people on this trail.'
  : 'Stays on this device for now.');
// Practice brief (missions.ts): scenario, material to work on, tick-off steps with a progress bar
// (first step pre-ticked), and after submitting a self-check that pays bonus stones.
const NOTE_DEFAULT = 'It stays on this device unless you ask KERN.AI.';
const kShX = $('kShX'), kShH = $('kShH'), kSaved = $('kSaved'), kXSteps = $('kXSteps'), kRfBar = $('kRfBar'), kRfBI = $('kRfBI');
const setX = (el: Element, en: string) => { (el as HTMLElement).dataset.en = en; el.textContent = tr(en); }; // textContent: briefs contain code like <button>
const tick = (host: HTMLElement, en: string, on: boolean, cls: string, change?: () => void) => {
  const d = document.createElement('div');
  d.className = `k-tk ${cls}`; d.tabIndex = 0; d.setAttribute('role', 'checkbox');
  const paint = () => d.setAttribute('aria-checked', String(d.classList.contains('on')));
  d.classList.toggle('on', on); paint(); setX(d, en);
  const flip = () => { d.classList.toggle('on'); paint(); change?.(); };
  d.addEventListener('click', flip);
  d.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  host.appendChild(d);
};
const stepProg = () => {
  const all = kXSteps.children.length, n = kXSteps.querySelectorAll('.on').length;
  $('kXPb').style.width = `${(100 * n) / all}%`; setD($('kXPn'), `${n}/${all}`);
};
// The mission as shown now: the easy wording when "Make it easier" is on, else the full one. Missing easy parts fall back to the full ones.
const variant = (f: string, i: number) => {
  const x = MX[f]?.[i]; if (!x) return null;
  const hp = HELPS[f]?.[i], ez = S.easy ? EASY[f]?.[i] : undefined;
  return { x, brief: ez?.brief ?? x.brief, steps: ez?.steps ?? x.steps, asset: ez?.asset ?? x.asset, ex: ez?.ex ?? hp?.ex ?? '', hints: ez?.hints ?? hp?.hints ?? [] };
};
// The mission picture in the current language (some pictures carry words), with the asset text as its description.
const setPic = () => {
  const im = $<HTMLImageElement>('kXAI'); if (im.hidden) return;
  const src = (isIt() ? im.dataset.it : im.dataset.en) || '';
  if (im.getAttribute('src') !== src) im.src = src;
  im.alt = tr(im.dataset.alt || '').replace(/\n/g, '. ');
};
function renderBrief(f: string, i: number) {
  const v = variant(f, i), x = v?.x;
  kShX.hidden = kShH.hidden = kRfBar.hidden = !v;
  kXSteps.innerHTML = ''; kRfBI.innerHTML = '';
  if (!v || !x) return;
  setX($('kXWho'), x.who); setD($('kXMin'), `~${x.mins} min`);
  const who = $('kXWho'), sp = SPONSORS[`${f}.${i}`]; // a brand mission shows who presents it, in their colour (sponsors.ts)
  who.classList.toggle('brand', !!sp);
  if (sp) { setD(who, `${tr('Brand mission')} · ${tr(sp.name)}`); who.style.setProperty('--brand', sp.color); } else who.style.removeProperty('--brand');
  const bo = boostOf(f), bEl = $('kXBoost');
  bEl.hidden = !(bo && bo.i === i && cur.edit < 0);
  if (!bEl.hidden) setD(bEl, `${boostTxt(bo!.m)} · ${tr('stones multiplied')}`);
  setX($('kXBrief'), v.brief);
  // A visual asset (a photo, a story, a cover) shows as the picture itself. With `only` the text is just its description for a screen reader.
  const pic = x.asset.img, kXAI = $<HTMLImageElement>('kXAI');
  setX($('kXAT'), pic && x.asset.only ? x.asset.title : v.asset.title); setX($('kXAB'), v.asset.body); $('kXAB').classList.toggle('mono', v.asset.mono);
  $('kXAB').hidden = !!(pic && x.asset.only);
  kXAI.hidden = !pic; kXAI.dataset.en = pic ?? ''; kXAI.dataset.it = x.asset.imgIt ?? pic ?? ''; kXAI.dataset.alt = x.asset.body; setPic();
  tick(kXSteps, t2('Read the brief', 'Leggi il brief'), true, 'st', stepProg);
  v.steps.forEach((s) => tick(kXSteps, s, cur.edit >= 0, 'st', stepProg)); // an answer being edited is a finished one: its steps show as done
  stepProg();
  x.bar.forEach((b) => tick(kRfBI, b, false, 'bar'));
  tick(kRfBI, x.twist, false, 'tw');
  // Example, hints, KERN.AI and the easy switch. On the very first mission the example is open and a short guide explains the workflow.
  const first = !S.answers.length;
  hintN = 0; $('kXHints').innerHTML = '';
  $('kXFirst').hidden = !first; $('kXExB').hidden = !(first && v.ex);
  setX($('kXExT'), v.ex); setT($('kXEx'), first ? 'Hide the example' : 'Show an example');
  $('kXEx').setAttribute('aria-expanded', String(!$('kXExB').hidden));
  setT($('kXHint'), 'Need a hint?'); hold($('kXHint'), !v.hints.length);
  setT($('kXEasy'), S.easy ? 'Back to the full version' : 'Make it easier');
  hold($('kXAsk'), false);
}
let hintN = 0;
// Busy or spent buttons are dimmed but stay focusable: a disabled button drops keyboard focus to the page body.
const hold = (b: Element, on: boolean) => b.setAttribute('aria-disabled', String(on));
const held = (b: Element) => b.getAttribute('aria-disabled') === 'true';
$('kXEx').addEventListener('click', () => {
  const b = $('kXExB'); b.hidden = !b.hidden;
  setT($('kXEx'), b.hidden ? 'Show an example' : 'Hide the example');
  $('kXEx').setAttribute('aria-expanded', String(!b.hidden));
});
const nextHint = () => {
  const v = variant(cur.f, cur.i); if (!v || hintN >= v.hints.length) return;
  const p = document.createElement('p'); p.className = 'k-msg k-ai'; setX(p, v.hints[hintN]); $('kXHints').appendChild(p); reveal(p);
  hintN++;
  const b = $('kXHint');
  if (hintN >= v.hints.length) { setT(b, 'No more hints'); hold(b, true); } else setD(b, `${tr('Another hint')} (${hintN}/${v.hints.length})`);
};
$('kXHint').addEventListener('click', nextHint);
$('kXEasy').addEventListener('click', () => { S.easy = !S.easy; save(); renderBrief(cur.f, cur.i); });
// KERN.AI inside the task: reads the mission and what you have written so far, and asks one question. Live when online;
// offline it falls back to a question about your own words, or the "stuck" question of the KERN.AI tab. Hints stay on their own button.
$('kXAsk').addEventListener('click', async () => {
  const btn = $('kXAsk'), v = variant(cur.f, cur.i);
  if (held(btn) || !v) return;
  hold(btn, true);
  track('ask_ai', cur.f, cur.i);
  const draft = kTa.value.trim().slice(0, 400);
  if (HEAVY.test(draft)) { // heavy words in the draft: nothing is sent or echoed, the mission pauses
    const m = document.createElement('p'); m.className = 'k-msg k-ai'; m.textContent = tr(HEAVY_REPLY); $('kXHints').appendChild(m); reveal(m); hold(btn, false); return;
  }
  const p = document.createElement('p'); p.className = 'k-msg k-ai k-typing'; p.innerHTML = typingDots();
  $('kXHints').appendChild(p); reveal(p);
  const f0 = cur.f, i0 = cur.i;
  const reply = await askAI({ mission: { title: FIELDS[cur.f].m[cur.i][1], brief: v.brief }, messages: [{ who: 'me', t: draft ? `My answer so far: ${draft}` : 'I am about to start this mission. Help me begin.' }] });
  if (cur.f !== f0 || cur.i !== i0 || kSheet.hidden) return; // another mission was opened meanwhile
  p.classList.remove('k-typing'); p.textContent = '';
  setLive(!!reply);
  if (reply) p.textContent = reply;
  else p.textContent = draft.length >= 10 ? echo(draft) + tr(pick(Q_MORE[0])) : tr(pick(Q_STUCK)); // never a button that does nothing, and never a hint in disguise
  reveal(p);
  hold(btn, false);
});
// Self-check after submitting: +10 per quality bar met, +25 for the twist. Returns the bonus (not saved here).
const bonus = () => {
  const b = kRfBar.hidden ? 0 : kRfBI.querySelectorAll('.bar.on').length * 10 + kRfBI.querySelectorAll('.tw.on').length * 25;
  S.stones += b; return b;
};
// Habit loop (Hooked: trigger, action, variable reward, investment). The reward is a random drop after each finished
// mission (loot.ts), the investment is the collection of finds and the trail days; nothing here punishes a missed day.
const DAY = 864e5, dayN = (t: number) => Math.floor((t - new Date(t).getTimezoneOffset() * 6e4) / DAY);
const relicsOwned = () => RELICS.filter((r) => S.answers.some((a) => a.d === r.id) || S.habit.l.some((e) => e[1] === r.id)).map((r) => r.id);
const dropStreak = () => { let n = 0; for (const a of [...S.answers].sort((x, y) => y.at - x.at)) { if (a.d) break; n++; } return n; };
// Trail days: days in a row with a finished mission or a habit check-in. One missed day is forgiven (a rest day); two in a row end it.
const streakOf = (list: number[]) => {
  const days = [...new Set(list)].sort((a, b) => b - a);
  if (!days.length || dayN(Date.now()) - days[0] > 2) return 0;
  let n = 1;
  for (let i = 1; i < days.length && days[i - 1] - days[i] <= 2; i++) n++;
  return n;
};
const trailDays = () => streakOf([...S.answers.map((a) => dayN(a.at)), ...S.habit.l.map((e) => e[0])]);
const BOOSTS = false; // cut with the points: no daily x2 / x3 on a mission
// Daily boost: each day, each field gets a random answer (about 2 days in 3) that pays x2 or x3. Seeded by the date, so it is the
// same on every device but cannot be guessed ahead; done missions can be replayed for it.
const boostOf = (f: string, d = dayN(Date.now())): { i: number; m: number } | null => {
  if (!BOOSTS) return null;
  let h = Math.imul(d ^ [...f].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7), 2654435761) >>> 0;
  h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13;
  return h % 100 < 35 ? null : { i: base(f) + (h >>> 8) % PER_ROUND, m: (h >>> 16) % 10 < 3 ? 3 : 2 }; // always inside the round in play, so it is on screen
};
const boostTxt = (m: number) => `×${m} ${tr('today')}`;
const kFinds = $('kFinds');
const ICON = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
function renderLoot() {
  const own = relicsOwned();
  setD($('kFN'), `${own.length}/${RELICS.length}`);
  kFinds.innerHTML = '';
  RELICS.forEach((r) => {
    const got = own.includes(r.id), el = document.createElement('div'), b = document.createElement('b');
    el.className = 'k-find' + (got ? ' got' : '');
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', got ? tr(r.name) : tr('Not found yet'));
    el.innerHTML = got ? ICON(r.d) : '<span aria-hidden="true">?</span>';
    b.textContent = got ? tr(r.name) : '';
    el.appendChild(b); kFinds.appendChild(el);
  });
  const n = trailDays(), st = $('kStreak');
  st.hidden = !n;
  if (n) setD($('kStreakT'), `${n} ${tr(n === 1 ? 'trail day' : 'trail days')}`);
  renderHabit();
}

// Tiny habits (BJ Fogg): one very small action tied to a cue you already have ("after I have my coffee, I write one sentence").
// A check-in counts as a trail day and sometimes (about 1 in 3) turns up a find, so the reward stays unpredictable.
const STARTERS: Record<string, string[]> = {
  Design: [t2('Sketch one screen for 2 minutes', 'Schizza una schermata per 2 minuti'), t2('Note why one app screen works', 'Annota perché funziona una schermata di un’app')],
  Writing: [t2('Write one sentence', 'Scrivi una frase'), t2('Rewrite one confusing message', 'Riscrivi un messaggio confuso')],
  Code: [t2('Write or fix 5 lines of code', 'Scrivi o correggi 5 righe di codice'), t2('Read one small piece of code', 'Leggi un piccolo pezzo di codice')],
  Video: [t2('Film 5 seconds of something', 'Filma 5 secondi di qualcosa'), t2('Note the first shot of one video', 'Annota la prima inquadratura di un video')],
  Selling: [t2('Ask one person what they need', 'Chiedi a una persona di cosa ha bisogno'), t2('Rewrite one pitch in one line', 'Riscrivi una proposta in una riga')],
  Music: [t2('Hum or tap a rhythm for 30 seconds', 'Canticchia o batti un ritmo per 30 secondi'), t2('Name one instrument in a song', 'Nomina uno strumento in una canzone')],
  Prompting: [t2('Add one detail to a prompt you used', 'Aggiungi un dettaglio a un prompt che hai usato'), t2('Ask an AI what it is unsure about', 'Chiedi a un’AI di cosa non è sicura')],
};
const CUES = [t2('wake up', 'mi sveglio'), t2('have my coffee', 'bevo il caffè'), t2('finish lunch', 'finisco di pranzare'), t2('get home', 'torno a casa'), t2('brush my teeth', 'mi lavo i denti')];
// A habit or cue picked from the chips is saved as the words on the chip at that moment (English or Italian): show it in the current language. Words typed by hand stay as typed.
const HB_EN = new Map([...Object.values(STARTERS).flat(), ...CUES].flatMap((en): [string, string][] => [[en, en], [IT[en], en]]));
const hbText = (s: string) => tr(HB_EN.get(s) ?? s);
const HB_MSG = [t2('That counts. Small is the point.', 'Conta. Il bello è essere piccoli.'), t2('Done. Your future self noticed.', 'Fatto. Il tuo io futuro se n’è accorto.'), t2('Again tomorrow, same cue. That is the whole trick.', 'Di nuovo domani, stesso segnale. È tutto qui il trucco.'), t2('Easy on purpose. Keep it that way.', 'Facile di proposito. Resta così.'), t2('One more day on the trail.', 'Un altro giorno sulla traccia.')];
const kHbSet = $('kHbSet'), kHbRun = $('kHbRun'), kHbT = $<HTMLInputElement>('kHbT'), kHbC = $<HTMLInputElement>('kHbC');
const chip = (host: Element, text: string, on: () => void) => {
  const c = document.createElement('span'); c.setAttribute('role', 'button'); c.tabIndex = 0; c.textContent = tr(text);
  c.addEventListener('click', on); c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); on(); } });
  host.appendChild(c);
};
let hbEditing = false;
function renderHabit() {
  const has = !!S.habit.t && !hbEditing;
  kHbSet.hidden = has; kHbRun.hidden = !has;
  if (!has) {
    const pick = $('kHbPick'), cues = $('kHbCues'); pick.innerHTML = ''; cues.innerHTML = '';
    (STARTERS[S.field] || STARTERS.Writing).forEach((t) => chip(pick, t, () => { kHbT.value = tr(t); }));
    CUES.forEach((c) => chip(cues, c, () => { kHbC.value = tr(c); }));
    return;
  }
  setD($('kHbName'), hbText(S.habit.t));
  setD($('kHbCue'), S.habit.c ? `${tr('After I')} ${hbText(S.habit.c)}` : tr('Pick a cue you already have.'));
  const today = dayN(Date.now()), done = new Set(S.habit.l.map((e) => e[0])), dots = $('kHbDots');
  dots.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const d = document.createElement('i'), day = today - i;
    d.className = (done.has(day) ? 'on' : '') + (i === 0 ? ' now' : '');
    d.setAttribute('role', 'img'); d.setAttribute('aria-label', `${new Date(day * DAY + 12 * 36e5).toLocaleDateString(isIt() ? 'it-IT' : 'en-GB', { weekday: 'long', timeZone: 'UTC' })}: ${done.has(day) ? tr('done') : tr('not yet')}`);
    dots.appendChild(d);
  }
  const doneToday = done.has(today), btn = $<HTMLButtonElement>('kHbDo');
  btn.setAttribute('aria-disabled', String(doneToday)); setT(btn, doneToday ? 'Done today' : 'I did it');
  const n = streakOf(S.habit.l.map((e) => e[0]));
  setD($('kHbN'), n ? `${n} ${tr(n === 1 ? 'day' : 'days')}` : '');
}
$('kHbSave').addEventListener('click', () => {
  const t = kHbT.value.trim();
  if (!t) { say('Pick or write your tiny habit first.'); kHbT.focus(); return; }
  S.habit.t = t.slice(0, 60); S.habit.c = kHbC.value.trim().slice(0, 60); hbEditing = false; save(); renderHabit();
  land($('kHbName')); // the form this button sat in is gone: focus the habit that replaced it
  say('Habit set. Make it so small you cannot fail.');
});
$('kHbEdit').addEventListener('click', () => { kHbT.value = hbText(S.habit.t); kHbC.value = hbText(S.habit.c); hbEditing = true; renderHabit(); land(kHbSet.querySelector<HTMLElement>('h5')!); }); // the old habit stays saved until the new one is
$('kHbDo').addEventListener('click', () => {
  const today = dayN(Date.now());
  if (S.habit.l.some((e) => e[0] === today)) return;
  const left = RELICS.filter((r) => !relicsOwned().includes(r.id));
  const find = left.length && Math.random() < 0.33 ? left[Math.floor(Math.random() * left.length)].id : '';
  S.habit.l = [...S.habit.l, [today, find] as [number, string]].slice(-90);
  save(); renderLoot(); setLvl(); renderBadges();
  if ('vibrate' in navigator) navigator.vibrate(find ? [20, 30, 40] : [14]);
  if (find) { const d: Drop = { tier: 'relic', id: find, stones: 0 }; openSheetEl(kSheet, $('kDrOk')); showDrop(d, 0); }
  else setD($('kHbMsg'), tr(HB_MSG[Math.floor(Math.random() * HB_MSG.length)]));
});
const DROP_T: Record<string, string> = { spark: t2('A spark', 'Una scintilla'), gem: t2('A gem', 'Una gemma'), relic: t2('A find!', 'Un ritrovamento!'), jackpot: t2('Jackpot', 'Jackpot') };
const kShD = $('kShD'), kDrOk = $('kDrOk'), kDrNx = $('kDrNx');
const DEFS = '<defs><linearGradient id="kg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
const hl = (d: string) => `<path d="${d}" fill="url(#kg)"/>`;
const dropArt = (d: Drop) => {
  const rel = RELICS.find((r) => r.id === d.id);
  if (rel) return `<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring" cx="60" cy="60" r="48"/><circle class="ring2" cx="60" cy="60" r="38"/><g transform="translate(24 24) scale(3)"><path class="ic" d="${rel.d}"/></g></svg>`;
  if (d.tier === 'gem') { const g = 'M30 44l12-18h36l12 18-30 52z'; return `<svg viewBox="0 0 120 120" aria-hidden="true">${DEFS}<path class="a" d="${g}"/><path class="c" d="M30 44h60M42 26l18 18 18-18M60 44l-18 52M60 44l18 52"/>${hl(g)}</svg>`; }
  if (d.tier === 'jackpot') {
    const star = 'M60 18l11 25 27 3-20 18 6 27-24-14-24 14 6-27-20-18 27-3z';
    const rays = Array.from({ length: 12 }, (_, i) => `<line x1="60" y1="60" x2="${(60 + 58 * Math.cos((i * Math.PI) / 6)).toFixed(1)}" y2="${(60 + 58 * Math.sin((i * Math.PI) / 6)).toFixed(1)}"/>`).join('');
    return `<svg viewBox="0 0 120 120" aria-hidden="true">${DEFS}<g class="rays">${rays}</g><path class="a" d="${star}"/>${hl(star)}</svg>`;
  }
  const sp = 'M60 10l9 33 33 9-33 9-9 33-9-33-33-9 33-9z';
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${DEFS}<path class="a" d="${sp}"/>${hl(sp)}<circle class="b" cx="96" cy="24" r="4"/><circle class="b" cx="22" cy="94" r="3"/></svg>`;
};
// Reveal screen: appears the moment the reflection is saved, under a second to read, one tap to continue.
function showDrop(d: Drop, side: number, withNext = false) {
  const rel = RELICS.find((r) => r.id === d.id);
  kSheet.classList.add('drop'); kShA.hidden = true; kShR.hidden = true; kShD.hidden = false; kShD.dataset.tier = d.tier;
  $('kDrCoop').hidden = true; $('kDrCoN').hidden = true;
  setT(kDrOk, 'Keep going'); delete kDrOk.dataset.next; kDrNx.hidden = true; kDrNx.textContent = ''; // aria-describedby reads hidden text too
  if (withNext) offerNext(); // before the focus below, so the button is announced with its final label
  $('kDrArt').innerHTML = dropArt(d);
  setT($('kDrT'), DROP_T[d.tier]);
  if (rel) setD($('kDrN'), `${tr(rel.name)} · ${relicsOwned().length + 0}/${RELICS.length}`); else setD($('kDrN'), `+${d.stones} ${isIt() ? 'pietre' : 'stones'}`);
  setD($('kDrS'), rel ? `${d.stones ? `+${d.stones} ${isIt() ? 'pietre' : 'stones'}` : ''}${side ? ` · +${side} bonus` : ''}` : side ? `+${side} bonus` : '');
  const bits = $('kDrBits'); bits.innerHTML = '';
  if (!still) for (let i = 0; i < 18; i++) { const p = document.createElement('i'); p.style.setProperty('--a', `${(360 / 18) * i + Math.random() * 12}deg`); p.style.setProperty('--r', `${70 + Math.random() * 60}px`); bits.appendChild(p); }
  if ('vibrate' in navigator) navigator.vibrate(d.tier === 'jackpot' ? [30, 40, 30, 40, 60] : d.tier === 'relic' ? [20, 30, 40] : [18]);
  kDrOk.focus();
}
// Momentum: right after a reward the button leads straight into the next open mission, and says which one.
function offerNext() {
  const nx = nextSpot(S.field, S.fields.filter((f) => FIELDS[f]), doneIn, total()), m = nx && FIELDS[nx.f].m[nx.i];
  // Finishing a round lands on Home, where the Kern card is the payoff: never chain out of a completed round.
  const start = Math.floor(cur.i / PER_ROUND) * PER_ROUND, d = doneIn(cur.f);
  if (!nx || !m || [0, 1, 2].every((k) => d.has(start + k))) return;
  const mins = MX[nx.f]?.[nx.i]?.mins;
  kDrOk.dataset.next = `${nx.f}.${nx.i}`; setT(kDrOk, 'Next mission');
  setD(kDrNx, `${tr('Next')}: ${tr(m[1])}${mins ? ` · ~${mins} min` : ''}`); kDrNx.hidden = false;
}
kDrOk.addEventListener('click', once(() => {
  const [f, i] = (kDrOk.dataset.next || '').split('.');
  closeSheet(kSheet); setLvl(); renderProgress();
  if (!FIELDS[f]) return;
  if (f !== S.field) switchField(f);
  openAnswer(f, Number(i));
}));
const fillSheet = (f: string, i: number) => {
  kSheet.classList.remove('drop'); kShD.hidden = true;
  const m = FIELDS[f].m[i];
  setT($('kShL'), m[0]); setT($('kShT'), m[1]);
  setT($('kShQ'), FIELDS[f].qs[i % FIELDS[f].qs.length]);
  renderBrief(f, i);
  kShA.hidden = false; kShR.hidden = true; setT(kSaved, NOTE_DEFAULT); kSaved.hidden = false;
  renderTrailSigns(f, i);
  $('kCoopHint').hidden = !isCoop(f, i);
};
// No clock on a mission: "~3 min" is a soft estimate shown by renderBrief, never a countdown or a speed bonus (quality over speed).
const openAnswer = (f: string, i: number, dare = false) => {
  cur = { f, i, dare, edit: -1 };
  track('open', f, i);
  fillSheet(f, i); setT($('kSub'), 'Submit answer');
  kTa.value = S.drafts[dKey()] || '';
  const title = $('kShT'); title.tabIndex = -1; // focus the title, not the answer box: the brief stays in view and no keyboard pops up before it is read
  openSheetEl(kSheet, title);
};
function openEdit(idx: number) {
  const a = S.answers[idx]; if (!a) return;
  cur = { f: a.f, i: a.i, dare: false, edit: idx };
  fillSheet(a.f, a.i); setT($('kSub'), 'Save changes');
  kTa.value = a.t;
  openSheetEl(kSheet, kTa);
  kTa.scrollIntoView({ block: 'nearest' }); // editing: the answer box is what matters, so bring it into view
}
const groups = ['kRfE', 'kRfA'].map((id) => $(id));
groups.forEach((g) => g.querySelectorAll<HTMLElement>('[data-v]').forEach((c) => {
  const pick = () => { g.querySelectorAll<HTMLElement>('[data-v]').forEach((o) => { o.classList.toggle('sel', o === c); o.setAttribute('aria-pressed', String(o === c)); }); g.dataset.val = c.dataset.v!; };
  c.addEventListener('click', pick);
  c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
}));
kAdd.addEventListener('click', () => { if (kAdd.dataset.kAns === 'card') goTab('yourkern'); else openAnswer(S.field, Number(kAdd.dataset.kAns)); });
kAdd2.addEventListener('click', () => openAnswer(S.field, Number(kAdd2.dataset.kAns)));
[0, 1, 2].forEach((i) => $('kMR' + i).addEventListener('click', () => openAnswer(S.field, viewBase() + i)));
$('kPeek').addEventListener('click', () => { peek = peeking() ? '' : peekKey(); renderHome(); });
$('kCancel').addEventListener('click', () => closeSheet(kSheet));
$('kSub').addEventListener('click', once(() => {
  const t = kTa.value.trim();
  if (!t) { say('Write something first.'); kTa.focus(); return; }
  clearTimeout(dT);
  if (cur.edit >= 0) {
    const a = S.answers[cur.edit];
    if (a && a.f === cur.f && a.i === cur.i) { a.t = t.slice(0, 2000); a.ed = stamp(ver(a)); }
    const kept = save(); closeSheet(kSheet); renderProgress(); say(kept ? 'Answer updated.' : UNSAVED);
    return;
  }
  const na: Answer = { f: cur.f, i: cur.i, t: t.slice(0, 2000), at: Date.now() };
  lastBoost = boostOf(cur.f); // before the push: an answer that completes a round moves base(), and with it the boost
  S.answers.push(na); lastAns = na;
  track('answer', cur.f, cur.i);
  delete S.drafts[dKey()];
  S.stones += 50;
  if (!save()) say(UNSAVED); // the reflection step comes next: do not let it look like the answer is safe
  if (cur.dare) { dare = null; renderDare(); }
  setLvl(); renderProgress();
  groups.forEach((g) => { g.dataset.val = ''; g.querySelectorAll('[data-v]').forEach((o) => { o.classList.remove('sel'); o.setAttribute('aria-pressed', 'false'); }); });
  $<HTMLInputElement>('kRfH').value = ''; $<HTMLInputElement>('kRfT').value = '';
  kShA.hidden = true; kShR.hidden = false; setRfNote();
  $('kRfShort').hidden = na.t.length >= 20; // say why a short answer earns no bonus, instead of silently skipping it
  groups[0].querySelector<HTMLElement>('[data-v]')!.focus();
}));
$('kRfOk').addEventListener('click', once(() => {
  const r = cleanR({ e: groups[0].dataset.val, again: groups[1].dataset.val, hard: $<HTMLInputElement>('kRfH').value, tip: $<HTMLInputElement>('kRfT').value });
  if (r) track('reflect', cur.f, cur.i);
  finish(r);
}));
$('kRfSkip').addEventListener('click', once(() => finish(undefined)));
// Finishing a mission: keep the reflection, then one calm confirmation. No bonus points, combos or random rewards.
function finish(r: Refl | undefined) {
  const a = lastAns && S.answers.includes(lastAns) ? lastAns : undefined;
  if (a) { if (r) a.r = r; a.ed = stamp(ver(a)); }
  const kept = save(); if (a && r) shareSign(a);
  showDone();
  if (!kept) say(UNSAVED);
}
// The screen after a finished mission: where you are in this field, and one button to go on.
function showDone() {
  const f = cur.f, it = isIt();
  kSheet.classList.add('drop'); kShA.hidden = true; kShR.hidden = true; kShD.hidden = false; kShD.dataset.tier = 'done';
  setT(kDrOk, 'Keep going'); delete kDrOk.dataset.next; kDrNx.hidden = true; kDrNx.textContent = ''; // aria-describedby reads hidden text too
  offerNext(); // before the focus below, so the button is announced with its final label
  $('kDrArt').innerHTML = icon('done', 'k-i k-done-i');
  const co = isCoop(cur.f, cur.i) && !!lastAns && S.answers.includes(lastAns); // a co-op mission can go on to a friend from here
  $('kDrCoop').hidden = !co; $('kDrCoN').hidden = !co;
  setT($('kDrT'), 'Done.');
  setD($('kDrN'), it ? `${doneIn(f).size} su ${total(f)} fatte in ${tr(f)}` : `${doneIn(f).size} of ${total(f)} done in ${tr(f)}`);
  setD($('kDrS'), it ? 'Salvata su questo dispositivo.' : 'Saved on this device.');
  kDrOk.focus();
}

// Reward preview: shows what winning feels like without changing your stones.
const kRw = $('kReward'), kWin = $('kWin'), kConf = $('kConf'), kGain = $('kGain'), kRU = $('kRU');
const closeWin = () => { kRw.hidden = true; syncInert(); kWin.focus(); };
kWin.addEventListener('click', () => {
  const gain = 200, before = rankIdx(S.stones), after = rankIdx(S.stones + gain);
  kRU.hidden = after === before;
  $('kRU2').textContent = rn(RANKS[after][0]);
  kRw.hidden = false;
  kConf.innerHTML = '';
  if (still) kGain.textContent = '+' + gain;
  else {
    const cols = ['var(--acc)', 'var(--gold)', 'var(--ai)', 'var(--fg)'];
    for (let i = 0; i < 34; i++) {
      const s = document.createElement('span');
      s.style.cssText = `--l:${Math.random() * 100}%;--c:${cols[i % 4]};--x:${(Math.random() - .5) * 160}px;--r:${Math.random() * 720 - 360}deg;--d:${1.6 + Math.random() * 1.4}s;--dl:${Math.random() * .5}s`;
      if (i % 3 === 0) s.style.borderRadius = '50%';
      kConf.appendChild(s);
    }
    const t0 = performance.now();
    const step = (t: number) => { const p = Math.min((t - t0) / 900, 1); kGain.textContent = '+' + Math.round(gain * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  if ('vibrate' in navigator) navigator.vibrate(30);
  $('kRwOk').focus();
});
$('kRwOk').addEventListener('click', closeWin);
kRw.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeWin(); } });

// "A first guess" feedback
const fb = $('kFb');
const GUESSES = [...kScr.querySelectorAll<HTMLElement>('[data-k-msg]')].map((b) => b.dataset.kMsg!);
kScr.querySelectorAll<HTMLElement>('[data-k-msg]').forEach((b) => b.addEventListener('click', () => { S.guess = b.dataset.kMsg!; save(); fb.dataset.src = S.guess; fb.textContent = tr(S.guess); }));
if (GUESSES.includes(S.guess)) fb.dataset.src = S.guess;

// Profile (local only) and onboarding
const kLogin = $('kLogin'), kStart = $('kStart'), kS1 = $('kS1'), kS2 = $('kS2');
const kNmI = $<HTMLInputElement>('kNmI'), kAge = $<HTMLInputElement>('kAge'), kErr = $('kErr'), kLog = $('kLog');
// Interests: pick one or more fields to explore. You start in the current one if you keep it, else the first picked.
let picks: string[] = [...S.fields];
const tiles = kStart.querySelectorAll<HTMLElement>('#kPick [data-f]');
const markPick = () => {
  tiles.forEach((o) => { const on = picks.includes(o.dataset.f!); o.classList.toggle('sel', on); o.setAttribute('aria-pressed', String(on)); });
  $<HTMLButtonElement>('kGo').disabled = !picks.length;
};
let pickerFromSettings = false; // opened from Settings (else from "+ Add"): where focus goes back to
const openStart = (step2 = false, fromSettings = false) => {
  pickerFromSettings = fromSettings;
  if (S.onboarded) picks = [...S.fields];
  setT($('kGo'), S.onboarded ? 'Save interests' : 'Start my first mission');
  setT($('kS2K'), S.onboarded ? 'Your interests' : "Good. Let's find out."); // "Good. Let's find out." answers "I don't know", which an existing user never tapped
  $('kPickX').hidden = !S.onboarded; // reopened from "+ Add" or Settings: there must be a way out
  kStart.setAttribute('aria-labelledby', step2 ? 'kS2H' : 'kS1H');
  kS1.hidden = step2; kS2.hidden = !step2; markPick(); kStart.classList.add('on');
  syncInert(); // Settings may still have left the screen inert: a focus() before this would be refused and land on the page body
  if (S.onboarded) (step2 ? document.querySelector<HTMLElement>('#kPick .k-tile') : $('kIdk'))?.focus({ preventScroll: true });
};
const closePicker = () => { // leave the interests screen without changing anything
  if (vtBusy) return;
  picks = [...S.fields]; kStart.classList.remove('on'); syncInert();
  (pickerFromSettings ? $('kAv') : kScr.querySelector<HTMLElement>('.k-fadd') ?? kAdd).focus({ preventScroll: true });
};
// The avatar shows the first whole letter, digit or emoji of the name, else K.
const renderMe = () => { $('kAv').textContent = ([...S.name].find((c) => /[\p{L}\p{N}\p{Extended_Pictographic}]/u.test(c)) ?? 'K').toUpperCase(); };
// Login screen modes: 'up' create account, 'in' log in, 'guest' local-only profile.
// Without Supabase keys only 'guest' exists and the screen looks like before.
type Mode = 'guest' | 'up' | 'in';
let mode: Mode = CLOUD ? 'up' : 'guest';
const kEm = $<HTMLInputElement>('kEm'), kPw = $<HTMLInputElement>('kPw'), kOk = $('kOk');
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
// An error that blames fields marks them invalid, and goes away by itself once they are right.
let blamed: HTMLInputElement[] = [];
const hideErr = () => { kErr.hidden = true; blamed.forEach((f) => f.removeAttribute('aria-invalid')); blamed = []; };
const fail = (en: string, ...bad: HTMLInputElement[]) => { hideErr(); setT(kErr, en); kErr.hidden = false; kOk.hidden = true; blamed = bad; bad.forEach((f) => f.setAttribute('aria-invalid', 'true')); };
const note = (en: string) => { setT(kOk, en); kOk.hidden = false; hideErr(); };
const right = (f: HTMLInputElement) => (f === kNmI ? !!cleanName(f.value.trim()).trim() : f === kEm ? emailOk(f.value.trim().toLowerCase()) : f === kPw ? f.value.length >= 8 : f.checked);
const settle = () => {
  if (!blamed.length) return;
  blamed.filter(right).forEach((f) => f.removeAttribute('aria-invalid'));
  blamed = blamed.filter((f) => !right(f));
  if (!blamed.length) kErr.hidden = true;
};
[kNmI, kEm, kPw].forEach((f) => f.addEventListener('input', settle));
kAge.addEventListener('change', settle);
function setMode(m: Mode) {
  mode = m;
  pressed('mode', m);
  $('kAuthSeg').hidden = !CLOUD;
  $('kFName').hidden = m === 'in';
  $('kFEmail').hidden = m === 'guest'; $('kFPw').hidden = m === 'guest';
  $('kFAge').hidden = m === 'in';
  kPw.autocomplete = m === 'in' ? 'current-password' : 'new-password';
  $('kForgot').hidden = m !== 'in';
  $('kGuest').hidden = !CLOUD || m === 'guest';
  setT($('kGuest'), S.name ? 'Not now' : 'Continue without an account');
  $('kNoteLocal').hidden = m !== 'guest'; $('kNoteCloud').hidden = m === 'guest';
  setT(kLog, m === 'up' ? 'Create account' : m === 'in' ? 'Log in' : 'Start');
  hideErr(); kOk.hidden = true;
}
document.querySelectorAll<HTMLElement>('[data-k-mode]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.kMode === 'in' ? 'in' : 'up')));
$('kGuest').addEventListener('click', () => { if (S.name) { kLogin.classList.remove('on'); return; } setMode('guest'); });
let authBusy = false;
$('kProf').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (authBusy) return;
  const n = cleanName(kNmI.value.trim()).trim(), em = kEm.value.trim().toLowerCase(), pw = kPw.value;
  if (mode === 'guest') {
    if (!n || !kAge.checked) { fail('Add your name and confirm your age to continue.', ...[...(n ? [] : [kNmI]), ...(kAge.checked ? [] : [kAge])]); (n ? kAge : kNmI).focus(); return; }
    hideErr(); kLog.classList.add('busy');
    window.setTimeout(() => { S.name = n; save(); renderMe(); renderHome(); kLog.classList.remove('busy'); kLogin.classList.remove('on'); if (S.onboarded) arrive(); else openStart(); }, still ? 0 : 600);
    return;
  }
  if (mode === 'up' && !n) { fail('Add your name.', kNmI); kNmI.focus(); return; }
  if (!emailOk(em)) { fail('Enter a valid email.', kEm); kEm.focus(); return; }
  if (pw.length < 8) { fail('Use a longer password: at least 8 characters.', kPw); kPw.focus(); return; }
  if (mode === 'up' && !kAge.checked) { fail('Confirm you are 18 or older.', kAge); kAge.focus(); return; }
  authBusy = true; kLog.classList.add('busy');
  try {
    if (mode === 'up') {
      const r = await cloud.signUp(em, pw, n);
      if (!S.name) { S.name = n; save(); renderMe(); }
      if (r.needsConfirm) { setMode('in'); kEm.value = em; note('Check your email to confirm your account, then log in. Already have one? Just log in.'); }
    } else await cloud.signIn(em, pw);
    kPw.value = '';
  } catch (err) { fail(cloud.why(err)); }
  finally { authBusy = false; kLog.classList.remove('busy'); }
});
$('kForgot').addEventListener('click', async () => {
  const em = kEm.value.trim().toLowerCase();
  if (!emailOk(em)) { fail('Enter your email first.', kEm); kEm.focus(); return; }
  try { await cloud.resetPassword(em); note('If an account exists for this email, we sent a reset link.'); } catch (err) { fail(cloud.why(err)); }
});

// Account state from Supabase: first sign-in on a device merges the synced trail with the local one.
function renderAcct() {
  $('kAcct').hidden = !CLOUD;
  if (!CLOUD) return;
  setD($('kAcctE'), user ? `${user.email} · ${tr(syncOk ? 'synced' : 'sync paused')}` : tr('Not signed in · your trail is only on this device'));
  $('kAcctUp').hidden = !!user; $('kLogout').hidden = !user;
  $('kDelAcc').hidden = !user; $('kDel').hidden = !!user;
}
// An email link that could not sign in here (opened on another device, expired or already used): say so, tidy the URL.
function linkNote() {
  const p = new URLSearchParams(location.search.slice(1) + '&' + location.hash.slice(1));
  if (!p.has('code') && !p.has('error_description')) return;
  history.replaceState(null, '', location.pathname);
  setMode('in'); kStart.classList.remove('on'); kLogin.classList.add('on'); // the link is about logging in: that screen goes on top
  note(p.has('code') ? 'Open the link on the device where you asked for it, or log in here.' : 'That link has expired or was already used. Log in, or ask for a new one.');
}
const onUser = async (u: cloud.User | null, ev: string) => {
  if (ev === 'PASSWORD_RECOVERY' && $('kPwS').hidden) openSheetEl($('kPwS'), $('kPwN'));
  if (!u) { user = null; renderAcct(); if (ev === 'INITIAL_SESSION') linkNote(); return; }
  if (user && user.id === u.id) { user = u; renderAcct(); return; }
  user = u; pulled = false;
  try { const remote = await cloud.pull(u.id); if (remote) mergeIn(remote); syncOk = true; pulled = true; }
  catch { syncOk = false; say("Couldn't load your synced trail. We'll try again."); }
  if (!S.name) S.name = cleanName(u.name);
  save(); renderMe(); applyField(false); setLang(S.lang); renderAcct(); flushSigns();
  if (kLogin.classList.contains('on')) { kLogin.classList.remove('on'); if (!S.onboarded) openStart(); else arrive(); }
};
if (CLOUD) void cloud.onAuth(onUser).catch(() => { /* SDK failed to load: stay local-only */ });
$('kAcctUp').addEventListener('click', () => { closeSheet(kSet); setMode('up'); kNmI.value = S.name; kLogin.classList.add('on'); kEm.focus(); });
$('kLogout').addEventListener('click', async () => {
  if (!confirm(tr('Log out? Your trail stays in your account and is removed from this device.'))) return;
  clearTimeout(pushT);
  if (user && pulled) { try { await cloud.push(user.id, snapshot()); } catch { /* best effort before leaving */ } }
  try { await cloud.signOut(); } catch { /* still clear the device */ }
  await eraseStats(); // the next person on this device is asked again
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ } wipeExtras();
  location.replace('/');
});
$('kDelAcc').addEventListener('click', async () => {
  if (!confirm(tr('Delete your account and your whole trail? This cannot be undone.'))) return;
  clearTimeout(pushT); // a pending sync must not race the deletion
  try { await cloud.deleteAccount(); } catch (err) { say(cloud.why(err)); return; }
  await eraseStats();
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ } wipeExtras(true);
  location.replace('/');
});
const kPwS = $('kPwS');
kPwS.addEventListener('click', (e) => { if (e.target === kPwS) closeSheet(kPwS); });
kPwS.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeSheet(kPwS); } });
$('kPwF').addEventListener('submit', async (e) => {
  e.preventDefault();
  const p = $<HTMLInputElement>('kPwN').value, er = $('kPwErr');
  if (p.length < 8) { setT(er, 'Use a longer password: at least 8 characters.'); er.hidden = false; return; }
  try { await cloud.setPassword(p); $<HTMLInputElement>('kPwN').value = ''; closeSheet(kPwS); say('Password updated.'); }
  catch (err) { setT(er, cloud.why(err)); er.hidden = false; }
});
$('kIdk').addEventListener('click', () => { kS1.hidden = true; kS2.hidden = false; kStart.setAttribute('aria-labelledby', 'kS2H'); land($('kS2H')); });
$('kPickX').addEventListener('click', closePicker);
// First visit: loader > choice > interests > profile (name + 18+, or an account) > missions.
const pop = () => { // the field's object drops into the mission card
  if (still) return;
  const o = $('kNxIc');
  o.classList.remove('arrive'); void o.offsetWidth; o.classList.add('arrive');
};
const landHome = () => land(kScr.querySelector<HTMLElement>('#k-missions h4')!);
const arrive = () => { goTab('missions'); pop(); landHome(); };
const closeStart = () => {
  if (vtBusy) return; // a flight is still playing: ignore the double tap
  const pick = (S.onboarded && picks.includes(S.field) ? S.field : picks[0]) || S.field;
  const changed = pick !== S.field;
  const commit = () => { S.fields = picks.length ? [...picks] : [pick]; S.field = pick; S.onboarded = true; save(); };
  if (!S.name) { // no profile yet: keep the choice, ask who they are, then arrive()
    commit(); applyField(changed);
    kStart.classList.remove('on'); kLogin.classList.add('on'); syncInert(); (mode === 'in' ? kEm : kNmI).focus();
    return;
  }
  const run = () => { commit(); kStart.classList.remove('on'); applyField(changed); goTab('missions'); landHome(); };
  // Shared element: the picked field's object flies from its tile into the mission card.
  const from = kS2.hidden ? null : kStart.querySelector<HTMLElement>(`#kPick [data-f="${pick}"] .k-ti`), to = $('kNxIc');
  if (still || !startVT || !from) return run();
  to.style.viewTransitionName = ''; from.style.viewTransitionName = 'k-hero'; vtBusy = true;
  // vt-hero: the pane joins the page crossfade, so it never paints over the onboarding screen.
  runVT('vt-hero', async () => {
    from.style.viewTransitionName = ''; to.style.viewTransitionName = 'k-hero';
    run(); // vtBusy stays on until the flight has finished (released in `after`)
  }, () => { to.style.viewTransitionName = ''; vtBusy = false; });
};
$('kSkip').addEventListener('click', closeStart);
$('kGo').addEventListener('click', closeStart);
tiles.forEach((c) => c.addEventListener('click', () => {
  const f = c.dataset.f || 'Design';
  picks = picks.includes(f) ? picks.filter((x) => x !== f) : [...picks, f];
  markPick();
}));

// Hero card: the object leans toward the pointer (translate only, so it never fights the float animation).
const kNext = $('kNext');
if (!still) {
  kNext.addEventListener('pointermove', (e) => {
    const r = kNext.getBoundingClientRect();
    kNext.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    kNext.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  kNext.addEventListener('pointerleave', () => { kNext.style.removeProperty('--tx'); kNext.style.removeProperty('--ty'); });
}

// Clipboard with a fallback for browsers that block the async API (older iOS, http on LAN).
const copy = async (text: string) => {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* try the legacy path */ }
  const t = document.createElement('textarea');
  t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;opacity:0';
  document.body.appendChild(t); t.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  t.remove();
  return ok;
};
const LINKS: Record<string, () => string> = {
  app: () => `${location.origin}/`,
  dare: () => `${location.origin}/?dare=${encodeURIComponent(S.field)}.0`,
};
kScr.querySelectorAll<HTMLElement>('[data-k-copy]').forEach((b) => b.addEventListener('click', async () => {
  const url = (LINKS[b.dataset.kCopy!] || LINKS.app)();
  if (b.dataset.kCopy === 'dare') { markDared(); track('share'); }
  if (!(await copy(url))) { say(url); return; }
  say('Link copied.');
  b.dataset.orig ??= b.dataset.en!; // the first label, so a second tap cannot make "Copied" the label for good
  const en = b.dataset.orig;
  setT(b, 'Copied'); b.classList.add('ok');
  clearTimeout(Number(b.dataset.t)); b.dataset.t = String(window.setTimeout(() => { setT(b, en); b.classList.remove('ok'); }, 1600));
}));

function markDared() { if (!S.dared) { S.dared = true; save(); renderBadges(); } }
// Save a generated file (export, calendar reminder) through a temporary link.
const download = (content: BlobPart, name: string, type: string) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

// Share: native share sheet on phones, clipboard or download elsewhere.
const shareText = async (title: string, text: string, url: string | undefined, copied: string) => {
  if (navigator.share) {
    try { await navigator.share(url ? { title, text, url } : { title, text }); return; }
    catch (e) { if ((e as DOMException).name === 'AbortError') return; }
  }
  if (await copy(url ? `${text} ${url}` : text)) say(copied); else say(url || text.slice(0, 120));
};
// Kern card as a 1080x1350 image for stories and chats.
const cardImage = async (): Promise<Blob | null> => {
  try { await document.fonts.ready; } catch { /* fonts optional */ }
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
  const x = c.getContext('2d'); if (!x) return null;
  const D = "'Bricolage Grotesque Variable', sans-serif", B = "'Inter Tight Variable', sans-serif";
  x.fillStyle = '#0F140E'; x.fillRect(0, 0, 1080, 1350);
  const g = x.createRadialGradient(920, 120, 0, 920, 120, 760); g.addColorStop(0, 'rgba(201,242,74,.28)'); g.addColorStop(1, 'rgba(201,242,74,0)');
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  try { const im = new Image(); im.src = '/img/cairn.webp'; await im.decode(); x.drawImage(im, 680, 60, 340, 340); } catch { /* card works without it */ }
  let wx = 90; // the word moves right when the app icon fits in front of it
  try { const ic = new Image(); ic.src = '/img/mark.webp'; await ic.decode(); x.drawImage(ic, 90, 108, 104, 104); wx = 90 + 104 + 26; } catch { /* the word alone is fine */ }
  x.font = `800 110px ${D}`; x.fillStyle = '#E8E6DA'; x.fillText('kern', wx, 210);
  x.fillStyle = '#C9F24A'; x.fillText('.', wx + x.measureText('kern').width, 210);
  x.font = `500 34px ${B}`; x.fillStyle = '#b4b7a9'; x.fillText($('kCardL').textContent!.toUpperCase().slice(0, 48), 90, 470);
  x.font = `800 92px ${D}`; x.fillStyle = '#E8E6DA';
  let y = 590, line = '';
  for (const w of $('kCardH').textContent!.split(' ')) {
    const t = line ? line + ' ' + w : w;
    if (x.measureText(t).width > 900 && line) { x.fillText(line, 90, y); y += 104; line = w; } else line = t;
  }
  x.fillText(line, 90, y); y += 90;
  x.font = `600 36px ${B}`;
  let cx = 90;
  [...$('kCardC').querySelectorAll('span')].forEach((s) => {
    const t = s.textContent || '', w = x.measureText(t).width + 56;
    x.strokeStyle = '#C9F24A'; x.lineWidth = 3; x.beginPath();
    if (x.roundRect) x.roundRect(cx, y, w, 72, 36); else x.rect(cx, y, w, 72);
    x.stroke(); x.fillStyle = '#E8E6DA'; x.fillText(t, cx + 28, y + 48); cx += w + 18;
  });
  x.font = `700 38px ${B}`; x.fillStyle = '#C9F24A'; x.fillText(`${tr('Find yours at')} ${location.host}`, 90, 1250);
  return new Promise((res) => c.toBlob(res, 'image/png'));
};
let cardBusy = false; // one tap, one download
const shareCard = async () => { if (cardBusy) return; cardBusy = true; try { await shareCardNow(); } finally { window.setTimeout(() => { cardBusy = false; }, 900); } };
const shareCardNow = async () => {
  const blob = await cardImage();
  const text = tr('My KERN so far: {s}').replace('{s}', $('kCardH').textContent || '');
  if (!blob) return shareText('KERN', text, `${location.origin}/`, 'Link copied.');
  const file = new File([blob], 'my-kern-card.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'KERN', text }); return; }
    catch (e) { if ((e as DOMException).name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-kern-card.png'; a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  say('Card saved as an image.');
};
kScr.querySelectorAll<HTMLElement>('[data-k-share]').forEach((b) => b.addEventListener('click', () => {
  track('share'); // counts the tap on Share (card or dare), not whether the person finished sending it
  if (b.dataset.kShare === 'card') { void shareCard(); return; }
  markDared();
  void shareText('KERN', tr('I dare you: {m}. Answer it on KERN.').replace('{m}', tr(F().m[0][1])), `${location.origin}/?dare=${encodeURIComponent(S.field)}.0`, 'Link copied.');
}));

// Pilot: send your trail (answers + reflections) to the KERN team as plain text.
const trailText = () => {
  const it = isIt(), L = [`KERN · ${it ? 'traccia di' : 'trail of'} ${S.name}`, `${it ? 'Campo' : 'Field'}: ${tr(S.field)}`, ''];
  S.answers.forEach((a, k) => {
    L.push(`${k + 1}. ${tr(FIELDS[a.f].m[a.i][1])} (${day(a.at)})`, a.t);
    if (a.r) {
      const p: string[] = [];
      if (a.r.e) p.push(tr(FEEL_EN[a.r.e]));
      if (a.r.again) p.push(`${it ? 'Di nuovo' : 'Again'}: ${tr(AGAIN_EN[a.r.again])}`);
      if (a.r.hard) p.push(`${it ? 'Più difficile' : 'Hardest'}: ${a.r.hard}`);
      if (a.r.tip) p.push(`${it ? 'Recensione' : 'Review'}: ${a.r.tip}`);
      L.push(p.join(' | '));
    }
    L.push('');
  });
  if (S.mine.length) L.push(`KERN.AI: ${S.mine.join(' > ')}`);
  if (!$('kSample').hidden) return L.join('\n');
  L.push(`${it ? 'Prima ipotesi' : 'First guess'}: ${$('kGuess').textContent}`);
  if (S.guess) L.push(`${it ? 'Risposta' : 'Reply'}: ${tr(S.guess)}`);
  return L.join('\n');
};
document.querySelectorAll<HTMLElement>('[data-k-send]').forEach((b) => b.addEventListener('click', () => {
  if (!S.answers.length) { say('Answer a mission first.'); return; }
  void shareText('KERN trail', trailText(), undefined, 'Trail copied. Paste it in a message to the KERN team.');
}));

// Incoming dare link: /?dare=<Field>.<missionIndex>, validated against known missions.
let dare: { f: string; i: number } | null = null;
const dp = new URLSearchParams(location.search).get('dare');
if (dp) {
  const [f, i] = dp.split('.'); const n = Number(i);
  if (!DEMO && FIELDS[f] && Number.isInteger(n) && n >= 0 && n < total(f)) dare = { f, i: n }; // a dare is for the real trail: the sample profile never shows one
  dropParam(new URLSearchParams(location.search), 'dare');
}
function renderDare() { $('kDare').hidden = !dare; if (dare) setT($('kDareT'), FIELDS[dare.f].m[dare.i][1]); }
$('kDareGo').addEventListener('click', () => { if (dare) openAnswer(dare.f, dare.i, true); });

// Co-op with a friend (coop.ts): two missions in every field are finished by two people through links, with no server. A link carries one answer
// after the #; the friend's reply comes back the same way. The pair lives in S.coops, so it survives a reload and syncs with the trail.
function isCoop(f: string, i: number) { return COOP_KEYS.includes(`${f}.${i}`); }
const myName = () => [...cleanName(S.name)].slice(0, MAX_NAME).join('') || (isIt() ? 'Un amico' : 'A friend');
const coopAsk = (f: string, i: number) => tr(ASK[`${f}.${i}`]);
const keepCoops = () => { S.coops = S.coops.slice(-30); };
let coopIn: Coop | null = null, coopNote = '', coopGo = false; // the friend's request waiting to be answered; a one-line notice (and whether to open yourKERN) after a link was opened
function receiveCoopReply(c: Coop) { // someone answered my co-op: keep both halves (coop.ts decides which row it belongs to, or that it is not for me)
  const res = settleReply(S.coops, c, Date.now()), it = isIt(), who = c.m || (it ? 'Un amico' : 'A friend');
  if (res.status === 'stranger') { coopNote = it ? 'Questa risposta non è per una tua missione.' : 'This reply is not for one of your missions.'; return; }
  if (res.status === 'own') { coopNote = it ? 'Questa è la risposta che hai mandato tu.' : 'This is the reply you sent.'; return; }
  if (res.status !== 'same') { S.coops = res.coops; keepCoops(); save(); }
  coopNote = it ? `${who} ha risposto. La trovi in yourKERN.` : `${who} replied. It is in yourKERN.`; coopGo = true;
}
// The link stays in the address bar until the request is answered or dismissed, so a reload, "Open in Safari" from a chat app's browser or a bookmark still finds it.
function dropCoopHash() { if (location.hash.startsWith('#coop=')) try { history.replaceState(null, '', location.pathname.replace(/^\/{2,}/, '/') + location.search); } catch { /* leave the address as it is */ } }
function readCoopLink() {
  const c = decodeCoop(location.hash);
  if (c?.r) { receiveCoopReply(c); dropCoopHash(); } // a reply is kept in the trail at once
  else if (c) coopIn = c;
  else if (location.hash.startsWith('#coop=')) { coopNote = isIt() ? 'Questo link non funziona: chiedi all’amico di rimandarlo.' : 'This link is broken: ask your friend to send it again.'; dropCoopHash(); } // a chat app may cut or add characters to a link
}
readCoopLink();
addEventListener('hashchange', () => { if (location.hash.startsWith('#coop=')) location.reload(); }); // a link opened while KERN is already open changes only the fragment
function sendCoop(a: Answer) { // my answer goes to a friend, with the task they will do
  if (!isCoop(a.f, a.i)) return; // only the 12 co-op missions have a friend's task
  const c: Coop = { v: 1, f: a.f, i: a.i, n: myName(), a: a.t }, mine = clip(a.t, MAX_ANSWER);
  const had = S.coops.find((r) => r.role === 'out' && r.f === a.f && r.i === a.i && r.at === a.at);
  if (had) had.mine = mine; // the answer may have been edited since the last send: the row keeps what goes out now
  else S.coops.push({ role: 'out', f: a.f, i: a.i, at: a.at, with: '', mine, theirs: '' });
  keepCoops(); save(); renderCoops(); track('share');
  const text = tr('{n} wants your take on “{m}”: {ask} Open the link, it takes a minute.').replace('{n}', c.n).replace('{m}', tr(FIELDS[a.f].m[a.i][1])).replace('{ask}', coopAsk(a.f, a.i));
  void shareText('KERN', text, coopUrl(location.origin, c), 'Link copied. Send it to your friend.');
}
function sendCoopReply(r: CoopRec) { // my reply goes back, with the answer it is about, so the first person sees both
  const c: Coop = { v: 1, f: r.f, i: r.i, n: r.with, a: r.theirs, r: r.mine, m: myName() };
  const text = tr('{n} answered “{m}”. Open the link to read it.').replace('{n}', c.m!).replace('{m}', tr(FIELDS[r.f].m[r.i][1]));
  void shareText('KERN', text, coopUrl(location.origin, c), 'Link copied. Send it back to your friend.');
}
function renderCoopIn() { // the card for a friend's request
  const c = coopIn, card = $('kCoop');
  card.hidden = !c;
  if (!c) return;
  const who = c.n || (isIt() ? 'Un amico' : 'A friend');
  setD($('kCoL'), `Co-op · ${who}`); setD($('kCoT'), tr(FIELDS[c.f].m[c.i][1]));
  setD($('kCoQL'), isIt() ? `La risposta di ${who}` : `${who}’s answer`); setD($('kCoQ'), c.a);
  setD($('kCoAsk'), coopAsk(c.f, c.i));
  setT(kScr.querySelector<HTMLElement>('label[for="kCoTa"]')!, 'Your reply'); // the label only a screen reader sees
}
const afterCoopCard = () => land(kScr.querySelector<HTMLElement>('#k-missions h4')!); // the card held the focus and is gone
$('kCoNo').addEventListener('click', () => { coopIn = null; dropCoopHash(); renderCoopIn(); afterCoopCard(); });
$('kCoSelf').addEventListener('click', () => {
  const c = coopIn; if (!c) return;
  if (!S.fields.includes(c.f)) S.fields.push(c.f);
  if (c.f !== S.field) switchField(c.f);
  openAnswer(c.f, c.i);
});
$('kCoSend').addEventListener('click', once(() => {
  const c = coopIn, ta = $<HTMLTextAreaElement>('kCoTa'), t = ta.value.trim();
  if (!c) return;
  if (!t) { say('Write something first.'); ta.focus(); return; }
  const rec: CoopRec = { role: 'in', f: c.f, i: c.i, at: Date.now(), with: c.n, mine: clip(t, MAX_REPLY), theirs: c.a };
  S.coops.push(rec); keepCoops(); save();
  ta.value = ''; coopIn = null; dropCoopHash(); renderCoopIn(); renderCoops(); afterCoopCard();
  sendCoopReply(rec);
}));
$('kDrCoop').addEventListener('click', () => { if (lastAns && S.answers.includes(lastAns)) sendCoop(lastAns); });
function renderCoops() { // yourKERN: every co-op mission answered, sent, or replied to, with both halves once they are in
  const card = $('kCoops'), box = $('kCoopL'), it = isIt();
  const mk = (tag: string, cls = '', text = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  const row = (title: string, status: string, quotes: [string, string][], act?: [string, () => void]) => {
    const r = mk('div', 'k-coopr'); r.append(mk('div', 'k-l', title), mk('p', 'k-coopst', status));
    for (const [who, text] of quotes) { const q = mk('div', 'k-coq'); q.append(mk('div', 'k-l', who), mk('p', '', text)); r.append(q); }
    if (act) { const b = mk('button', 'k-ask-btn', act[0]) as HTMLButtonElement; b.type = 'button'; b.setAttribute('aria-label', `${act[0]}: ${title}`); b.addEventListener('click', act[1]); r.append(b); } // the same two words repeat on every row
    return r;
  };
  const rows: { pri: number; el: HTMLElement }[] = [], used = new Set<CoopRec>(), seen = new Set<string>(), me = tr('You'), unknown = it ? 'Un amico' : 'A friend';
  for (const a of [...S.answers].reverse()) {
    if (!isCoop(a.f, a.i) || seen.has(`${a.f}.${a.i}`)) continue;
    seen.add(`${a.f}.${a.i}`);
    const rec = S.coops.find((r) => r.role === 'out' && r.f === a.f && r.i === a.i && (r.at === a.at || r.mine.trim() === clip(a.t, MAX_ANSWER).trim()));
    if (rec) used.add(rec);
    const friend = rec?.with || (it ? 'un amico' : 'a friend');
    rows.push({ pri: rec?.theirs ? 0 : rec ? 1 : 2, el: row(tr(FIELDS[a.f].m[a.i][1]), !rec ? tr('Not sent yet') : rec.theirs ? (it ? `Fatta con ${friend}` : `Done with ${friend}`) : tr('Sent. Waiting for a reply.'),
      rec?.theirs ? [[me, clip(a.t, MAX_ANSWER)], [friend, rec.theirs]] : [], [tr(rec ? 'Send again' : 'Send to a friend'), () => sendCoop(a)]) });
  }
  for (const r of [...S.coops].reverse()) {
    if (r.role === 'out' && !used.has(r)) rows.push({ pri: r.theirs ? 0 : 1, el: row(tr(FIELDS[r.f].m[r.i][1]), r.theirs ? (it ? `Fatta con ${r.with || 'un amico'}` : `Done with ${r.with || 'a friend'}`) : tr('Sent. Waiting for a reply.'), r.theirs ? [[me, r.mine], [r.with || unknown, r.theirs]] : []) }); // a second friend's reply, or an answer deleted since
    if (r.role === 'in') rows.push({ pri: 0, el: row(tr(FIELDS[r.f].m[r.i][1]), it ? `Hai risposto a ${r.with || 'un amico'}` : `You replied to ${r.with || 'a friend'}`, [[r.with || unknown, r.theirs], [me, r.mine]], [tr('Send again'), () => sendCoopReply(r)]) });
  }
  card.hidden = !rows.length;
  box.replaceChildren(...rows.sort((x, y) => x.pri - y.pri).slice(0, 12).map((x) => x.el)); // finished pairs first, so a reply that just arrived is never past the cut
}

// Settings
// A language switch inside the demo: the sample texts nobody edited follow it (demo.ts), so the trail never reads half in each language.
const rewriteSample = (toIt: boolean) => {
  const sw = (cur: string, pair?: Pair) => swapSample(cur, pair, toIt);
  const idea = (cur: string) => sw(cur, SAMPLE_IDEA.find((p) => p[toIt ? 0 : 1] === cur));
  S.answers = S.answers.map((a) => {
    const s = SAMPLE_ANSWERS.find((x) => x.f === a.f && x.i === a.i);
    if (!s) return a;
    return { ...a, t: sw(a.t, s.t), r: a.r && { ...a.r, ...(a.r.hard !== undefined ? { hard: sw(a.r.hard, s.hard) } : {}), ...(a.r.tip !== undefined ? { tip: sw(a.r.tip, s.tip) } : {}) } };
  });
  S.mine = S.mine.map(idea);
  S.msgs = S.msgs.map((m) => (m.who === 'me' ? { ...m, t: idea(m.t) } : m));
};
const kDesc = document.querySelector('meta[name="description"]'), descEn = kDesc?.getAttribute('content') ?? ''; // the page description follows the language like the title does
const setLang = (l: Lang) => {
  if (DEMO) rewriteSample(l === 'it'); // before the save: the stored demo follows the language too
  S.lang = l; save(); document.documentElement.lang = l;
  if (DEMO) kScr.style.setProperty('--demo-label', JSON.stringify(tr('Demo profile'))); // the tag over every sheet (app.css)
  document.title = tr("KERN · Don't guess your passion. Test it.");
  kDesc?.setAttribute('content', tr(descEn));
  kTxt.forEach((e) => { const en = e.dataset.en; if (!en) return; if (e.classList.contains('k-xb')) e.textContent = tr(en); else e.innerHTML = tr(en); });
  for (const page of ['privacy', 'terms']) document.querySelectorAll<HTMLAnchorElement>(`a[href^="/${page}/"]`).forEach((a) => a.setAttribute('href', `/${page}/${l === 'it' ? '#it' : ''}`)); // after the texts above: they bring their own links back
  document.querySelectorAll<HTMLElement>('[aria-label]').forEach((e) => { const en = (e.dataset.enLabel ??= e.getAttribute('aria-label') || ''); e.setAttribute('aria-label', tr(en)); });
  if (fb.dataset.src) fb.textContent = tr(fb.dataset.src);
  pressed('lang', l); setPic();
  setLvl(); renderProgress(); renderChat(); renderAcct();
};
document.querySelectorAll<HTMLElement>('[data-k-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.kLang === 'it' ? 'it' : 'en')));
$('kAv').addEventListener('click', () => openSheetEl(kSet, $('kSetX')));
$('kSetX').addEventListener('click', () => closeSheet(kSet));
$('kChField').addEventListener('click', () => { kSet.hidden = true; openStart(true, true); });
// Feedback goes to the founder's inbox through the person's own mail app; nothing is sent by KERN.
const CONTACT = 'manuel@trykern.it';
$('kFeed').addEventListener('click', () => {
  location.href = `mailto:${CONTACT}?subject=${encodeURIComponent('KERN feedback')}&body=${encodeURIComponent(`\n\n---\nKERN 1.0 · ${S.lang.toUpperCase()}`)}`;
  say(isIt() ? `Si apre la tua app di posta. Oppure scrivi a ${CONTACT}` : `Opening your email app. Or write to ${CONTACT}`);
});
$('kExp').addEventListener('click', () => download(JSON.stringify({ ...snapshot(), exportedAt: new Date().toISOString() }, null, 2), 'kern-data.json', 'application/json'));
// Weekly calendar reminder (.ics): works in every calendar app, no notifications permission, no streaks.
$('kRemind').addEventListener('click', () => {
  const esc = (s: string) => s.replace(/[\\;,]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
  const p = (n: number) => String(n).padStart(2, '0');
  const d = new Date(); d.setDate(d.getDate() + 1);
  const start = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T180000`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const title = esc(tr('KERN: make one small thing'));
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KERN//KERN//EN', 'BEGIN:VEVENT',
    `UID:kern-${Date.now()}@${location.host}`, `DTSTAMP:${stamp}`, `DTSTART:${start}`, 'DURATION:PT20M', 'RRULE:FREQ=WEEKLY',
    `SUMMARY:${title}`, `DESCRIPTION:${esc(tr('No pressure. Open KERN when you feel like it.'))} ${location.origin}/`, `URL:${location.origin}/`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', `DESCRIPTION:${title}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  download(ics, 'kern-reminder.ics', 'text/calendar');
  say('Open the file to add the reminder to your calendar.');
});
$('kDel').addEventListener('click', async () => {
  if (!confirm(tr(DEMO ? 'This resets the demo to its sample trail. Continue?' : 'This deletes your trail on this device. Continue?'))) return;
  await eraseStats(); // also deletes what was counted for this device (never from the demo)
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ } wipeExtras();
  location.replace('/');
});

// Install
type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };
let bip: BIP | null = null;
const kInst = $('kInst');
const standalone = matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); bip = e as BIP; kInst.hidden = false; });
kInst.addEventListener('click', async () => { if (!bip) return; await bip.prompt(); await bip.userChoice; bip = null; kInst.hidden = true; });
addEventListener('appinstalled', () => say('KERN is installed.'));
$('kIos').hidden = !(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);
addEventListener('offline', () => say('You are offline. Your trail is saved on this device.'));
// Other tab changed the data: pick it up instead of overwriting it later.
// Idle: start over from its copy (a reload). Something open (a sheet, a text box): leave the screen and the typed text alone; the next save merges the other copy first (absorb).
// A copy that was removed (Delete my data in the other tab) always reloads: this page must not write the trail back.
const typing = () => document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;
addEventListener('storage', (e) => { if (e.key === KEY && (e.newValue === null || !(topLayer() || typing()))) location.reload(); });
addEventListener('pageshow', (e) => { if (e.persisted && absorb()) refresh(); }); // back from another page: the cached screen may be older than storage

// Offline support (production only, so dev reloads never serve stale files)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then((r) => r.active?.postMessage({ cache: [location.origin + '/', ...performance.getEntriesByType('resource').map((e) => e.name).filter((u) => u.startsWith(location.origin) && !u.includes('/api/'))] }))
      .catch(() => { /* offline mode unavailable; app still works online */ });
  });
}

// Escape closes the top layer even when focus has dropped to the page (after a swap, or a button that disappeared).
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  if (!kPwS.hidden) closeSheet(kPwS);
  else if (!kRw.hidden) closeWin();
  else if (!kSet.hidden) closeSheet(kSet);
  else if (!kFld.hidden) closeSheet(kFld);
  else if (!kSheet.hidden) closeSheet(kSheet);
  else if (kStart.classList.contains('on') && S.onboarded) closePicker();
});

// Start
renderMe();
applyTheme();
applyText();
applyField(false);
setLang(S.lang);
renderDare();
renderCoopIn(); renderCoops();
moveInd(onTab(), false);
setMode(mode);
renderAcct();
booted = true;
if (DEMO) {
  const LEAVE_ARM_MS = 4000, kDemo = $('kDemo'); let armed = 0;
  kDemo.hidden = false; kScr.classList.add('demo'); // app.css repeats a Demo tag over every sheet, where the scrim covers this marker
  // The first tap says what the marker does, a second one within a few seconds leaves: a stray tap mid-pitch must not drop the sample trail.
  kDemo.addEventListener('click', () => {
    if (Date.now() - armed > LEAVE_ARM_MS) { armed = Date.now(); say('Tap again to leave the demo.'); return; }
    location.href = '/?demo=off';
  });
  document.querySelectorAll<HTMLElement>('[data-k-send], #kExp, .k-pilot').forEach((e) => { e.hidden = true; }); // sample data is not sent or exported as if it were a real trail (.k-pilot: the card that asks for it)
}
if (recovered) say(recovered);
if (coopNote) { say(coopNote); if (coopGo && S.onboarded) goTab('yourkern'); }
track('visit'); // once a day per device, only for people who said yes
if (!S.onboarded) openStart(); // the choice comes first, right after the loader
else if (!S.name) kLogin.classList.add('on');
