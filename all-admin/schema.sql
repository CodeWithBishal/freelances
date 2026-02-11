-- ============================================
-- TheTechArch Admin — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  company text not null default '',
  avatar text default '',
  phone text default '',
  address text default '',
  joined_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table clients enable row level security;
create policy "Users can manage their own clients"
  on clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Orders
create table if not exists orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  service_name text not null,
  status text not null default 'active' check (status in ('active','completed','cancelled','pending','expired')),
  amount numeric not null default 0,
  due_date timestamptz,
  created_at timestamptz default now(),
  billing_freq text not null default 'one-time' check (billing_freq in ('one-time','monthly','yearly')),
  description text default ''
);

alter table orders enable row level security;
create policy "Users can manage their own orders"
  on orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Quotes
create table if not exists quotes (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  client_name text default '',
  title text not null,
  total_amount numeric not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected')),
  valid_until timestamptz,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table quotes enable row level security;
create policy "Users can manage their own quotes"
  on quotes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  is_deleted boolean default false
);

alter table notes enable row level security;
create policy "Users can manage their own notes"
  on notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Credentials
create table if not exists credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  service text not null,
  username text not null,
  password_encrypted text not null,
  created_at timestamptz default now()
);

alter table credentials enable row level security;
create policy "Users can manage their own credentials"
  on credentials for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Todos
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  status text not null default 'todo' check (status in ('todo','in-progress','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date timestamptz,
  client_id uuid references clients(id) on delete set null,
  created_at timestamptz default now()
);

alter table todos enable row level security;
create policy "Users can manage their own todos"
  on todos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
