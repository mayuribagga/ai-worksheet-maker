-- Profiles and worksheets.
-- Run in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Profiles: one row per user, created automatically when they sign up.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Add profiles for anyone who signed up before this trigger existed.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Worksheets: every worksheet a user generates.
-- ---------------------------------------------------------------------------
create table public.worksheets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  grade smallint not null check (grade between 1 and 12),
  course_code text not null,
  topic_id text not null,
  style_id text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

create index worksheets_user_id_created_at_idx
  on public.worksheets (user_id, created_at desc);

alter table public.worksheets enable row level security;

create policy "Users can view their own worksheets"
  on public.worksheets for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own worksheets"
  on public.worksheets for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own worksheets"
  on public.worksheets for delete
  to authenticated
  using ((select auth.uid()) = user_id);
