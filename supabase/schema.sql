-- Periodic Roll: run this whole file once in Supabase > SQL Editor > New query > Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (char_length(username) between 3 and 16),
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_username_lower on public.profiles (lower(username));

create table if not exists public.saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  life double precision not null default 0,
  best_odds double precision not null default 0,
  best_sq jsonb,
  level int not null default 1,
  rolls double precision not null default 0,
  found int not null default 0,
  rebirths int not null default 0,
  updated_at timestamptz not null default now()
);

-- creates the profile (display name) automatically when someone signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), 'player' || substr(new.id::text, 1, 6)));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.saves enable row level security;

drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);

drop policy if exists "own save select" on public.saves;
drop policy if exists "own save insert" on public.saves;
drop policy if exists "own save update" on public.saves;
create policy "own save select" on public.saves for select using (auth.uid() = user_id);
create policy "own save insert" on public.saves for insert with check (auth.uid() = user_id);
create policy "own save update" on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- public worldwide leaderboard: only names and scores, never emails or save data
create or replace view public.leaderboard as
  select s.user_id, p.username, s.life, s.best_odds, s.best_sq, s.level, s.rolls, s.found, s.rebirths
  from public.saves s join public.profiles p on p.id = s.user_id
  where s.life > 0;
grant select on public.leaderboard to anon, authenticated;
grant select on public.profiles to anon, authenticated;
