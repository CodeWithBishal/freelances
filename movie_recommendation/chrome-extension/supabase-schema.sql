-- Supabase Schema for Movie Watchlist Extension

-- 1. Create Watchlists Table
create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  emoji text default '🍿',
  color text default '#8b5cf6', -- Default purple
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Watchlist Movies Table
create table if not exists watchlist_movies (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid references watchlists(id) on delete cascade not null,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  rating numeric,
  overview text,
  release_date text,
  status text not null default 'to_watch' check (status in ('to_watch', 'watching', 'watched')),
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text default ''
);

-- Enable Row Level Security (RLS)
alter table watchlists enable row level security;
alter table watchlist_movies enable row level security;

-- 3. Watchlists Policies
-- Users can completely manage their own watchlists
create policy "Users can view their own watchlists"
on watchlists for select
using ( (select auth.uid()) = user_id );

create policy "Users can insert their own watchlists"
on watchlists for insert
with check ( (select auth.uid()) = user_id );

create policy "Users can update their own watchlists"
on watchlists for update
using ( (select auth.uid()) = user_id );

create policy "Users can delete their own watchlists"
on watchlists for delete
using ( (select auth.uid()) = user_id );

-- 4. Watchlist Movies Policies
-- Users can manage movies in watchlists they own
create policy "Users can view movies in their watchlists"
on watchlist_movies for select
using (
  exists (
    select 1 from watchlists
    where watchlists.id = watchlist_movies.watchlist_id
    and watchlists.user_id = (select auth.uid())
  )
);

create policy "Users can insert movies to their watchlists"
on watchlist_movies for insert
with check (
  exists (
    select 1 from watchlists
    where watchlists.id = watchlist_movies.watchlist_id
    and watchlists.user_id = (select auth.uid())
  )
);

create policy "Users can update movies in their watchlists"
on watchlist_movies for update
using (
  exists (
    select 1 from watchlists
    where watchlists.id = watchlist_movies.watchlist_id
    and watchlists.user_id = (select auth.uid())
  )
);

create policy "Users can delete movies in their watchlists"
on watchlist_movies for delete
using (
  exists (
    select 1 from watchlists
    where watchlists.id = watchlist_movies.watchlist_id
    and watchlists.user_id = (select auth.uid())
  )
);
