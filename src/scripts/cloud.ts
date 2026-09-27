// Optional accounts + sync via Supabase. Without PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY
// the app runs local-only and this module stays inert (the SDK is never downloaded).
//
//   app ──signUp/signIn──> Supabase Auth ──session──> onAuth(user)
//   app ──pull/push(state)──> table kern_state (RLS: each user reads/writes only their own row)
import type { SupabaseClient, Session } from '@supabase/supabase-js';

const URL_ = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const KEY_ = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const enabled = !!(URL_ && KEY_ && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(URL_));

export type User = { id: string; email: string; name: string };
let sb: SupabaseClient | null = null;
const client = async () => {
  if (!enabled) throw new Error('cloud disabled');
  if (!sb) {
    const { createClient } = await import('@supabase/supabase-js');
    sb = createClient(URL_!, KEY_!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } });
  }
  return sb;
};
const toUser = (s: Session | null): User | null => (s ? { id: s.user.id, email: s.user.email || '', name: String(s.user.user_metadata?.name || '').slice(0, 40) } : null);

// Friendly, non-leaky messages for the errors people actually hit.
export const why = (e: unknown): string => {
  const m = String((e as { message?: string })?.message || e || '').toLowerCase();
  if (m.includes('invalid login')) return 'Wrong email or password.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'This email already has an account. Log in instead.';
  if (m.includes('not confirmed')) return 'Confirm your email first. Check your inbox.';
  if (m.includes('password') && (m.includes('least') || m.includes('weak') || m.includes('short'))) return 'Use a longer password: at least 8 characters.';
  if (m.includes('rate') || m.includes('too many') || m.includes('security purposes')) return 'Too many tries. Wait a minute and try again.';
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to')) return 'No connection. Try again.';
  return 'Something went wrong. Try again.';
};

// Callback runs outside the auth lock (Supabase warns against awaiting inside onAuthStateChange).
export const onAuth = async (cb: (u: User | null, event: string) => void) => {
  if (!enabled) return;
  const c = await client();
  c.auth.onAuthStateChange((event, session) => { window.setTimeout(() => cb(toUser(session), event), 0); });
};

export const signUp = async (email: string, password: string, name: string) => {
  const c = await client();
  const { data, error } = await c.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/`, data: { name, age_confirmed: true } } });
  if (error) throw error;
  return { needsConfirm: !data.session };
};
export const signIn = async (email: string, password: string) => {
  const { error } = await (await client()).auth.signInWithPassword({ email, password });
  if (error) throw error;
};
export const resetPassword = async (email: string) => {
  const { error } = await (await client()).auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/` });
  if (error) throw error;
};
export const setPassword = async (password: string) => {
  const { error } = await (await client()).auth.updateUser({ password });
  if (error) throw error;
};
export const signOut = async () => { await (await client()).auth.signOut(); };
export const deleteAccount = async () => {
  const c = await client();
  const { error } = await c.rpc('delete_my_account');
  if (error) throw error;
  await c.auth.signOut();
};

export const pull = async (uid: string): Promise<unknown | null> => {
  const { data, error } = await (await client()).from('kern_state').select('state').eq('user_id', uid).maybeSingle();
  if (error) throw error;
  return data ? data.state : null;
};
export const push = async (uid: string, state: unknown) => {
  const { error } = await (await client()).from('kern_state').upsert({ user_id: uid, state, updated_at: new Date().toISOString() });
  if (error) throw error;
};

// Signs on the trail (table kern_signs): the latest tips left on a mission, readable by anyone, never
// with who wrote them. Writes go through add_sign / delete_my_sign, which act for the signed-in user.
export type Sign = { tip: string; at: string };
export const signs = async (field: string, mission: number): Promise<Sign[]> => {
  const { data, error } = await (await client()).from('kern_signs').select('tip, created_at')
    .eq('field', field).eq('mission', mission).order('created_at', { ascending: false }).limit(3);
  if (error) throw error;
  return (data || []).map((r) => ({ tip: String(r.tip).slice(0, 140), at: String(r.created_at) }));
};
export const addSign = async (field: string, mission: number, tip: string): Promise<number> => {
  const { data, error } = await (await client()).rpc('add_sign', { p_field: field, p_mission: mission, p_tip: tip });
  if (error) throw error;
  return Number(data);
};
export const removeSign = async (id: number) => {
  const { error } = await (await client()).rpc('delete_my_sign', { sign_id: id });
  if (error) throw error;
};
