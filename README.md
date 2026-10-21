# Hamad Town School Website

A responsive school-story website made with plain HTML, CSS and JavaScript. The visual direction uses **gold, baby blue and white**, with gentle movement, editorial-style layouts, achievement cards, activities, community stories, a photo gallery and a dedicated content-management portal.

**Language:** Arabic is the default language with a right-to-left layout. Use the **English / العربية** toggle in the website header or school portal to switch languages; the selected language is remembered in the current browser.

New school content is entered in both Arabic and English from the admin portal. Choose the destination section — Our story, Achievements, School life, Stories, or Gallery — and the editor filters content types for that section. In Our story, choose either a standard card or a large image-and-text feature card. For Achievements, add optional student/team, competition, result, organizer, date and extended-details fields in both languages; these appear on cards and in their detail dialog. For School life, the editor also supports activity date/time, location, organizer, target audience, duration, learning goals, outcomes and full details in Arabic and English. The public activity list shows available date/location/audience information, while the detail dialog displays all saved fields. Existing records are preserved; run the updated `supabase/schema.sql` once to add the section, layout, achievement-detail and school-life columns to an existing Supabase project.

## What is included

- `index.html` — Arabic-first homepage and icon-based section directory.
- `story.html` — the school's identity, values and story.
- `achievements.html` — the dedicated achievements and awards page.
- `school-life.html` — the dedicated school activities, clubs and events page.
- `stories.html` — stories from students, teachers and the school community.
- `gallery.html` — the dedicated school photo gallery.
- `language.js` — Arabic/English switcher, RTL/LTR layout handling and translations.
- `styles.css` — responsive design system, motion, icon cards, page layouts and mobile navigation.
- `app.js` — renders published achievements, activities, stories and gallery entries on their own pages.
- `admin.html`, `admin.css`, `admin.js` — content editor, image preview/upload, drafts, publish toggles, filters, editing/deleting and JSON export.
- `config.js` — optional Supabase project configuration.
- `supabase/schema.sql` — database tables, admin allow-list, row-level security and image bucket policies.

Demo imagery and example stories are placeholders. Replace them with school-approved photos, verified achievements and accurate information before the public launch.

## Run the site locally

For predictable behavior with local assets and external fonts/images, serve the folder through a local web server rather than opening files directly. From this folder, for example:

```bash
python -m http.server 8000
```

Then open:

- Public website: `http://localhost:8000/`
- School portal: `http://localhost:8000/admin.html`

Any static web host can serve these files. GitHub Pages can host the public site from the repository's `main` branch and root folder (Settings → Pages).

## Admin portal modes

### Demo mode (works without backend setup)

The portal starts in demo mode until Supabase is configured. You can try creating/editing/deleting entries, previewing photos and exporting JSON. Demo content is stored in that browser's `localStorage`, so it **does not publish to other devices or visitors**. In demo mode, photos must be no larger than 1 MB because browser storage is limited.

Do not treat demo mode as an authenticated production admin system.

### Shared publishing with Supabase

To allow approved school staff to publish content that appears for every visitor:

1. Create a Supabase project.
2. In Supabase Dashboard → SQL Editor, run the complete `supabase/schema.sql` file.
3. In Supabase Dashboard → Authentication → Users, create the first admin account using email/password.
4. In SQL Editor, replace the example email in the final statement in `supabase/schema.sql` and run it:

   ```sql
   insert into public.school_admins (user_id)
   select id from auth.users where email = 'admin@your-school.example'
   on conflict (user_id) do nothing;
   ```

5. Copy the project's **Project URL** and **anon/public key** into `config.js`:

   ```js
   window.SCHOOL_CONFIG = {
     supabaseUrl: "https://YOUR_PROJECT.supabase.co",
     supabaseAnonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY"
   };
   ```

6. Publish the updated files to your static host. Open `admin.html`, sign in using the admin account, and publish a test entry. Verify it appears in the public website in a separate browser/device.

**Never put a Supabase `service_role` key in `config.js` or browser code.** The anon/public key is intended for clients; row-level security in `schema.sql` protects writes and media uploads. Only accounts added to `public.school_admins` can write shared content.

The schema uses a public image bucket so published image URLs can be shown on the public site. Only authenticated school administrators may upload/delete images. The site accepts image uploads up to 8 MB with Supabase.

## Before going live

- Replace the example images and sample copy with accurate school information.
- Ask permission before posting identifiable student photos or personal stories, and follow school safeguarding/privacy rules.
- Add only approved administrators to `public.school_admins`.
- Test sign-in, public reads, image uploads, editing, delete permissions and draft visibility.
- Add the school's official logo, address, contact details and approved social links when available.
- Consider a custom domain and a school-owned account for long-term hosting.
