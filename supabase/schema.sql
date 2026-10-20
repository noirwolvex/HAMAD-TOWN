-- Hamad Town School CMS: shared publishing schema for Supabase
-- Run this file in Supabase Dashboard -> SQL Editor.
-- It is safe to re-run: tables, policies and trigger are created idempotently.

create extension if not exists pgcrypto;

create table if not exists public.school_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('about', 'achievement', 'award', 'activity', 'story', 'teacher', 'student', 'event', 'gallery')),
  section text not null default '',
  title text not null,
  title_ar text not null default '',
  title_en text not null default '',
  eyebrow text not null default '',
  eyebrow_ar text not null default '',
  eyebrow_en text not null default '',
  year text not null default '',
  description text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add bilingual fields on existing installations as well as fresh projects.
alter table public.school_content add column if not exists section text not null default '';
alter table public.school_content add column if not exists title_ar text not null default '';
alter table public.school_content add column if not exists title_en text not null default '';
alter table public.school_content add column if not exists eyebrow_ar text not null default '';
alter table public.school_content add column if not exists eyebrow_en text not null default '';
alter table public.school_content add column if not exists description_ar text not null default '';
alter table public.school_content add column if not exists description_en text not null default '';

-- Allow the dedicated Our story content type and preserve legacy records.
alter table public.school_content drop constraint if exists school_content_kind_check;
alter table public.school_content
  add constraint school_content_kind_check
  check (kind in ('about', 'achievement', 'award', 'activity', 'story', 'teacher', 'student', 'event', 'gallery'));

-- Assign existing records to their public section while preserving their content and IDs.
update public.school_content
set section = case kind
  when 'about' then 'our-story'
  when 'achievement' then 'achievements'
  when 'award' then 'achievements'
  when 'activity' then 'school-life'
  when 'event' then 'school-life'
  when 'story' then 'stories'
  when 'teacher' then 'stories'
  when 'student' then 'stories'
  when 'gallery' then 'gallery'
  else 'stories'
end
where section = '';

alter table public.school_content drop constraint if exists school_content_section_check;
alter table public.school_content
  add constraint school_content_section_check
  check (section in ('', 'our-story', 'achievements', 'school-life', 'stories', 'gallery'));

-- Preserve existing records while providing fallback text in both languages.
update public.school_content
set title_ar = coalesce(nullif(title_ar, ''), title),
    title_en = coalesce(nullif(title_en, ''), title),
    eyebrow_ar = coalesce(nullif(eyebrow_ar, ''), eyebrow),
    eyebrow_en = coalesce(nullif(eyebrow_en, ''), eyebrow),
    description_ar = coalesce(nullif(description_ar, ''), description),
    description_en = coalesce(nullif(description_en, ''), description)
where title_ar = '' or title_en = '' or eyebrow_ar = '' or eyebrow_en = ''
   or description_ar = '' or description_en = '';

-- Seed editable Our story cards with stable IDs; re-running this script does not overwrite edits.
insert into public.school_content
  (id, kind, section, title, title_ar, title_en, eyebrow, eyebrow_ar, eyebrow_en,
   year, description, description_ar, description_en, image_url, featured, published, order_index)
values
  ('10000000-0000-4000-8000-000000000001', 'about', 'our-story', 'Our vision', 'رؤيتنا', 'Our vision',
   'OUR VISION', 'رؤيتنا', 'OUR VISION', '',
   'نطمح إلى بيئة تعليمية تشجّع التفكير والإبداع، وتساعد كل طالب على اكتشاف إمكاناته وبناء ثقته بنفسه.',
   'نطمح إلى بيئة تعليمية تشجّع التفكير والإبداع، وتساعد كل طالب على اكتشاف إمكاناته وبناء ثقته بنفسه.',
   'We aspire to create a learning environment that encourages thinking and creativity, helping every student discover their potential and build confidence.',
   '', true, true, 1),
  ('10000000-0000-4000-8000-000000000002', 'about', 'our-story', 'Our mission', 'رسالتنا', 'Our mission',
   'OUR MISSION', 'رسالتنا', 'OUR MISSION', '',
   'نعزّز التعاون بين الطلاب والمعلمين والأسر، ونحتفي بالاجتهاد والسلوك الإيجابي وكل خطوة نحو التقدّم.',
   'نعزّز التعاون بين الطلاب والمعلمين والأسر، ونحتفي بالاجتهاد والسلوك الإيجابي وكل خطوة نحو التقدّم.',
   'We encourage collaboration among students, teachers and families, celebrating effort, positive character and every step forward.',
   '', true, true, 2),
  ('10000000-0000-4000-8000-000000000003', 'about', 'our-story', 'Our values', 'قيمنا', 'Our values',
   'CURIOSITY · RESPECT · GROWTH', 'فضول · احترام · نمو', 'CURIOSITY · RESPECT · GROWTH', '',
   'نؤمن بأن الأسئلة بداية الاكتشاف، وأن اللطف والاحترام يجعلان مجتمعنا أقوى، وأن كل تجربة فرصة للتعلّم.',
   'نؤمن بأن الأسئلة بداية الاكتشاف، وأن اللطف والاحترام يجعلان مجتمعنا أقوى، وأن كل تجربة فرصة للتعلّم.',
   'We believe questions begin discovery, kindness and respect make our community stronger, and every experience is an opportunity to learn.',
   '', true, true, 3),
  ('10000000-0000-4000-8000-000000000004', 'about', 'our-story', 'Our journey continues', 'رحلتنا مستمرة', 'Our journey continues',
   'EVERY STUDENT IS PART OF THE STORY', 'كل طالب جزء من الحكاية', 'EVERY STUDENT IS PART OF THE STORY', '',
   'مدرسة مدينة حمد مجتمع يجمع بين المعرفة والفضول والاحترام، ويؤمن بأن لكل طالب قدرة على النمو وصناعة مستقبل مشرق.',
   'مدرسة مدينة حمد مجتمع يجمع بين المعرفة والفضول والاحترام، ويؤمن بأن لكل طالب قدرة على النمو وصناعة مستقبل مشرق.',
   'Hamad Town School is a community built around knowledge, curiosity and respect. We believe every student can grow and help shape a bright future.',
   '', true, true, 4)
on conflict (id) do nothing;

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
