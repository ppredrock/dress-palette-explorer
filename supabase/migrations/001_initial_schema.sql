-- ============================================================
-- DressPaletteExplorer — Initial Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------
-- PROFILES
-- Extends Supabase auth.users with app-specific fields
-- -------------------------------------------------------
create type user_role as enum ('user', 'admin');

create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can update all profiles"
  on profiles for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- -------------------------------------------------------
-- DRESSES
-- -------------------------------------------------------
create type dress_category as enum (
  'bridal', 'party', 'casual', 'ethnic', 'western', 'fusion', 'other'
);

create table dresses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price decimal(10,2),          -- purchase price
  rental_price decimal(10,2),   -- per-day rental
  category dress_category not null default 'other',
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dresses enable row level security;

create policy "Dresses viewable by everyone"
  on dresses for select using (true);

create policy "Only admins can manage dresses"
  on dresses for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- -------------------------------------------------------
-- DRESS BOOKINGS
-- -------------------------------------------------------
create type booking_status as enum (
  'pending', 'confirmed', 'completed', 'cancelled'
);

create table dress_bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  dress_id uuid references dresses(id) on delete restrict not null,
  start_date date not null,
  end_date date not null,
  status booking_status not null default 'pending',
  notes text,
  total_amount decimal(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dress_bookings enable row level security;

create policy "Users can view their own bookings"
  on dress_bookings for select using (auth.uid() = user_id);

create policy "Users can create bookings"
  on dress_bookings for insert with check (auth.uid() = user_id);

create policy "Admins can view all bookings"
  on dress_bookings for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all bookings"
  on dress_bookings for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- -------------------------------------------------------
-- MAKEUP SERVICES
-- -------------------------------------------------------
create type makeup_category as enum (
  'bridal', 'party', 'editorial', 'natural', 'special_effects', 'other'
);

create table makeup_services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price decimal(10,2) not null,
  duration_minutes integer not null default 60,
  category makeup_category not null default 'other',
  image_url text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table makeup_services enable row level security;

create policy "Makeup services viewable by everyone"
  on makeup_services for select using (true);

create policy "Only admins can manage makeup services"
  on makeup_services for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- -------------------------------------------------------
-- MAKEUP APPOINTMENTS
-- -------------------------------------------------------
create type appointment_status as enum (
  'pending', 'confirmed', 'completed', 'cancelled'
);

create table makeup_appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  service_id uuid references makeup_services(id) on delete restrict not null,
  appointment_date date not null,
  appointment_time time not null,
  status appointment_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table makeup_appointments enable row level security;

create policy "Users can view their own appointments"
  on makeup_appointments for select using (auth.uid() = user_id);

create policy "Users can create appointments"
  on makeup_appointments for insert with check (auth.uid() = user_id);

create policy "Admins can view all appointments"
  on makeup_appointments for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all appointments"
  on makeup_appointments for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- -------------------------------------------------------
-- LIFESTYLE POSTS
-- -------------------------------------------------------
create type post_category as enum (
  'fashion', 'makeup', 'skincare', 'lifestyle', 'travel', 'food', 'other'
);

create table lifestyle_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  tags text[] not null default '{}',
  category post_category not null default 'other',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table lifestyle_posts enable row level security;

create policy "Published posts viewable by everyone"
  on lifestyle_posts for select using (published = true);

create policy "Admins can view all posts"
  on lifestyle_posts for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can manage posts"
  on lifestyle_posts for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- -------------------------------------------------------
-- MESSAGES
-- -------------------------------------------------------
create table messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  subject text not null,
  content text not null,
  read boolean not null default false,
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "Users can view their own messages"
  on messages for select using (auth.uid() = user_id);

create policy "Users can create messages"
  on messages for insert with check (auth.uid() = user_id);

create policy "Admins can view all messages"
  on messages for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update messages (reply/mark read)"
  on messages for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- -------------------------------------------------------
-- STORAGE BUCKETS (run these separately in Supabase dashboard)
-- -------------------------------------------------------
-- insert into storage.buckets (id, name, public) values ('dresses', 'dresses', true);
-- insert into storage.buckets (id, name, public) values ('makeup', 'makeup', true);
-- insert into storage.buckets (id, name, public) values ('lifestyle', 'lifestyle', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
