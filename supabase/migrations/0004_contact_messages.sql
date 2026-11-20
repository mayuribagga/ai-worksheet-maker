-- Messages sent through the Contact page.
-- Run after 0003 in the Supabase SQL Editor.
-- Read them in the Supabase dashboard: Table Editor → contact_messages.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  message text not null check (char_length(message) between 10 and 5000),
  -- Filled in automatically if the sender is signed in.
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can send a message, but can't attach it to someone else's account.
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

-- There are no select, update or delete policies, so messages can't be read
-- or changed through the app. Only you can see them, in the Supabase dashboard.
