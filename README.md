# Hamad Town School Website

A responsive school-story website made with plain HTML, CSS and JavaScript. The visual direction uses **gold, baby blue and white**, with gentle movement, editorial-style layouts, achievement cards, activities, community stories, a photo gallery and a dedicated content-management portal.

**Language:** Arabic is the default language with a right-to-left layout. Use the **English / العربية** toggle in the website header or school portal to switch languages; the selected language is remembered in the current browser.

New school content is entered in both Arabic and English from the admin portal. Choose the destination section — Our story, Achievements, School life, Stories, or Gallery — and the editor filters content types for that section. In Our story, choose either a standard card or a large image-and-text feature card. For Achievements, add optional student/team, competition, result, organizer, date and extended-details fields in both languages; these appear on cards and in their detail dialog. Existing records are mapped to their matching sections; run the updated `supabase/schema.sql` once to add the section, layout and achievement-detail columns to an existing Supabase project.

## What is included

- `index.html` — Arabic-first homepage and icon-based section directory.
- `story.html` — the school's identity, values and story.
- `achievements.html` — the dedicated achievements and awards page.
- `school-life.html` — the dedicated school activities, clubs and events page.
- `stories.html` — stories from students, teachers and the school community.
- `gallery.html` — the dedicated school photo gallery.
- `specializations.html`, `specializations.css` — a bilingual guide to the scientific, commercial and literary secondary-school tracks, with pathway indicators and examples of university programmes.
- `cinematic-intro.css`, `cinematic-intro.js` — cinematic welcome on the first visit and on manual refreshes; internal page navigation and browser back/forward do not replay it. Features a layered aperture reveal, precision light sweeps, animated orbital rings, a framed emblem stage, bilingual identity reveal and an original Web Audio soundtrack.
- `contact.html`, `contact.css`, `contact.js` — optional visitor contact form that sends suggestions and messages to the private school admin inbox.
- `language.js` — Arabic/English switcher, RTL/LTR layout handling and translations.
- `styles.css` — responsive design system, motion, icon cards, page layouts and mobile navigation.
- `mobile.css` — dedicated phone and small-screen presentation layer for all public pages and the admin portal; it is loaded after existing styles and leaves desktop layouts intact.
- `app.js` — renders published achievements, activities, stories and gallery entries on their own pages.
- `admin.html`, `admin.css`, `admin.js` — content editor, image preview/upload, drafts, publish toggles, filters, editing/deleting, JSON export and a private visitor-message inbox.
- `config.js` — optional Supabase project configuration.
- `supabase/schema.sql` — database tables, admin allow-list, visitor-message inbox, row-level security and image bucket policies.

The specializations page shows pathway-structure indicators rather than school enrolment, average-grade or pass-rate figures. Add school-specific statistics only after the school confirms the numbers.

Demo imagery and example stories are placeholders. Replace them with school-approved photos, verified achievements and accurate information before the public launch.

## Mobile experience

The site keeps its existing features and desktop layout. A separate `mobile.css` layer is loaded last on every page, improving navigation, spacing, card layouts, reading sizes, touch targets, detail dialogs, forms and the admin editor on phones. The stylesheet is limited to small-screen media queries, so desktop presentation and the existing HTML, JavaScript and Supabase behavior remain in place.

## Run the site locally

For predictable behavior with local assets and external fonts/images, serve the folder through a local web server rather than opening files directly. From this folder, for example:

The cinematic welcome appears automatically when a visitor first opens a public page and whenever they manually refresh it. Moving between pages inside the school website, or using browser back/forward, does not replay the intro. The visual sequence starts automatically; visitors can tap **Play cinematic sound** to enable its original soundtrack (browser audio policies require a user gesture), or skip the intro. The school admin page is excluded.

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

The repository's `config.js` is connected to the active Supabase project **HAMAD TOWN**. It uses a browser-safe publishable key; do not replace it with a service-role or secret key. The live project has the schema from `supabase/schema.sql`, row-level security policies, and the `school-media` image bucket applied.

The public `contact.html` form inserts visitor messages into `public.school_messages`. All four fields (name, email, phone and message) are optional. Anonymous visitors may submit messages only; only users listed in `public.school_admins` can read messages or mark them as read in the admin portal. Re-run the updated `supabase/schema.sql` on other environments to create this table and its policies.

To create the first school administrator:

1. In Supabase Dashboard, open **Authentication → Users** and create a user with the intended admin email and password, or invite that email and finish the invitation/password setup. The portal does not provide public administrator registration.
2. In **SQL Editor**, replace `admin@example.com` with the exact email of that Auth user and run:

   ```sql
   insert into public.school_admins (user_id)
   select id
   from auth.users
   where lower(email) = lower('admin@example.com')
   on conflict (user_id) do nothing;
   ```

   If no row is inserted, first confirm that the Auth user exists and that the email is correct.
3. Open `admin.html`, sign in with that account's email and password, and publish a test entry. The portal verifies the allow-list before showing the content editor.
4. Confirm the entry appears on the public website in a separate browser/device.

Only accounts listed in `public.school_admins` can manage shared content. Anonymous visitors can read published records only; drafts and write operations remain protected by row-level security. The schema can also be run on a fresh Supabase project through Dashboard → SQL Editor.

The public `school-media` bucket serves approved images. Only approved administrators may upload/delete images, and uploads are stored under the user's ID folder. Images up to 8 MB are supported.

## Before going live

- Replace the example images and sample copy with accurate school information.
- Ask permission before posting identifiable student photos or personal stories, and follow school safeguarding/privacy rules.
- Add only approved administrators to `public.school_admins`.
- Test sign-in, public reads, image uploads, editing, delete permissions and draft visibility.
- Add the school's official logo, address, contact details and approved social links when available.
- Consider a custom domain and a school-owned account for long-term hosting.
