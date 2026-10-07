-- KERN accounts + sync. Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- One row per user holding their trail as JSON. Row Level Security makes every row private to its owner.

create table if not exists public.kern_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now(),
  constraint kern_state_size check (pg_column_size(state) < 500000)
);

alter table public.kern_state enable row level security;

drop policy if exists "own row: read"   on public.kern_state;
drop policy if exists "own row: insert" on public.kern_state;
drop policy if exists "own row: update" on public.kern_state;
drop policy if exists "own row: delete" on public.kern_state;

create policy "own row: read"   on public.kern_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "own row: insert" on public.kern_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own row: update" on public.kern_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own row: delete" on public.kern_state for delete to authenticated using ((select auth.uid()) = user_id);

-- Lets a signed-in user delete their own account (and, by cascade, their trail). Nobody else's.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Signs on the trail: the short tip someone leaves after a mission, shown without a name to the next
-- people who open the same mission. Anyone can read visible signs (only the columns granted below, never
-- who wrote them). Writing goes only through add_sign / delete_my_sign, which act for auth.uid().
create table if not exists public.kern_signs (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  field      text not null check (field in ('Design', 'Writing', 'Code', 'Video', 'Selling', 'Music')),
  mission    smallint not null check (mission between 0 and 5),
  tip        text not null check (char_length(tip) between 3 and 140 and tip !~* '(https?://|www\.|@|[0-9]{6,})'),
  created_at timestamptz not null default now(),
  hidden     boolean not null default false
);
-- Round 2 adds missions 3 to 5. Widens the limit on a table created before it (safe to repeat).
alter table public.kern_signs drop constraint if exists kern_signs_mission_check;
alter table public.kern_signs add constraint kern_signs_mission_check check (mission between 0 and 5);
create index if not exists kern_signs_trail on public.kern_signs (field, mission, created_at desc);
alter table public.kern_signs enable row level security;

revoke all on public.kern_signs from anon, authenticated;
grant select (id, field, mission, tip, created_at, hidden) on public.kern_signs to anon, authenticated;
drop policy if exists "signs: read visible" on public.kern_signs;
create policy "signs: read visible" on public.kern_signs for select to anon, authenticated using (not hidden);

-- Adds a sign for the signed-in user; at most 20 a day each, so the trail cannot be flooded.
create or replace function public.add_sign(p_field text, p_mission smallint, p_tip text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare new_id bigint;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text, 0)); -- one add at a time per user, so the cap holds
  if (select count(*) from public.kern_signs where user_id = auth.uid() and created_at > now() - interval '1 day') >= 20 then
    raise exception 'too many signs today';
  end if;
  insert into public.kern_signs (user_id, field, mission, tip) values (auth.uid(), p_field, p_mission, btrim(p_tip)) returning id into new_id;
  return new_id;
end;
$$;

-- Removes one of the signed-in user's own signs. Nobody else's.
create or replace function public.delete_my_sign(sign_id bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.kern_signs where id = sign_id and user_id = auth.uid();
$$;

revoke all on function public.add_sign(text, smallint, text) from public, anon;
revoke all on function public.delete_my_sign(bigint) from public, anon;
grant execute on function public.add_sign(text, smallint, text) to authenticated;
grant execute on function public.delete_my_sign(bigint) to authenticated;
