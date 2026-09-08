-- Stores customer identity information connected to Supabase Auth.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  national_id text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

-- Prevents unauthenticated users from reading this table.
alter table public.profiles enable row level security;

-- Customers may read only their own profile.
drop policy if exists "customers can read their own profile"
  on public.profiles;

create policy "customers can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);


-- Creates a customer profile whenever a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    national_id
  )
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      'CIC customer'
    ),
    new.raw_user_meta_data ->> 'national_id'
  );

  return new;
end;
$$;

-- Avoids creating the same trigger more than once.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Stores policies owned by authenticated customers.
create table if not exists public.policies (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  name text not null,
  category text not null,
  premium integer not null check (premium >= 0),
  frequency text not null default 'Annual',
  status text not null default 'Active'
    check (status in ('Active', 'Expiring soon', 'Expired')),
  start_date date not null,
  end_date date not null,
  member text not null,
  benefits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

-- Protects policy records from other customers.
alter table public.policies enable row level security;

-- Customers can read only policies belonging to them.
drop policy if exists "customers can read their own policies"
  on public.policies;

create policy "customers can read their own policies"
  on public.policies
  for select
  using (auth.uid() = user_id);

-- The current prototype allows a customer to activate a policy.
drop policy if exists "customers can create their own policies"
  on public.policies;

create policy "customers can create their own policies"
  on public.policies
  for insert
  with check (auth.uid() = user_id);  

-- Stores claims submitted by authenticated customers.
create table if not exists public.claims (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_id text not null references public.policies(id) on delete restrict,
  title text not null,
  description text not null,
  status text not null default 'Pending'
    check (status in ('Pending', 'In Review', 'Approved', 'Rejected')),
  photo_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Protects claims from other customers.
alter table public.claims enable row level security;

-- Customers can read only their own claims.
drop policy if exists "customers can read their own claims"
  on public.claims;

create policy "customers can read their own claims"
  on public.claims
  for select
  using (auth.uid() = user_id);

-- Customers can submit a claim only for a policy they own.
drop policy if exists "customers can submit claims for their own policies"
  on public.claims;

create policy "customers can submit claims for their own policies"
  on public.claims
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.policies
      where policies.id = policy_id
        and policies.user_id = auth.uid()
    )
  );  