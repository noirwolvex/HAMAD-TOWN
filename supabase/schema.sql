-- Hamad Town School CMS: shared publishing schema for Supabase
-- Run this file in Supabase Dashboard -> SQL Editor.
-- It is safe to re-run: tables, policies and trigger are created idempotently.

create extension if not exists pgcrypto;

create table if not exists public.school_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('achievement', 'award', 'activity', 'story', 'teacher', 'student', 'event', 'gallery')),
  title text not null,
  eyebrow text not null default '',
  year text not null default '',
  description text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.school_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.school_content enable row level security;
alter table public.school_admins enable row level security;

-- Admin status is checked by a small SECURITY DEFINER function. Direct access
-- to the allow-list table remains revoked from browser clients.
create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.school_admins a
    where a.user_id = auth.uid()
  );
$$;

revoke all on public.school_admins from anon, authenticated;
revoke all on function public.is_school_admin() from public;
grant execute on function public.is_school_admin() to anon, authenticated;

grant select on public.school_content to anon, authenticated;
grant insert, update, delete on public.school_content to authenticated;

drop policy if exists "Published school content is public" on public.school_content;
create policy "Published school content is public"
on public.school_content
for select
to anon, authenticated
using (published = true or public.is_school_admin());

drop policy if exists "School admins can insert content" on public.school_content;
create policy "School admins can insert content"
on public.school_content
for insert
to authenticated
with check (public.is_school_admin());

drop policy if exists "School admins can update content" on public.school_content;
create policy "School admins can update content"
on public.school_content
for update
to authenticated
using (public.is_school_admin())
with check (public.is_school_admin());

drop policy if exists "School admins can delete content" on public.school_content;
create policy "School admins can delete content"
on public.school_content
for delete
to authenticated
using (public.is_school_admin());

create or replace function public.set_school_content_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists school_content_set_updated_at on public.school_content;
create trigger school_content_set_updated_at
before update on public.school_content
for each row execute function public.set_school_content_updated_at();

-- A public bucket serves approved photos. Only an authenticated school admin
-- may upload/delete files, and uploads are placed in that user's folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'school-media',
  'school-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "School media is publicly readable" on storage.objects;
create policy "School media is publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'school-media');

drop policy if exists "School admins can upload media" on storage.objects;
create policy "School admins can upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'school-media'
  and public.is_school_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "School admins can delete their media" on storage.objects;
create policy "School admins can delete their media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'school-media'
  and public.is_school_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- SET UP THE FIRST ADMIN:
-- 1. Create an Auth user in Supabase Dashboard -> Authentication -> Users.
-- 2. Replace the example email and run the statement below.
--
-- insert into public.school_admins (user_id)
-- select id from auth.users where email = 'admin@your-school.example'
-- on conflict (user_id) do nothing;
