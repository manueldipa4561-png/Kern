// KERN app logic. State lives in this browser (localStorage key kern:v1); with an account it also syncs (cloud.ts).
//
//  profile ──> field ──> mission ──> answer ──> reflection ──> signals ──> Kern card ──> share
//                           ^            │ (draft autosaved)      │
//                           └────────────┴── yourKERN / Trail ◄───┘
import { IT, t2 } from './i18n';
import { FIELDS } from './fields';
import { MX } from './missions';
import { RELICS, rollDrop, type Drop } from './loot';
import * as cloud from './cloud';
import { akey, ver, stamp, mergeAnswers, type Tomb } from './sync';

type Feel = 'flow' | 'ok' | 'drag';
type Again = 'yes' | 'maybe' | 'no';
type Refl = { e?: Feel; again?: Again; hard?: string; tip?: string; sid?: number }; // sid: the tip's shared sign, if published
type Answer = { f: string; i: number; t: string; at: number; ed?: number; r?: Refl; x?: number; d?: string }; // x: extra stones (bonuses, drop), d: drop id (loot.ts)
type Msg = { who: 'ai' | 'me'; t: string; typing?: boolean };
type Theme = 'system' | 'dark' | 'light';
type Lang = 'en' | 'it';
type State = { v: 1; name: string; field: string; fields: string[]; onboarded: boolean; stones: number; answers: Answer[]; drafts: Record<string, string>; msgs: Msg[]; mine: string[]; lang: Lang; theme: Theme; guess: string; saves: number; badges: string[]; dared: boolean; gone: Tomb[] };

const KEY = 'kern:v1';
const DROP_IDS = ['spark', 'gem', 'jackpot', ...RELICS.map((r) => r.id)];
const FEELS: Feel[] = ['flow', 'ok', 'drag'];
const AGAINS: Again[] = ['yes', 'maybe', 'no'];
const fresh = (): State => ({ v: 1, name: '', field: 'Design', fields: [], onboarded: false, stones: 0, answers: [], drafts: {}, msgs: [], mine: [], lang: navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en', theme: 'system', guess: '', saves: 0, badges: [], dared: false, gone: [] });
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
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
// Stored or synced data is untrusted input: keep only well-formed values.
const sanitize = (s: any): State | null => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const d = fresh();
  try {
    if (!s || typeof s !== 'object' || s.v !== 1) return null;
    const drafts: Record<string, string> = {};
    if (s.drafts && typeof s.drafts === 'object') for (const [k, v] of Object.entries(s.drafts)) if (/^\w+\.[0-2]$/.test(k) && typeof v === 'string' && v) drafts[k] = v.slice(0, 2000);
    const field: string = FIELDS[s.field] ? s.field : 'Design';
    const answers: Answer[] = Array.isArray(s.answers)
      ? s.answers.filter((a: Answer) => a && FIELDS[a.f] && Number.isInteger(a.i) && a.i >= 0 && a.i < 3 && typeof a.t === 'string' && Number.isFinite(a.at))
        .map((a: Answer) => ({ f: a.f, i: a.i, t: a.t.slice(0, 2000), at: a.at, ed: Number.isFinite(a.ed) ? a.ed : undefined, r: cleanR(a.r), x: Number.isInteger(a.x) && a.x! > 0 ? Math.min(a.x!, 600) : undefined, d: typeof a.d === 'string' && DROP_IDS.includes(a.d) ? a.d : undefined }))
      : [];
    // Interests: the fields someone chose to explore, in their order. Older saves have none: use the answered ones.
    const fields = [...new Set([...(Array.isArray(s.fields) ? s.fields : answers.map((a) => a.f)), ...(s.onboarded ? [field] : [])])]
      .filter((f): f is string => typeof f === 'string' && !!FIELDS[f]);
    return {
      ...d,
      name: str(s.name, 40),
      field,
      fields,
      onboarded: !!s.onboarded,
      stones: Number.isFinite(s.stones) ? Math.max(0, s.stones) : 0,
      answers,
      drafts,
      msgs: Array.isArray(s.msgs) ? s.msgs.filter((m: Msg) => m && (m.who === 'ai' || m.who === 'me') && typeof m.t === 'string').map((m: Msg) => ({ who: m.who, t: m.t.slice(0, 400) })) : [],
      mine: Array.isArray(s.mine) ? s.mine.filter((m: unknown) => typeof m === 'string').map((m: string) => m.slice(0, 140)) : [],
      lang: s.lang === 'it' || s.lang === 'en' ? s.lang : d.lang,
      theme: s.theme === 'dark' || s.theme === 'light' ? s.theme : 'system',
      guess: str(s.guess, 200),
      saves: Number.isFinite(s.saves) ? s.saves : 0,
      badges: Array.isArray(s.badges) ? s.badges.filter((b: unknown) => typeof b === 'string' && b.length < 20).slice(0, 50) : [],
      dared: !!s.dared,
      gone: Array.isArray(s.gone) ? s.gone.filter((g: unknown) => Array.isArray(g) && typeof g[0] === 'string' && g[0].length < 40 && Number.isFinite(g[1])).map((g: Tomb): Tomb => [g[0], g[1]]).slice(-200) : [],
    };
  } catch { return null; }
};
const load = (): State => {
  try { return sanitize(JSON.parse(localStorage.getItem(KEY) || 'null')) || fresh(); } catch { return fresh(); }
};
const S = load();
const snapshot = () => ({ ...S, msgs: S.msgs.filter((m) => !m.typing).slice(-60) });
let saveFailed = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(snapshot())); saveFailed = false; }
  catch { if (!saveFailed) { saveFailed = true; say("Couldn't save on this device. Check your browser storage settings."); } }
  schedulePush();
}

