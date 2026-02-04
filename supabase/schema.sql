-- Profiles table (extends Supabase Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  stripe_id text,
  tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hooks table (stores user generated content)
create table hooks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, -- can be null for anon, but mainly for logged in
  topic text not null,
  platform text not null,
  content jsonb not null, -- stores the array of hooks
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics (simple metrics)
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  action_type text not null, -- e.g., 'generate_hook'
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table profiles enable row level security;
alter table hooks enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view own hooks" on hooks for select using (auth.uid() = user_id);
create policy "Users can insert own hooks" on hooks for insert with check (auth.uid() = user_id);
