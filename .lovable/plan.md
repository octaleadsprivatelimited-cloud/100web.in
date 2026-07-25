This is a large build. I'll ship it in clearly separated phases so you can validate each before we move on. UI stays clean and minimal like microsoft.com — white surfaces, generous spacing, subtle borders, Segoe/Inter-style typography we already use, no heavy gradients. Fully responsive (mobile drawer nav, tablet 2-col, desktop sidebar + content).

## Phase 1 — Foundations (Cloud + auth + roles)
- Enable Lovable Cloud (Supabase under the hood).
- Auth: Email + password AND Google sign-in.
- Public routes: `/auth` (sign in / sign up).
- Roles table (`user_roles`) with enum `admin | editor | customer` and a `has_role()` security-definer function (never store roles on profiles).
- Route gates:
  - `/_authenticated/admin/*` → requires `admin` or `editor`.
  - `/_authenticated/portal/*` → any signed-in user (customer view).
- `profiles` table auto-created on signup (name, avatar, company).
- Session-aware header (Sign in ↔ Account menu with Admin / Portal / Sign out).

## Phase 2 — Admin shell
Clean Microsoft-style layout: left sidebar (collapsible on mobile), top bar with breadcrumbs + user menu, white content area with card sections.
- Dashboard: quick stats (banners active, team count, blog drafts/published, customers).
- Sidebar sections: Popup Banners · Team · Blog · Industries · Services · Customers · Settings.

## Phase 3 — Popup banners (site-wide)
- Table: title, message, CTA label + URL, image, position, active, starts_at, ends_at.
- Admin CRUD with image upload (Cloud Storage bucket `banners`, public).
- Public site: fetch active/in-window banner, show once per session as a dismissible modal on the marketing site.

## Phase 4 — Team management
- Migrate current hardcoded team into a `team_members` table (name, slug, role, department, bio, linkedin, email, skills[], experience jsonb, photo, accent, sort_order, published).
- Admin CRUD + photo upload (bucket `team-photos`).
- `/team` and `/team/$slug` refactored to read from DB (loader → public server fn).

## Phase 5 — Blog with image uploads
- Tables: `blog_posts` (title, slug, excerpt, cover_image, body markdown, status draft/published, published_at, author_id, seo_title, seo_description, tags[]) and `blog_images` for inline uploads.
- Admin editor: title, slug auto-gen, cover upload, markdown body with inline image upload button, tags, SEO fields, draft/publish toggle.
- Public routes: `/blog` (list) and `/blog/$slug` (article) — clean Microsoft-docs-style reader layout with SEO head tags and OG image = cover.

## Phase 6 — Industries & Services content
- Move overrides for the existing ~250 industries and services into DB (`industry_overrides`, `service_overrides` keyed by slug). Auto-generated content remains the fallback so nothing regresses.
- Admin lists with search + edit form (hero title, overview, results, FAQ items, featured image).

## Phase 7 — Customer portal
Same shell style, separate sidebar for customers.
- Tables: `customers` (linked to a user), `renewals` (service, amount, renews_on, status), `invoices` (number, amount, status, pdf_url, issued_on, due_on), `email_stats` (period, sent, delivered, opened, clicked).
- Portal pages:
  - Overview: next renewal, outstanding invoices, email volume this month.
  - Renewals: list + filter, mark auto-renew.
  - Invoices: list, download PDF, paid/unpaid badges.
  - Email activity: monthly chart + table.
- Admin can create/edit customers and their records (Customers section in admin panel).

## Technical details
- Stack: TanStack Start server functions for all admin/customer reads/writes; `requireSupabaseAuth` middleware; `has_role()` RPC checks inside privileged handlers.
- RLS on every table: admins/editors full access; customers read only their own rows; public read only on published banners/blog/team/industries.
- Storage buckets: `banners` (public), `team-photos` (public), `blog-images` (public), `invoices` (private, signed URLs).
- Validation: Zod on every server function input; image size/type checks on upload.
- Responsive: sidebar → sheet drawer on mobile, tables → stacked cards on `<sm`, forms single-column on mobile.
- SEO: blog + team + industries continue to expose per-route `head()` with title/description/OG.

## What I need from you to start
1. The admin email that becomes the first admin (I'll grant the role automatically the first time you sign in with it).
2. Confirm you want me to start with **Phase 1 + 2 + 3 (auth, admin shell, popup banners)** in the first pass, then Team, Blog, Industries/Services, and finally the Customer portal in follow-up passes. Doing all 7 phases at once would be too large to review safely in a single change.

Reply with the admin email and a 👍 on the phase order (or reshuffle) and I'll enable Cloud and start building.