// Cloud sync (only when signed in): debounced upload of the whole state; retried on the next save or when back online.
let user: cloud.User | null = null, pushT = 0, syncOk = true;
function schedulePush() {
  if (!user) return;
  clearTimeout(pushT);
  pushT = window.setTimeout(async () => {
    if (!user) return;
    try { await cloud.push(user.id, snapshot()); if (!syncOk) say('Synced again.'); syncOk = true; }
    catch { if (syncOk) say("Couldn't sync. Your trail is safe on this device and will sync later."); syncOk = false; }
    renderAcct();
  }, 1200);
}
addEventListener('online', () => { if (user && !syncOk) schedulePush(); });
// Merge a synced copy into this device (sync.ts rules: newest answer wins, deletes stick), keep local settings.
const mergeIn = (raw: unknown) => {
  const r = sanitize(raw); if (!r) return;
  const m = mergeAnswers(S.answers, r.answers, S.gone, r.gone);
  S.answers = m.answers; S.gone = m.gone;
  S.stones = S.answers.reduce((s, a) => s + worth(a), 0); // stones are exactly what the merged answers earned
  if (!S.name) S.name = r.name;
  if (!S.onboarded && r.onboarded) { S.onboarded = true; S.field = r.field; }
  S.fields = [...new Set([...S.fields, ...r.fields, S.field])]; // interests from every device
  S.drafts = { ...r.drafts, ...S.drafts };
  if (!S.mine.length && r.mine.length) { S.mine = r.mine; S.msgs = r.msgs; }
  S.saves = Math.max(S.saves, r.saves);
  if (!S.guess) S.guess = r.guess;
  S.badges = [...new Set([...S.badges, ...r.badges])];
  S.dared = S.dared || r.dared;
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
const doneSet = () => new Set(S.answers.filter((a) => a.f === S.field).map((a) => a.i));

const toast = $('kToast'), toastT = $('kToastT'), toastB = $('kToastB');
let tT = 0, toastAct: (() => void) | null = null;
// Short message at the bottom; with `undo`, shows an Undo button for a few seconds (Gmail-style).
function say(en: string, undo?: () => void) {
  toastT.textContent = tr(en);
  toastAct = undo || null; toastB.hidden = !undo; toastB.textContent = tr('Undo');
  toast.classList.toggle('act', !!undo); toast.classList.add('on');
  clearTimeout(tT); tT = window.setTimeout(() => { toast.classList.remove('on', 'act'); toastAct = null; }, undo ? 5000 : 2800);
}
toastB.addEventListener('click', () => { const f = toastAct; toastAct = null; toast.classList.remove('on', 'act'); if (f) f(); });

// Static text: remember the English source so language switches are lossless.
const kTxt = kScr.querySelectorAll<HTMLElement>('.k-l, h4, h5, p, .k-sig, .k-chips span, .k-tile span, .k-done span, .k-tag span, .k-tag strong, .k-ask button, .k-btn, .k-ask-btn, .k-go, .k-sk, .k-win, .k-check span, .k-seg button, .k-tabs button:not(:nth-child(2))');
kTxt.forEach((e) => { e.dataset.en = e.innerHTML.trim(); });
const SAMPLE = { guess: $('kGuess').dataset.en!, why: $('kWhy').dataset.en!, ai: $('kAiSig').dataset.en!, card: $('kCardH').dataset.en!, cardL: $('kCardL').dataset.en!, drawn: ['Shaping ideas', 'Writing', 'Solo work'], cardC: ['Shaping ideas', 'Writing'] };

// Launch loader
const kLoad = $('kLoad');
if (still) kLoad.classList.add('off');
else { kLoad.classList.add('go'); window.setTimeout(() => kLoad.classList.add('off'), S.name ? 1900 : 3200); }

// Theme
const mqLight = matchMedia('(prefers-color-scheme: light)');
const applyTheme = () => {
  const light = S.theme === 'light' || (S.theme === 'system' && mqLight.matches);
  kScr.classList.toggle('light', light);
  document.documentElement.classList.toggle('light', light);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#E8E6DA' : '#0F140E');
  pressed('theme', S.theme);
};
mqLight.addEventListener('change', applyTheme);
document.querySelectorAll<HTMLElement>('[data-k-theme]').forEach((b) => b.addEventListener('click', () => { S.theme = b.dataset.kTheme as Theme; save(); applyTheme(); }));

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
tabs.forEach((t) => t.addEventListener('click', () => {
  const next = 'k-' + t.dataset.kTab, cur = kScr.querySelector<HTMLElement>('.k-pane.on');
  tabs.forEach((x) => { x.classList.toggle('on', x === t); x.setAttribute('aria-current', String(x === t)); });
  const swap = () => {
    kScr.querySelectorAll('.k-pane').forEach((p) => { p.classList.remove('leaving'); p.classList.toggle('on', p.id === next); });
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
const kSheet = $('kSheet'), kSet = $('kSet');
// Whatever layer is on top (sheet, reward, login, onboarding) makes everything behind it inert:
// no Tab, clicks or screen reader reaching the page under a dialog.
const LAYERS = ['kReward', 'kPwS', 'kSet', 'kSheet', 'kStart', 'kLogin'].map((id) => $(id)); // top first
const syncInert = () => {
  const top = LAYERS.find((l) => !l.hidden && (!l.classList.contains('k-start') || l.classList.contains('on')));
  for (const c of kScr.children) (c as HTMLElement).inert = !!top && c !== top;
};
const layerWatch = new MutationObserver(syncInert);
LAYERS.forEach((l) => layerWatch.observe(l, { attributes: true, attributeFilter: ['hidden', 'class'] }));
let lastFocus: HTMLElement | null = null;
const openSheetEl = (sh: HTMLElement, focus: HTMLElement) => { lastFocus = document.activeElement as HTMLElement; sh.hidden = false; syncInert(); focus.focus(); };
const closeSheet = (sh: HTMLElement) => { sh.hidden = true; syncInert(); if (sh === kSheet) flushDraft(); lastFocus?.focus(); };
[kSheet, kSet].forEach((sh) => {
  sh.addEventListener('click', (e) => { if (e.target === sh) closeSheet(sh); });
  sh.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(sh); });
});

// Ranks
const RANKS: [string, number][] = [['Pebble', 0], ['Stone', 100], ['Cairn', 300], ['Ridge', 700], ['Summit', 1500]];
const RIT: Record<string, string> = { Pebble: 'Ciottolo', Stone: 'Pietra', Cairn: 'Cairn', Ridge: 'Cresta', Summit: 'Vetta' };
const rn = (n: string) => (isIt() && RIT[n]) || n;
const rankIdx = (s: number) => RANKS.reduce((a, r, i) => (s >= r[1] ? i : a), 0);
const setLvl = () => {
  const i = rankIdx(S.stones), nx = RANKS[i + 1], it = isIt();
  $<HTMLTextAreaElement>('kTa').placeholder = tr('Write it your way. Nothing is sent.');
  $('kRank').textContent = rn(RANKS[i][0]);
  $<HTMLImageElement>('kRankImg').src = `/img/r${i}.webp`;
  $('kSt').textContent = String(S.stones);
  $('kBar').style.width = (nx ? ((S.stones - RANKS[i][1]) / (nx[1] - RANKS[i][1])) * 100 : 100) + '%';
  $('kNx').textContent = nx ? (it ? `${nx[1] - S.stones} pietre a ${rn(nx[0])}` : `${nx[1] - S.stones} stones to ${rn(nx[0])}`) : (it ? 'Grado massimo' : 'Top rank');
  const lad = $('kLad');
  lad.innerHTML = '';
  RANKS.forEach((r, k) => {
    const s = document.createElement('span'), im = document.createElement('img'), b = document.createElement('b');
    im.src = `/img/r${k}.webp`; im.alt = ''; im.width = im.height = 400; im.decoding = 'async';
    b.textContent = rn(r[0]); s.append(im, b);
    if (k < i) s.className = 'done'; if (k === i) s.className = 'on';
    lad.appendChild(s);
  });
};

// Signals: which kind of mission you light up on, from your own reflections.
// Mission 0 = improve what exists, 1 = start from zero, 2 = work with someone (see fields.ts).
const KIND_EN = ['improve what already exists', 'start from zero', 'work with someone'];
const KIND_IT = ['migliori ciò che esiste già', 'parti da zero', 'lavori con qualcuno'];
const KSHORT = ['Improving things', 'Starting from zero', 'Working with others'];
const FEEL_EN: Record<Feel, string> = { flow: 'Time flew', ok: 'It was fine', drag: 'It dragged' };
const AGAIN_EN: Record<Again, string> = { yes: 'Yes', maybe: 'Maybe', no: 'No' };
const SCORE: Record<Feel, number> = { flow: 2, ok: 1, drag: 0 };
const readSignals = () => {
  const by = [0, 1, 2].map((i) => S.answers.filter((a) => a.f === S.field && a.i === i && a.r?.e));
  const rated = by.map((l, i) => ({ i, v: l.length ? l.reduce((s, a) => s + SCORE[a.r!.e!], 0) / l.length : -1 })).filter((x) => x.v >= 0).sort((a, b) => b.v - a.v);
  if (!rated.length) return null;
  const best = rated[0].i, low = rated[rated.length - 1];
  const worst = rated.length > 1 && low.v < rated[0].v ? low.i : -1;
  const last = (i: number) => by[i][by[i].length - 1];
  return { best, worst, n: rated.length, bestA: last(best), worstA: worst >= 0 ? last(worst) : null };
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
    setD($('kCardL'), done === 3 && sg.n === 3 ? tr('3 missions · first guess') : (it ? `Basata su ${sg.n} missioni su 3 · iniziale` : `Based on ${sg.n} of 3 missions · early`));
    chips($('kDrawn'), [tr(S.field), tr(KSHORT[sg.best])]);
    chips($('kCardC'), [tr(S.field), tr(KSHORT[sg.best])]);
  }
  // Energy per kind of mission in this field: the average of your own "how did it feel" answers.
  const meter = $('kMeter');
  meter.innerHTML = '';
  let any = false;
  [0, 1, 2].forEach((i) => {
    const l = S.answers.filter((a) => a.f === S.field && a.i === i && a.r?.e);
    const v = l.length ? l.reduce((s, a) => s + SCORE[a.r!.e!], 0) / (l.length * 2) : 0;
    any ||= l.length > 0;
    const row = document.createElement('div'), lab = document.createElement('span'), val = document.createElement('b'), bar = document.createElement('i'), fill = document.createElement('s');
    row.className = 'k-mt'; lab.textContent = tr(KSHORT[i]); val.textContent = l.length ? Math.round(v * 100) + '%' : '–';
    fill.style.width = v * 100 + '%'; bar.append(fill); row.append(lab, val, bar); meter.append(row);
  });
  setT($('kMeterN'), any ? 'From your reflections. Not a test.' : 'Reflect after a mission to fill this.');
  const n = S.mine.length;
  if (n >= 2) setD($('kAiSig'), it ? `Hai riscritto la tua idea ${n} volte in KERN.AI. Confronta la versione 1 con l'ultima.` : `You rewrote your idea ${n} times in KERN.AI. Compare version 1 with your latest one.`);
  else setT($('kAiSig'), SAMPLE.ai);
};

// Home: greeting, next mission, the three missions with status.
// Your interests on Missions: switch path in one tap (progress is kept per field), or add more.
const switchField = (f: string) => {
  if (f === S.field || !FIELDS[f]) return;
  S.field = f; save(); applyField(false); pop();
};
const renderFields = () => {
  const box = $('kFields');
  box.innerHTML = '';
  S.fields.forEach((f) => {
    const b = document.createElement('button'), im = document.createElement('img'), t = document.createElement('span'), n = document.createElement('small');
    b.type = 'button'; b.className = 'k-fchip' + (f === S.field ? ' on' : ''); b.setAttribute('aria-pressed', String(f === S.field));
    im.src = `/img/f-${f.toLowerCase()}.webp`; im.alt = ''; im.width = im.height = 400; im.decoding = 'async';
    t.textContent = tr(f);
    n.textContent = `${new Set(S.answers.filter((a) => a.f === f).map((a) => a.i)).size}/3`;
    b.append(im, t, n); b.addEventListener('click', () => switchField(f)); box.appendChild(b);
  });
  const add = document.createElement('button');
  add.type = 'button'; add.className = 'k-fchip k-fadd'; add.textContent = `+ ${tr('Add')}`; add.setAttribute('aria-label', tr('Add interests'));
  add.addEventListener('click', () => openStart(true)); box.appendChild(add);
};
const kAdd = $('kAdd');
const renderHome = () => {
  renderFields();
  const f = F(), done = doneSet(), next = [0, 1, 2].find((k) => !done.has(k)), it = isIt();
  setD($('kHi'), S.name ? `${it ? 'Ciao' : 'Hi'} ${S.name}` : (it ? 'Ciao' : 'Hi'));
  const img = $<HTMLImageElement>('kNxImg'), src = next === undefined ? '/img/cairn.webp' : `/img/f-${S.field.toLowerCase()}.webp`;
  if (img.getAttribute('src') !== src) img.src = src;
  if (next === undefined) {
    setT($('kNxL'), 'Your 3 missions are done'); setT($('kNxT'), 'Your Kern card is ready.');
    setT($('kNxP'), 'See what your answers say about how you work, and share it.');
    setT(kAdd, 'See your Kern card'); kAdd.dataset.kAns = 'card';
  } else {
    const m = f.m[next];
    setD($('kNxL'), it ? `Prossimo passo · missione ${next + 1} di 3` : `Your next step · mission ${next + 1} of 3`);
    setT($('kNxT'), m[1]); setT($('kNxP'), m[2]);
    setT(kAdd, S.drafts[`${S.field}.${next}`] ? 'Continue your draft' : 'Add your answer'); kAdd.dataset.kAns = String(next);
  }
  [0, 1, 2].forEach((i) => {
    const row = $('kMR' + i), st = done.has(i) ? 'Done' : i === next ? 'Next' : S.drafts[`${S.field}.${i}`] ? 'Draft' : 'Not started';
    row.classList.toggle('done', done.has(i)); row.classList.toggle('next', i === next);
    setT(row.querySelector('b')!, f.m[i][1]);
    setD(row.querySelector('small')!, `${tr(f.m[i][0])} · ${tr(st)}`);
  });
};

// Progress: pill, trail, answers list, signs, real stats from saved answers.
const renderProgress = () => {
  const it = isIt(), done = doneSet(), n = done.size, next = [0, 1, 2].find((k) => !done.has(k));
  $('kPill').textContent = it ? `${n} su 3 fatte` : `${n} of 3 done`;
  $('kRing').style.setProperty('--p', String(n / 3));
  [0, 1, 2].forEach((i) => {
    const st = $('kTr' + i).parentElement!;
    st.className = 'k-st' + (done.has(i) ? ' fin' : i === next ? ' now' : '');
    setT(st.querySelector('p')!, done.has(i) ? 'Done' : i === next ? 'In progress' : 'Not started');
  });
  const kc = $('kTrK');
  kc.className = 'k-st' + (n === 3 ? ' now' : '');
  setT(kc.querySelector('p')!, n === 3 ? 'Ready to share' : 'Ready when your 3 missions are done');
  const box = $('kAns');
  box.innerHTML = '';
  if (!S.answers.length) { const p = document.createElement('p'); p.textContent = tr('No answers yet. Pick a mission and add yours.'); box.appendChild(p); }
  S.answers.slice(-5).reverse().forEach((a, k) => {
    const idx = S.answers.length - 1 - k;
    const row = document.createElement('div'); row.className = 'k-an';
    const l = document.createElement('span'); l.className = 'k-l';
    l.textContent = `${tr(FIELDS[a.f].m[a.i][1])} · ${day(a.at)}${a.r?.e ? ' · ' + tr(FEEL_EN[a.r.e]) : ''}`;
    const p = document.createElement('p'); p.textContent = a.t;
    const acts = document.createElement('div'); acts.className = 'k-an-act';
    const ed = document.createElement('button'); ed.type = 'button'; ed.textContent = tr('Edit'); ed.addEventListener('click', () => openEdit(idx));
    const del = document.createElement('button'); del.type = 'button'; del.textContent = tr('Delete'); del.addEventListener('click', () => deleteAnswer(idx));
    acts.append(ed, del);
    row.append(l, p, acts); box.appendChild(row);
  });
  const signs = $('kSigns'), tips = S.answers.filter((a) => a.r?.tip);
  signs.innerHTML = '';
  if (!tips.length) { const p = document.createElement('p'); p.textContent = tr('After each mission, leave one short tip for the next person.'); signs.appendChild(p); }
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
  renderHome(); renderSignals(); renderBadges(); renderLoot();
};

// Badges (Duolingo/Strava style): earned once, kept even if an answer is later deleted.
const WEEKNUM = (t: number) => Math.floor(t / 6048e5);
const BADGES: { id: string; t: string; d: string; ok: () => boolean }[] = [
  { id: 'first', t: 'First step', d: 'Your first answer', ok: () => S.answers.length > 0 },
  { id: 'reflect', t: 'Honest look', d: 'Your first reflection', ok: () => S.answers.some((a) => a.r) },
  { id: 'sign', t: 'Trail marker', d: 'Left a sign for the next person', ok: () => S.answers.some((a) => a.r?.tip) },
  { id: 'full', t: 'Full trail', d: 'All 3 missions in one field', ok: () => Object.keys(FIELDS).some((f) => new Set(S.answers.filter((a) => a.f === f).map((a) => a.i)).size === 3) },
  { id: 'twice', t: 'Do it twice', d: '3 versions of an idea in KERN.AI', ok: () => S.mine.length >= 3 },
  { id: 'dare', t: 'Challenger', d: 'Dared a friend', ok: () => S.dared },
  { id: 'steady', t: 'Steady', d: 'Made something in 3 different weeks', ok: () => new Set(S.answers.map((a) => WEEKNUM(a.at))).size >= 3 },
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
    el.setAttribute('aria-label', `${tr(b.t)}: ${tr(b.d)}${got ? '' : ' (' + tr('locked') + ')'}`);
    const m = document.createElement('i'); m.textContent = tr(b.t)[0]; m.setAttribute('aria-hidden', 'true');
    const t = document.createElement('b'); t.textContent = tr(b.t);
    const d = document.createElement('small'); d.textContent = tr(b.d);
    el.append(m, t, d); box.appendChild(el);
  });
  if (!fresh.length) return;
  save();
  if (booted) window.setTimeout(() => { say(tr('New badge: {b}').replace('{b}', tr(fresh[0]))); if ('vibrate' in navigator) navigator.vibrate([20, 40, 20]); }, 3000);
}

