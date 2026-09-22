-- Karsu Seal — initial schema
-- Catalog (categories, products), inbound requests (contact / quote),
-- admin allow-list, site settings and browser push subscriptions.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admins: e-mail allow-list. A Supabase Auth user whose e-mail is listed here
-- can use the admin panel.
-- ---------------------------------------------------------------------------
create table public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  summary text,
  description text,
  illustration text,           -- fallback illustration key (public/illustrations/<key>.svg)
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index categories_parent_idx on public.categories(parent_id, sort_order);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  code text not null,
  name text not null,
  summary text,
  description text,
  -- [{ "label": "Mil çapı", "value": "d1 = 14 … 100 mm" }, ...]
  specs jsonb not null default '[]'::jsonb,
  -- [{ "part": "Dönen yüzey", "options": ["Karbon", "SiC"] }, ...]
  materials jsonb not null default '[]'::jsonb,
  features text[] not null default '{}',
  applications text[] not null default '{}',
  standards text[] not null default '{}',
  equivalents text[] not null default '{}',
  industries text[] not null default '{}',
  illustration text,
  image_url text,
  gallery text[] not null default '{}',
  datasheet_url text,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products(category_id, sort_order);
create index products_featured_idx on public.products(is_featured) where is_featured;

-- ---------------------------------------------------------------------------
-- Inbound requests: contact form + quote requests
-- ---------------------------------------------------------------------------
create type public.inquiry_kind as enum ('contact', 'quote');
create type public.inquiry_status as enum ('new', 'in_progress', 'answered', 'closed', 'spam');

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  kind public.inquiry_kind not null,
  status public.inquiry_status not null default 'new',
  name text not null,
  company text,
  email text not null,
  phone text,
  city text,
  subject text,
  message text,
  -- quote items: [{ "product_id": "...", "code": "KS-7N", "name": "...", "quantity": 2, "shaft_diameter": "35 mm", "note": "" }]
  items jsonb not null default '[]'::jsonb,
  -- free-form technical context for quotes (medium, temperature, pressure, rpm, pump brand/model ...)
  details jsonb not null default '{}'::jsonb,
  admin_notes text,
  source_url text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index inquiries_status_idx on public.inquiries(status, created_at desc);
create index inquiries_kind_idx on public.inquiries(kind, created_at desc);

-- ---------------------------------------------------------------------------
-- Settings (single row) and push subscriptions
-- ---------------------------------------------------------------------------
create table public.settings (
  id int primary key default 1 check (id = 1),
  notification_emails text[] not null default '{}',
  email_notifications boolean not null default true,
  push_notifications boolean not null default true,
  company_phone text,
  company_whatsapp text,
  company_email text,
  company_address text,
  company_maps_url text,
  working_hours text,
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict do nothing;

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_email text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_touch before update on public.categories for each row execute function public.touch_updated_at();
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger inquiries_touch before update on public.inquiries for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.inquiries enable row level security;
alter table public.settings enable row level security;
alter table public.push_subscriptions enable row level security;

-- admin_users: admins manage the list (the first admin is inserted from the SQL editor)
create policy "admins read admin list" on public.admin_users for select using (public.is_admin());
create policy "admins add admins" on public.admin_users for insert with check (public.is_admin());
create policy "admins remove admins" on public.admin_users for delete using (public.is_admin());

-- catalog: public reads published rows, admins do everything
create policy "public read categories" on public.categories for select using (is_published or public.is_admin());
create policy "admins write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "public read products" on public.products for select using (is_published or public.is_admin());
create policy "admins write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- inquiries: written server-side with the secret key; admins read/update
create policy "admins read inquiries" on public.inquiries for select using (public.is_admin());
create policy "admins update inquiries" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete inquiries" on public.inquiries for delete using (public.is_admin());

-- settings: public contact fields are exposed through a view below
create policy "admins read settings" on public.settings for select using (public.is_admin());
create policy "admins update settings" on public.settings for update using (public.is_admin()) with check (public.is_admin());

-- push subscriptions: admins manage their own devices
create policy "admins manage push" on public.push_subscriptions for all using (public.is_admin()) with check (public.is_admin());

-- Public contact info (no notification e-mails)
create view public.public_settings with (security_invoker = false) as
  select company_phone, company_whatsapp, company_email, company_address, company_maps_url, working_hours
  from public.settings where id = 1;
grant select on public.public_settings to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: admin panel listens for new inquiries
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.inquiries;

-- ---------------------------------------------------------------------------
-- Storage: public bucket for product / category images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog', 'catalog', true, 5242880, array['image/png','image/jpeg','image/webp','image/svg+xml','image/avif','application/pdf'])
on conflict (id) do nothing;

create policy "public read catalog files" on storage.objects for select using (bucket_id = 'catalog');
create policy "admins upload catalog files" on storage.objects for insert with check (bucket_id = 'catalog' and public.is_admin());
create policy "admins update catalog files" on storage.objects for update using (bucket_id = 'catalog' and public.is_admin());
create policy "admins delete catalog files" on storage.objects for delete using (bucket_id = 'catalog' and public.is_admin());
