-- School news publishing support.
-- Safe to re-run: replaces only the content kind/section allow-list constraints
-- and creates an idempotent partial index for the public news feed.

alter table public.school_content
  drop constraint if exists school_content_kind_check;

alter table public.school_content
  add constraint school_content_kind_check
  check (kind in (
    'about', 'achievement', 'award', 'activity', 'story',
    'teacher', 'student', 'event', 'gallery',
    'announcement', 'update'
  ));

alter table public.school_content
  drop constraint if exists school_content_section_check;

alter table public.school_content
  add constraint school_content_section_check
  check (section in (
    '', 'our-story', 'achievements', 'school-life',
    'stories', 'gallery', 'news'
  ));

create index if not exists school_content_news_published_created_idx
  on public.school_content (created_at desc)
  where section = 'news' and published = true;