// Delete with Undo; stones earned by that answer are taken back so nothing can be farmed.
// Deletes made while the Undo toast is up join one batch, and Undo brings them all back.
// Each delete leaves a tombstone so it also sticks on the user's other synced devices.
const worth = (a: Answer) => 50 + (a.r ? 20 : 0) + (a.x || 0);
let binned: Answer[] = [];
function deleteAnswer(idx: number) {
  const a = S.answers[idx]; if (!a) return;
  if (!toastAct) binned = [];
  binned.push(a);
  S.answers.splice(idx, 1);
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
    binned = []; save(); setLvl(); renderProgress();
  });
}

// Co-pilot chat (scripted: it only asks, never proposes the idea)
const chatEl = $('kChat'), inEl = $<HTMLInputElement>('kIn'), cmp = $('kCmp');
let busy = false;
const OPEN = "What is your idea? Write it in your own words first. I won't suggest one.";
const HEAVY = /(kill myself|suicid|self.?harm|hopeless|want to die|voglio morire|farla finita|non ce la faccio più)/i;
const ASKED = /(give me|tell me|what should|write it for me|any ideas|dammi|dimmi|che idea|scrivilo tu|cosa dovrei)/i;
const renderChat = () => {
  chatEl.innerHTML = '';
  S.msgs.forEach((m) => {
    const p = document.createElement('p'); p.className = 'k-msg ' + (m.who === 'me' ? 'k-me' : 'k-ai');
    if (m.typing) { p.classList.add('k-typing'); p.innerHTML = '<i></i><i></i><i></i>'; p.setAttribute('aria-label', 'typing'); }
    else p.textContent = m.who === 'ai' ? tr(m.t) : m.t;
    chatEl.appendChild(p);
  });
  chatEl.scrollTop = chatEl.scrollHeight;
  inEl.placeholder = tr('Your idea, your words…');
  const show = S.mine.length >= 3 && !busy;
  cmp.hidden = !show;
  if (show) { $('kV1').textContent = S.mine[0]; $('kV3').textContent = S.mine[S.mine.length - 1]; }
};
const aiSay = (t: string) => {
  S.msgs.push({ who: 'ai', t: '', typing: true }); renderChat();
  window.setTimeout(() => { S.msgs.pop(); S.msgs.push({ who: 'ai', t }); busy = false; save(); renderChat(); renderSignals(); renderBadges(); }, still ? 0 : 750);
};
const startChat = () => { S.msgs = [{ who: 'ai', t: OPEN }]; S.mine = []; busy = false; inEl.value = ''; save(); renderChat(); };
const sendChat = () => {
  const v = inEl.value.trim(); if (!v || busy) return;
  inEl.value = ''; S.msgs.push({ who: 'me', t: v }); busy = true; renderChat();
  if (HEAVY.test(v)) return aiSay("This sounds heavy, so I'm pausing the mission. Please talk to someone you trust or a local helpline. If you are in danger, call your local emergency number.");
  if (ASKED.test(v)) return aiSay("I won't hand you the idea. What is the first thing that comes to mind, even if it's rough?");
  S.mine.push(v);
  if (S.mine.length < 3) return aiSay(F().qs[S.mine.length - 1]);
  if (S.mine.length === 3) return aiSay('You wrote it 3 times and each version changed. That is your evidence. Compare the first and the last.');
  aiSay('Save it to yourKERN, or start over with a new idea.');
};
$('kSend').addEventListener('click', sendChat);
inEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendChat(); } });
document.querySelectorAll<HTMLElement>('#kEx span').forEach((c, i) => {
  const go = () => { if (i === 1) return startChat(); inEl.value = tr(F().idea).replace(/^[^:]+:\s*/, ''); inEl.focus(); };
  c.addEventListener('click', go);
  c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});
