-- Karsu Seal — editable site content (home page sections, industries, services, about, …)
-- One JSON document per page/key. Missing fields fall back to the defaults in
-- src/lib/content/defaults.ts, so an empty table still renders the full site.

create table public.site_content (
  key text primary key check (key ~ '^[a-z0-9-]+$'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);

create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

alter table public.site_content enable row level security;
create policy "public read site content" on public.site_content for select using (true);
create policy "admins write site content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());
