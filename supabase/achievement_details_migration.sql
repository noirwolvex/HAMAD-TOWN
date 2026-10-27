-- Add expanded bilingual achievement metadata to an existing Hamad Town CMS.
-- Safe to apply more than once; existing achievement records are preserved.
alter table public.school_content
  add column if not exists achievement_level_ar text not null default '',
  add column if not exists achievement_level_en text not null default '',
  add column if not exists achievement_field_ar text not null default '',
  add column if not exists achievement_field_en text not null default '',
  add column if not exists achievement_grade_ar text not null default '',
  add column if not exists achievement_grade_en text not null default '',
  add column if not exists achievement_mentor_ar text not null default '',
  add column if not exists achievement_mentor_en text not null default '',
  add column if not exists achievement_impact_ar text not null default '',
  add column if not exists achievement_impact_en text not null default '',
  add column if not exists achievement_certificate_url text not null default '';