$('kSaveV').addEventListener('click', () => { S.saves++; save(); say('Saved to yourKERN. Every version counts as evidence.'); });
$('kToAi').addEventListener('click', () => goTab('copilot'));

// Field: trail titles, progress, chat.
const applyField = (resetChat: boolean) => {
  F().m.forEach((m, i) => setT($('kTr' + i), m[1]));
  if (resetChat || !S.msgs.length) startChat(); else renderChat();
  renderProgress();
};

// Answer sheet: step 1 answer (draft autosaved), step 2 quick reflection.
const kTa = $<HTMLTextAreaElement>('kTa'), kShA = $('kShA'), kShR = $('kShR');
let cur: { f: string; i: number; dare: boolean; edit: number } = { f: 'Design', i: 0, dare: false, edit: -1 };
let lastIdx = -1, dT = 0;
const dKey = () => `${cur.f}.${cur.i}`;
function flushDraft() {
  clearTimeout(dT);
  if (kShA.hidden || cur.edit >= 0) return; // edits are not drafts
  const v = kTa.value.trim() ? kTa.value.slice(0, 2000) : '';
  if (v) S.drafts[dKey()] = v; else delete S.drafts[dKey()];
  save(); renderHome();
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
function unshareSign(a: Answer) {
  const id = a.r?.sid; if (!id) return; // still uploading: shareSign removes it on arrival if the answer is gone
  delete a.r!.sid;
  if (user) cloud.removeSign(id).catch(() => { /* already gone or offline */ });
}
const kShS = $('kShS');
let signReq = 0;
const renderTrailSigns = (f: string, i: number) => {
  const req = ++signReq;
  const note = (en: string) => { kShS.innerHTML = ''; const p = document.createElement('p'); p.className = 'k-sign-empty'; setT(p, en); kShS.appendChild(p); };
  if (!cloud.enabled) return note('When people finish this mission, the signs they leave for you appear here.');
  note('Loading signs…');
  cloud.signs(f, i).then((list) => {
    if (req !== signReq) return;
    const ok = list.filter((s) => shareable(s.tip));
    if (!ok.length) return note('No signs on this trail yet. Finish it and leave the first one.');
    kShS.innerHTML = '';
    ok.forEach((s) => {
      const d = document.createElement('div'), q = document.createElement('p'), w = document.createElement('span');
      d.className = 'k-sign'; q.textContent = `“${s.tip}”`; w.className = 'k-l';
      setD(w, `${tr('Someone who finished it')} · ${day(Date.parse(s.at) || Date.now())}`);
      d.append(q, w); kShS.appendChild(d);
    });
  }).catch(() => { if (req === signReq) note("Couldn't load signs right now."); });
};
const setRfNote = () => setT($('kRfN'), user ? 'Shared without your name with the next people on this trail.'
  : cloud.enabled ? 'Stays on this device. Log in to share it, without your name, with the next people on this trail.'
  : 'Stays on this device for now.');
// Practice brief (missions.ts): scenario, material to work on, tick-off steps with a progress bar
// (first step pre-ticked), and after submitting a self-check that pays bonus stones.
const kShX = $('kShX'), kXSteps = $('kXSteps'), kRfBar = $('kRfBar'), kRfBI = $('kRfBI');
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
function renderBrief(f: string, i: number) {
  const x = MX[f]?.[i];
  kShX.hidden = kRfBar.hidden = !x;
  kXSteps.innerHTML = ''; kRfBI.innerHTML = '';
  if (!x) return;
  setX($('kXWho'), x.who); setD($('kXMin'), `~${x.mins} min`);
  setX($('kXBrief'), x.brief);
  setX($('kXAT'), x.asset.title); setX($('kXAB'), x.asset.body); $('kXAB').classList.toggle('mono', x.asset.mono);
  tick(kXSteps, t2('Read the brief', 'Leggi il brief'), true, 'st', stepProg);
  x.steps.forEach((s) => tick(kXSteps, s, false, 'st', stepProg));
  stepProg();
  x.bar.forEach((b) => tick(kRfBI, b, false, 'bar'));
  tick(kRfBI, x.twist, false, 'tw');
}
// Self-check after submitting: +10 per quality bar met, +25 for the twist. Returns the bonus (not saved here).
const bonus = () => {
  const b = kRfBar.hidden ? 0 : kRfBI.querySelectorAll('.bar.on').length * 10 + kRfBI.querySelectorAll('.tw.on').length * 25;
  S.stones += b; return b;
};
// Habit loop (Hooked: trigger, action, variable reward, investment). The reward is a random drop after each finished
// mission (loot.ts), the investment is the collection of finds and the trail days; nothing here punishes a missed day.
const DAY = 864e5, dayN = (t: number) => Math.floor((t - new Date(t).getTimezoneOffset() * 6e4) / DAY);
const relicsOwned = () => RELICS.filter((r) => S.answers.some((a) => a.d === r.id)).map((r) => r.id);
const dropStreak = () => { let n = 0; for (const a of [...S.answers].sort((x, y) => y.at - x.at)) { if (a.d) break; n++; } return n; };
// Trail days: days in a row with a finished mission. One missed day is forgiven (a rest day); two in a row end it.
const trailDays = () => {
  const days = [...new Set(S.answers.map((a) => dayN(a.at)))].sort((a, b) => b - a);
  if (!days.length || dayN(Date.now()) - days[0] > 2) return 0;
  let n = 1;
  for (let i = 1; i < days.length && days[i - 1] - days[i] <= 2; i++) n++;
  return n;
};
const kFinds = $('kFinds');
const ICON = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
function renderLoot() {
  const own = relicsOwned();
  setD($('kFN'), `${own.length}/${RELICS.length}`);
  kFinds.innerHTML = '';
  RELICS.forEach((r) => {
    const got = own.includes(r.id), el = document.createElement('div'), b = document.createElement('b');
    el.className = 'k-find' + (got ? ' got' : '');
    el.setAttribute('aria-label', got ? tr(r.name) : tr('Not found yet'));
    el.innerHTML = got ? ICON(r.d) : '<span aria-hidden="true">?</span>';
    b.textContent = got ? tr(r.name) : '';
    el.appendChild(b); kFinds.appendChild(el);
  });
  const n = trailDays(), st = $('kStreak');
  st.hidden = !n;
  if (n) setD($('kStreakT'), `${n} ${tr(n === 1 ? 'trail day' : 'trail days')}`);
}
const DROP_T: Record<string, string> = { spark: t2('A spark', 'Una scintilla'), gem: t2('A gem', 'Una gemma'), relic: t2('A find!', 'Un ritrovamento!'), jackpot: t2('Jackpot', 'Jackpot') };
const kShD = $('kShD');
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
function showDrop(d: Drop, side: number) {
  const rel = RELICS.find((r) => r.id === d.id);
  kSheet.classList.add('drop'); kShA.hidden = true; kShR.hidden = true; kShD.hidden = false; kShD.dataset.tier = d.tier;
  $('kDrArt').innerHTML = dropArt(d);
  setT($('kDrT'), DROP_T[d.tier]);
  if (rel) setD($('kDrN'), `${tr(rel.name)} · ${relicsOwned().length + 0}/${RELICS.length}`); else setD($('kDrN'), `+${d.stones} ${isIt() ? 'pietre' : 'stones'}`);
  setD($('kDrS'), rel ? `+${d.stones} ${isIt() ? 'pietre' : 'stones'}${side ? ` · +${side} bonus` : ''}` : side ? `+${side} bonus` : '');
  const bits = $('kDrBits'); bits.innerHTML = '';
  if (!still) for (let i = 0; i < 18; i++) { const p = document.createElement('i'); p.style.setProperty('--a', `${(360 / 18) * i + Math.random() * 12}deg`); p.style.setProperty('--r', `${70 + Math.random() * 60}px`); bits.appendChild(p); }
  if ('vibrate' in navigator) navigator.vibrate(d.tier === 'jackpot' ? [30, 40, 30, 40, 60] : d.tier === 'relic' ? [20, 30, 40] : [18]);
  $('kDrOk').focus();
}
$('kDrOk').addEventListener('click', () => { closeSheet(kSheet); setLvl(); renderProgress(); });
const fillSheet = (f: string, i: number) => {
  kSheet.classList.remove('drop'); kShD.hidden = true;
  const m = FIELDS[f].m[i];
  setT($('kShL'), m[0]); setT($('kShT'), m[1]);
  setT($('kShQ'), FIELDS[f].qs[i % FIELDS[f].qs.length]);
  renderBrief(f, i);
  kShA.hidden = false; kShR.hidden = true;
  renderTrailSigns(f, i);
};
// Beat the clock: a gentle countdown from the mission's time box; finishing inside it pays +15. After it, no pressure.
let openedAt = 0, clockT = 0;
const runClock = () => {
  clearInterval(clockT);
  const x = MX[cur.f]?.[cur.i]; if (!x || cur.edit >= 0) return;
  const el = $('kXMin');
  const tick = () => {
    if (kSheet.hidden || kShA.hidden) { clearInterval(clockT); return; }
    const left = x.mins * 60 - Math.round((Date.now() - openedAt) / 1000);
    setD(el, left > 0 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} · +15` : tr('Take your time'));
  };
  tick(); clockT = window.setInterval(tick, 1000);
};
const openAnswer = (f: string, i: number, dare = false) => {
  cur = { f, i, dare, edit: -1 };
  fillSheet(f, i); setT($('kSub'), 'Submit answer');
  kTa.value = S.drafts[dKey()] || '';
  openedAt = Date.now(); runClock();
  openSheetEl(kSheet, kTa);
};
function openEdit(idx: number) {
  const a = S.answers[idx]; if (!a) return;
  cur = { f: a.f, i: a.i, dare: false, edit: idx };
  fillSheet(a.f, a.i); setT($('kSub'), 'Save changes');
  kTa.value = a.t;
  openSheetEl(kSheet, kTa);
}
const groups = ['kRfE', 'kRfA'].map((id) => $(id));
groups.forEach((g) => g.querySelectorAll<HTMLElement>('[data-v]').forEach((c) => {
  const pick = () => { g.querySelectorAll<HTMLElement>('[data-v]').forEach((o) => { o.classList.toggle('sel', o === c); o.setAttribute('aria-pressed', String(o === c)); }); g.dataset.val = c.dataset.v!; };
  c.addEventListener('click', pick);
  c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
}));
kAdd.addEventListener('click', () => { if (kAdd.dataset.kAns === 'card') goTab('trail'); else openAnswer(S.field, Number(kAdd.dataset.kAns)); });
[0, 1, 2].forEach((i) => $('kMR' + i).addEventListener('click', () => openAnswer(S.field, i)));
$('kCancel').addEventListener('click', () => closeSheet(kSheet));
$('kSub').addEventListener('click', () => {
  const t = kTa.value.trim();
  if (!t) { say('Write something first.'); kTa.focus(); return; }
  clearTimeout(dT);
  if (cur.edit >= 0) {
    const a = S.answers[cur.edit];
    if (a) { a.t = t.slice(0, 2000); a.ed = stamp(ver(a)); }
    save(); closeSheet(kSheet); renderProgress(); say('Answer updated.');
    return;
  }
  S.answers.push({ f: cur.f, i: cur.i, t: t.slice(0, 2000), at: Date.now() });
  lastIdx = S.answers.length - 1;
  delete S.drafts[dKey()];
  S.stones += 50; save();
  if (cur.dare) { dare = null; renderDare(); }
  setLvl(); renderProgress();
  groups.forEach((g) => { g.dataset.val = ''; g.querySelectorAll('[data-v]').forEach((o) => { o.classList.remove('sel'); o.setAttribute('aria-pressed', 'false'); }); });
  $<HTMLInputElement>('kRfH').value = ''; $<HTMLInputElement>('kRfT').value = '';
  kShA.hidden = true; kShR.hidden = false; setRfNote();
  groups[0].querySelector<HTMLElement>('[data-v]')!.focus();
});
$('kRfOk').addEventListener('click', () => {
  const r = cleanR({ e: groups[0].dataset.val, again: groups[1].dataset.val, hard: $<HTMLInputElement>('kRfH').value, tip: $<HTMLInputElement>('kRfT').value });
  finish(r);
});
$('kRfSkip').addEventListener('click', () => finish(undefined));
// Finishing a mission: self-check bonus, speed bonus, then the random drop. Everything extra is stored on the answer
// (a.x, a.d) so sync, delete and undo keep stones exact.
function finish(r: Refl | undefined) {
  const a = S.answers[lastIdx];
  const x = MX[cur.f]?.[cur.i];
  // Bonuses and drops only reward a real attempt (20+ characters), so one-letter answers cannot farm them.
  const real = (a?.t.length || 0) >= 20;
  let side = real ? bonus() : 0;
  if (real && x && openedAt && Date.now() - openedAt <= x.mins * 60000) { side += 15; S.stones += 15; }
  const today = dayN(Date.now());
  const lucky = S.answers.filter((q) => dayN(q.at) === today).length <= 1;
  const drop: Drop = real ? rollDrop(Math.max(0, dropStreak() - 1), relicsOwned(), lucky) : { tier: 'none', id: '', stones: 0 };
  S.stones += drop.stones;
  if (a) {
    if (r) { a.r = r; S.stones += 20; }
    const extra = side + drop.stones;
    if (extra) a.x = (a.x || 0) + extra;
    if (drop.id) a.d = drop.id;
    a.ed = stamp(ver(a));
  }
  save(); if (a && r) shareSign(a);
  openedAt = 0;
  if (drop.tier !== 'none') { showDrop(drop, side); return; }
  closeSheet(kSheet); setLvl(); renderProgress();
  say((r ? tr('Reflection saved. +20 stones.') : tr('+50 stones. Your answer is saved on this device.')) + (side ? ` +${side} bonus` : ''));
}

// Reward preview: shows what winning feels like without changing your stones.
const kRw = $('kReward'), kWin = $('kWin'), kConf = $('kConf'), kGain = $('kGain'), kRU = $('kRU');
const closeWin = () => { kRw.hidden = true; syncInert(); kWin.focus(); };
kWin.addEventListener('click', () => {
  const gain = 200, before = rankIdx(S.stones), after = rankIdx(S.stones + gain);
  kRU.hidden = after === before;
  $('kRU2').textContent = rn(RANKS[after][0]);
  $<HTMLImageElement>('kRUImg').src = `/img/r${after}.webp`;
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
kRw.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeWin(); });

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
const openStart = (step2 = false) => {
  if (S.onboarded) picks = [...S.fields];
  setT($('kGo'), S.onboarded ? 'Save interests' : 'Start my first mission');
  kS1.hidden = step2; kS2.hidden = !step2; markPick(); kStart.classList.add('on');
};
const renderMe = () => { $('kAv').textContent = (S.name.trim()[0] || 'K').toUpperCase(); };
// Login screen modes: 'up' create account, 'in' log in, 'guest' local-only profile.
// Without Supabase keys only 'guest' exists and the screen looks like before.
type Mode = 'guest' | 'up' | 'in';
let mode: Mode = cloud.enabled ? 'up' : 'guest';
const kEm = $<HTMLInputElement>('kEm'), kPw = $<HTMLInputElement>('kPw'), kOk = $('kOk');
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
const fail = (en: string) => { setT(kErr, en); kErr.hidden = false; kOk.hidden = true; };
const note = (en: string) => { setT(kOk, en); kOk.hidden = false; kErr.hidden = true; };
function setMode(m: Mode) {
  mode = m;
  pressed('mode', m);
  $('kAuthSeg').hidden = !cloud.enabled;
  $('kFName').hidden = m === 'in';
  $('kFEmail').hidden = m === 'guest'; $('kFPw').hidden = m === 'guest';
  $('kFAge').hidden = m === 'in';
  kPw.autocomplete = m === 'in' ? 'current-password' : 'new-password';
  $('kForgot').hidden = m !== 'in';
  $('kGuest').hidden = !cloud.enabled || m === 'guest';
  setT($('kGuest'), S.name ? 'Not now' : 'Continue without an account');
  $('kNoteLocal').hidden = m !== 'guest'; $('kNoteCloud').hidden = m === 'guest';
  setT(kLog, m === 'up' ? 'Create account' : m === 'in' ? 'Log in' : 'Start');
  kErr.hidden = true; kOk.hidden = true;
}
document.querySelectorAll<HTMLElement>('[data-k-mode]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.kMode === 'in' ? 'in' : 'up')));
$('kGuest').addEventListener('click', () => { if (S.name) { kLogin.classList.remove('on'); return; } setMode('guest'); });
let authBusy = false;
$('kProf').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (authBusy) return;
  const n = kNmI.value.trim(), em = kEm.value.trim().toLowerCase(), pw = kPw.value;
  if (mode === 'guest') {
    if (!n || !kAge.checked) { fail('Add your name and confirm your age to continue.'); (n ? kAge : kNmI).focus(); return; }
    kErr.hidden = true; kLog.classList.add('busy');
    window.setTimeout(() => { S.name = n.slice(0, 40); save(); renderMe(); renderHome(); kLog.classList.remove('busy'); kLogin.classList.remove('on'); if (S.onboarded) arrive(); else openStart(); }, still ? 0 : 600);
    return;
  }
  if (mode === 'up' && !n) { fail('Add your name.'); kNmI.focus(); return; }
  if (!emailOk(em)) { fail('Enter a valid email.'); kEm.focus(); return; }
  if (pw.length < 8) { fail('Use a longer password: at least 8 characters.'); kPw.focus(); return; }
  if (mode === 'up' && !kAge.checked) { fail('Confirm you are 18 or older.'); kAge.focus(); return; }
  authBusy = true; kLog.classList.add('busy');
  try {
    if (mode === 'up') {
      const r = await cloud.signUp(em, pw, n.slice(0, 40));
      if (!S.name) { S.name = n.slice(0, 40); save(); renderMe(); }
      if (r.needsConfirm) { setMode('in'); kEm.value = em; note('Check your email to confirm your account, then log in. Already have one? Just log in.'); }
    } else await cloud.signIn(em, pw);
    kPw.value = '';
  } catch (err) { fail(cloud.why(err)); }
  finally { authBusy = false; kLog.classList.remove('busy'); }
});
$('kForgot').addEventListener('click', async () => {
  const em = kEm.value.trim().toLowerCase();
  if (!emailOk(em)) { fail('Enter your email first.'); kEm.focus(); return; }
  try { await cloud.resetPassword(em); note('If an account exists for this email, we sent a reset link.'); } catch (err) { fail(cloud.why(err)); }
});

// Account state from Supabase: first sign-in on a device merges the synced trail with the local one.
function renderAcct() {
  $('kAcct').hidden = !cloud.enabled;
  if (!cloud.enabled) return;
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
  user = u;
  try { const remote = await cloud.pull(u.id); if (remote) mergeIn(remote); syncOk = true; }
  catch { syncOk = false; say("Couldn't load your synced trail. We'll try again."); }
  if (!S.name) S.name = u.name;
  save(); renderMe(); applyField(false); setLang(S.lang); renderAcct();
  if (kLogin.classList.contains('on')) { kLogin.classList.remove('on'); if (!S.onboarded) openStart(); else arrive(); }
};
if (cloud.enabled) void cloud.onAuth(onUser).catch(() => { /* SDK failed to load: stay local-only */ });
$('kAcctUp').addEventListener('click', () => { closeSheet(kSet); setMode('up'); kNmI.value = S.name; kLogin.classList.add('on'); kEm.focus(); });
$('kLogout').addEventListener('click', async () => {
  if (!confirm(tr('Log out? Your trail stays in your account and is removed from this device.'))) return;
  clearTimeout(pushT);
  if (user) { try { await cloud.push(user.id, snapshot()); } catch { /* best effort before leaving */ } }
  try { await cloud.signOut(); } catch { /* still clear the device */ }
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
  location.replace('/');
});
$('kDelAcc').addEventListener('click', async () => {
  if (!confirm(tr('Delete your account and your whole trail? This cannot be undone.'))) return;
  clearTimeout(pushT); // a pending sync must not race the deletion
  try { await cloud.deleteAccount(); } catch (err) { say(cloud.why(err)); return; }
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
  location.replace('/');
});
const kPwS = $('kPwS');
kPwS.addEventListener('click', (e) => { if (e.target === kPwS) closeSheet(kPwS); });
kPwS.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(kPwS); });
$('kPwF').addEventListener('submit', async (e) => {
  e.preventDefault();
  const p = $<HTMLInputElement>('kPwN').value, er = $('kPwErr');
  if (p.length < 8) { setT(er, 'Use a longer password: at least 8 characters.'); er.hidden = false; return; }
  try { await cloud.setPassword(p); $<HTMLInputElement>('kPwN').value = ''; closeSheet(kPwS); say('Password updated.'); }
  catch (err) { setT(er, cloud.why(err)); er.hidden = false; }
});
$('kIdk').addEventListener('click', () => { kS1.hidden = true; kS2.hidden = false; });
// First visit: loader > choice > interests > profile (name + 18+, or an account) > missions.
const pop = () => { // the field's object drops into the mission card
  if (still) return;
  const o = $('kNxImg');
  o.classList.remove('arrive'); void o.offsetWidth; o.classList.add('arrive');
};
const arrive = () => { goTab('missions'); pop(); };
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
  const run = () => { commit(); kStart.classList.remove('on'); applyField(changed); goTab('missions'); };
  // Shared element: the picked field's object flies from its tile into the mission card.
  const from = kS2.hidden ? null : kStart.querySelector<HTMLElement>(`#kPick [data-f="${pick}"] img`), to = $<HTMLImageElement>('kNxImg');
  if (still || !startVT || !from) return run();
  to.style.viewTransitionName = ''; from.style.viewTransitionName = 'k-hero'; vtBusy = true;
  // vt-hero: the pane joins the page crossfade, so it never paints over the onboarding screen.
  runVT('vt-hero', async () => {
    from.style.viewTransitionName = ''; to.style.viewTransitionName = 'k-hero';
    run(); // vtBusy stays on until the flight has finished (released in `after`)
    // Wait for the new image, but never hold the page if decoding stalls.
    await Promise.race([to.decode().catch(() => { /* shows when loaded */ }), new Promise((r) => setTimeout(r, 300))]);
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
  if (b.dataset.kCopy === 'dare') markDared();
  if (!(await copy(url))) { say(url); return; }
  say('Link copied.');
  const en = b.dataset.en!;
  setT(b, 'Copied'); b.classList.add('ok');
  window.setTimeout(() => { setT(b, en); b.classList.remove('ok'); }, 1600);
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
  x.font = `800 110px ${D}`; x.fillStyle = '#E8E6DA'; x.fillText('kern', 90, 210);
  x.fillStyle = '#C9F24A'; x.fillText('.', 90 + x.measureText('kern').width, 210);
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
const shareCard = async () => {
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
  if (b.dataset.kShare === 'card') { void shareCard(); return; }
  markDared();
  void shareText('KERN', tr('I dare you: {m}. Answer it on KERN, then we compare.').replace('{m}', tr(F().m[0][1])), `${location.origin}/?dare=${encodeURIComponent(S.field)}.0`, 'Link copied.');
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
      if (a.r.tip) p.push(`${it ? 'Segno' : 'Sign'}: ${a.r.tip}`);
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
  if (FIELDS[f] && Number.isInteger(n) && n >= 0 && n < 3) dare = { f, i: n };
  history.replaceState(null, '', location.pathname);
}
function renderDare() { $('kDare').hidden = !dare; if (dare) setT($('kDareT'), FIELDS[dare.f].m[dare.i][1]); }
$('kDareGo').addEventListener('click', () => { if (dare) openAnswer(dare.f, dare.i, true); });

// Settings
const setLang = (l: Lang) => {
  S.lang = l; save(); document.documentElement.lang = l;
  kTxt.forEach((e) => { const en = e.dataset.en; if (en) e.innerHTML = tr(en); });
  if (fb.dataset.src) fb.textContent = tr(fb.dataset.src);
  pressed('lang', l);
  setLvl(); renderProgress(); renderChat(); renderAcct();
};
document.querySelectorAll<HTMLElement>('[data-k-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.kLang === 'it' ? 'it' : 'en')));
$('kAv').addEventListener('click', () => openSheetEl(kSet, $('kSetX')));
$('kSetX').addEventListener('click', () => closeSheet(kSet));
$('kChField').addEventListener('click', () => { kSet.hidden = true; openStart(true); });
$('kExp').addEventListener('click', () => download(JSON.stringify({ ...snapshot(), exportedAt: new Date().toISOString() }, null, 2), 'kern-data.json', 'application/json'));
// Weekly calendar reminder (.ics): works in every calendar app, no notifications permission, no streaks.
$('kRemind').addEventListener('click', () => {
  const esc = (s: string) => s.replace(/[\\;,]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
  const p = (n: number) => String(n).padStart(2, '0');
  const d = new Date(); d.setDate(d.getDate() + 1);
  const start = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T180000`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const title = esc(tr('KERN: make one small thing'));
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Punto Due Studio//KERN//EN', 'BEGIN:VEVENT',
    `UID:kern-${Date.now()}@${location.host}`, `DTSTAMP:${stamp}`, `DTSTART:${start}`, 'DURATION:PT20M', 'RRULE:FREQ=WEEKLY',
    `SUMMARY:${title}`, `DESCRIPTION:${esc(tr('No streaks, no pressure. Open KERN when you feel like it.'))} ${location.origin}/`, `URL:${location.origin}/`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', `DESCRIPTION:${title}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  download(ics, 'kern-reminder.ics', 'text/calendar');
  say('Open the file to add the reminder to your calendar.');
});
$('kDel').addEventListener('click', () => {
  if (!confirm(tr('This deletes your trail on this device. Continue?'))) return;
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
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
addEventListener('storage', (e) => { if (e.key === KEY) location.reload(); });

// Offline support (production only, so dev reloads never serve stale files)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then((r) => r.active?.postMessage({ cache: [location.origin + '/', ...performance.getEntriesByType('resource').map((e) => e.name).filter((u) => u.startsWith(location.origin))] }))
      .catch(() => { /* offline mode unavailable; app still works online */ });
  });
}

// Start
renderMe();
applyTheme();
applyField(false);
setLang(S.lang);
renderDare();
moveInd(onTab(), false);
setMode(mode);
renderAcct();
booted = true;
if (!S.onboarded) openStart(); // the choice comes first, right after the loader
else if (!S.name) kLogin.classList.add('on');
