// Usage counts without names. Off until the person says yes (Home card or Settings). What leaves the device: a random id made
// when they said yes, the kind of event, the mission, the language and the time. Never the name, an answer, a draft, a chat
// message or an account id. The random id is still personal data (it is pseudonymous), which is why it is opt-in. cloud.ts sends it, supabase/schema.sql holds it, scripts/stats.mjs turns it into numbers.
// Counting is best effort and never gets in the way of the app.
import * as cloud from './cloud';
import { SPONSORS } from './sponsors';

export type Ev = 'optin' | 'visit' | 'open' | 'answer' | 'reflect' | 'share' | 'ask_ai';
type Prefs = { on: boolean; id: string; day: string };

// Its own key, never synced: the choice belongs to this device, and Delete my data removes it.
const KEY = 'kern:stats';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const read = (): Prefs | null => {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!p || typeof p.on !== 'boolean') return null;
    const id = typeof p.id === 'string' && UUID.test(p.id) ? p.id : '';
    return { on: p.on && !!id, id, day: typeof p.day === 'string' ? p.day.slice(0, 10) : '' };
  } catch { return null; }
};
const write = (p: Prefs) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage blocked: counting stays off */ } };

export const available = cloud.enabled; // without Supabase there is nowhere to send counts
export const decided = () => read() !== null; // said yes or no already
export const isOn = () => !!read()?.on;

let visiting = ''; // the day whose visit is being sent, so the first open and a resume do not both send it
export function track(ev: Ev, field: string | undefined, mission: number | undefined, lang: string) {
  const p = read();
  if (!cloud.enabled || !p?.on) return;
  const today = new Date().toLocaleDateString('en-CA');
  if (ev === 'visit') { // one visit per local day per device
    if (p.day === today || visiting === today) return;
    visiting = today;
  }
  const brand = field !== undefined && mission !== undefined && !!SPONSORS[`${field}.${mission}`];
  cloud.logEvent({ aid: p.id, ev, field: field ?? null, mission: mission ?? null, brand, lang }).then(() => {
    const now = read();
    if (ev === 'visit' && now?.on && now.id === p.id) write({ ...now, day: today }); // only after it was sent, so an offline first open is retried
  }, () => { visiting = ''; /* offline or over the daily cap: a lost count is fine, a broken app is not */ });
}

export function turnOn(lang: string): boolean {
  if (read()?.on) return true; // another tab already said yes: keep its id, a new one would orphan the old rows
  const id = globalThis.crypto?.randomUUID?.();
  if (!id) return false; // an old browser: stay off rather than invent an id
  write({ on: true, id, day: '' });
  if (!read()?.on) return false; // storage is blocked: nothing was saved, so nothing is counted
  track('optin', undefined, undefined, lang);
  return true;
}
export const decline = () => write({ on: false, id: '', day: '' });

// Deletes what was counted for this device. false = the server could not be reached (those rows expire after 12 months).
const forget = async (id: string): Promise<boolean> => {
  if (!id) return true;
  try { await cloud.forgetEvents(id); return true; } catch { return false; }
};
export async function turnOff(): Promise<boolean> {
  const id = read()?.id || '';
  decline(); // stop counting first: an event sent while the delete is in flight would otherwise be left behind
  return forget(id);
}
// Delete my data, Log out, Delete my account: forget the choice too, so the next person here is asked again.
// Waits for the delete (at most a moment) because these actions reload the page right after.
const GIVE_UP_MS = 1500;
export async function erase(): Promise<void> {
  const id = read()?.id || '';
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
  await Promise.race([forget(id), new Promise((done) => setTimeout(done, GIVE_UP_MS))]);
}
