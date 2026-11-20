-- Daily limit on how many worksheets each user can generate.
-- Run after 0002 in the Supabase SQL Editor.

-- Track how many worksheets each user has generated today (Toronto time).
alter table public.profiles
  add column generations_today integer not null default 0,
  add column generations_date date not null default (now() at time zone 'America/Toronto')::date;

-- Users may still edit their display name, but not the usage counters.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Counts one generation for the signed-in user if they're under today's limit.
-- Returns how many they have left after this one, or -1 if they're at the limit.
-- The limit lives here, not in the app, so it can't be changed from the browser.
create function public.use_generation()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  daily_limit constant integer := 10;
  today date := (now() at time zone 'America/Toronto')::date;
  used integer;
begin
  -- One statement, so two requests at the same moment can't both slip through.
  update public.profiles
     set generations_today = case when generations_date = today then generations_today + 1 else 1 end,
         generations_date = today
   where id = auth.uid()
     and (generations_date <> today or generations_today < daily_limit)
  returning generations_today into used;

  if used is null then
    return -1;
  end if;
  return daily_limit - used;
end;
$$;

revoke execute on function public.use_generation() from public, anon;
grant execute on function public.use_generation() to authenticated;
