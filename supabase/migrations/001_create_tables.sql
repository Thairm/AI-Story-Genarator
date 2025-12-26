-- =============================================
-- AI Faceless Content Generator - Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Profiles table (linked to Supabase Auth users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro')),
  stripe_customer_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Credits table (user's current credit balance)
create table if not exists credits (
  user_id uuid references profiles(id) on delete cascade primary key,
  paid_credits integer default 0,
  free_credits integer default 500,
  audio_redos_used integer default 0,
  audio_redo_limit integer default 0,
  credits_reset_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Credit transactions table (history of credit usage)
create table if not exists credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('video_generation', 'audio_redo', 'subscription_credit', 'free_credit', 'refund')),
  description text,
  created_at timestamp with time zone default now()
);

-- 4. Subscriptions table (Stripe subscription info)
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text default 'inactive',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table credits enable row level security;
alter table credit_transactions enable row level security;
alter table subscriptions enable row level security;

-- Profiles policies
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Credits policies
create policy "Users can view own credits" 
  on credits for select 
  using (auth.uid() = user_id);

-- Credit transactions policies
create policy "Users can view own transactions" 
  on credit_transactions for select 
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view own subscription" 
  on subscriptions for select 
  using (auth.uid() = user_id);

-- =============================================
-- Trigger: Auto-create profile and credits on signup
-- =============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create profile
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create credits with free tier defaults
  insert into public.credits (user_id, free_credits, audio_redo_limit)
  values (new.id, 500, 0);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Trigger: Update timestamps automatically
-- =============================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to profiles
drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure public.update_updated_at();

-- Apply to credits
drop trigger if exists credits_updated_at on credits;
create trigger credits_updated_at
  before update on credits
  for each row execute procedure public.update_updated_at();

-- Apply to subscriptions
drop trigger if exists subscriptions_updated_at on subscriptions;
create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure public.update_updated_at();
