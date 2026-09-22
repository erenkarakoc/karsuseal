# Karsu Seal — web sitesi

Mekanik sızdırmazlık ürünleri için kurumsal site, ürün kataloğu, teklif/iletişim formları ve yönetim paneli.

- **Next.js 16** (App Router) · **Preline UI 4** + Tailwind CSS 4 · Bricolage Grotesque (başlık) + Geist (metin)
- **Supabase**: Postgres (katalog, talepler), Auth (yönetici girişi), Storage (ürün görselleri), Realtime (canlı talep bildirimi)
- **Cloudflare Workers**: `@opennextjs/cloudflare` ile barındırma
- Bildirimler: tarayıcı push bildirimi (Web Push + VAPID, ücretsiz) ve e-posta (Resend ücretsiz katman)

Supabase bağlanmadan da site çalışır: katalog `src/data/catalog.mjs` içindeki başlangıç verisinden okunur (formlar ve panel ise Supabase gerektirir).

---

## Klasör yapısı

```
src/app/(site)/          Genel site: ana sayfa, /urunler, /urun/[slug], /sektorler, /hizmetler, /teklif-al, /iletisim, /marka …
src/app/admin/           Yönetim paneli: /admin, /admin/talepler, /admin/urunler, /admin/kategoriler, /admin/ayarlar
src/app/actions/         Form sunucu aksiyonları (iletişim, teklif)
src/components/          site/ (Preline arayüz bileşenleri), admin/, brand/ (logo)
src/data/catalog.mjs     Başlangıç ürün kataloğu (13 ana grup, 90 ürün, teknik veriler)
src/lib/                 Supabase istemcileri, katalog sorguları, bildirim servisi
src/styles/themes/       Preline tema dosyası (Karsu marka renkleri, açık/koyu)
supabase/migrations/     Veritabanı şeması + RLS politikaları + storage
supabase/seed.sql        Katalogdan üretilen başlangıç verisi (npm run seed:build)
public/brand/            Logo SVG'leri (tüm varyantlar) — bkz. public/brand/README.md
public/illustrations/    Standart ürün çizimleri (37 adet, 800×600 SVG)
scripts/                 Logo, ürün görseli, seed ve VAPID anahtarı üreticileri
```

## 1. Yerel geliştirme

```bash
npm install
cp .env.example .env.local   # değerleri doldurun (Supabase olmadan da açılır)
npm run dev                  # http://localhost:3000
```

## 2. Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde yeni proje açın (ücretsiz plan yeterli, bölge: `eu-central-1`).
2. **SQL Editor**'de sırasıyla çalıştırın:
   - `supabase/migrations/20260921000000_init.sql` (tablolar, RLS, storage bucket, realtime)
   - `supabase/seed.sql` (başlangıç kataloğu)
3. **Authentication → Users → Add user** ile ilk yönetici hesabını oluşturun (e-posta + şifre, "Auto confirm" işaretli).
4. SQL Editor'de bu e-postayı yönetici listesine ekleyin:
   ```sql
   insert into public.admin_users (email) values ('siz@karsuseal.com');
   ```
   Sonraki yöneticileri panelden (**Ayarlar → Yöneticiler → Davet et**) ekleyebilirsiniz.
5. **Authentication → URL Configuration**:
   - Site URL: `https://karsuseal.com`
   - Redirect URLs: `https://karsuseal.com/admin/auth/callback`, `http://localhost:3000/admin/auth/callback`
6. **Project Settings → API Keys**'ten değerleri alın:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable key (`sb_publishable_…`, eski adı anon key)
   - `SUPABASE_SECRET_KEY` — secret key (`sb_secret_…`, eski adı service_role). **Yalnızca sunucuda** kullanılır.

7. Kurulumu doğrulayın:
   ```bash
   npm run check:setup          # .env.local; canlı için: npm run check:setup -- --env .env.production
   ```
   Tablolar, seed, erişim kuralları (RLS), storage, form kaydı ve ortam değişkenleri kontrol edilir; yalnızca bir test talebi ekleyip hemen siler.

## 3. Bildirimler (ücretsiz)

**Tarayıcı bildirimleri** — Web Push standardı, üçüncü taraf servis gerekmez:

```bash
npm run vapid   # NEXT_PUBLIC_VAPID_PUBLIC_KEY ve VAPID_PRIVATE_KEY üretir
```

Çıktıyı `.env.local`'e ekleyin; canlıda public anahtar `.env.production`'a, private anahtar Worker secret'ına gider. Panelde **Ayarlar → Bu cihazda bildirimleri aç** ile her cihaz ayrı ayrı abone olur. iPhone/iPad'de siteyi önce "Ana Ekrana Ekle" ile eklemek gerekir (iOS 16.4+). Panel açıkken yeni talepler ayrıca Supabase Realtime ile anında ekrana düşer.

**E-posta bildirimleri** — [Resend](https://resend.com) ücretsiz katman (ayda 3.000, günde 100 e-posta):

1. Resend'de hesap açın, **Domains**'ten `karsuseal.com` alan adını ekleyip DNS kayıtlarını (Cloudflare DNS'e) girin.
2. API anahtarı oluşturun → `RESEND_API_KEY`.
3. `NOTIFY_FROM_EMAIL="Karsu Seal <bildirim@karsuseal.com>"` (doğrulanmış alan adında bir adres).
4. Panelde **Ayarlar → E-posta bildirimleri** alanına alıcı adresleri yazın, **Test e-postası** ile deneyin.

**Spam koruması (isteğe bağlı, ücretsiz)** — [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/):

1. Cloudflare panelinde **Turnstile → Add widget**, alan adı `karsuseal.com`, mod "Managed".
2. Site key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (`.env.production`), secret key → `npx wrangler secret put TURNSTILE_SECRET_KEY`.

Anahtarlar tanımlı değilse formlar yalnızca gizli tuzak alanı ve süre kontrolüyle korunur.

## 4. Cloudflare'e yayınlama

```bash
npx wrangler login
```

`.env.production` dosyası oluşturun (derleme anında koda gömülen, gizli olmayan değerler):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
NEXT_PUBLIC_SITE_URL=https://karsuseal.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=Bxxxx
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...   # isteğe bağlı
```

Gizli değerleri Worker secret olarak kaydedin:

```bash
npx wrangler secret put SUPABASE_SECRET_KEY
npx wrangler secret put VAPID_PRIVATE_KEY     # tek tırnaksız JSON: {"kty":"EC",...}
npx wrangler secret put VAPID_SUBJECT         # mailto:info@karsuseal.com
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_FROM_EMAIL
npx wrangler secret put TURNSTILE_SECRET_KEY   # isteğe bağlı
```

Derleyip yayınlayın:

```bash
npm run deploy     # opennextjs-cloudflare build && deploy
```

Worker'ı alan adına bağlamak için Cloudflare panelinde **Workers & Pages → karsuseal → Settings → Domains & Routes → Add custom domain** (`karsuseal.com` ve `www.karsuseal.com`).

Yayından önce yerelde Workers çalışma ortamında denemek için: `npm run preview` (gizli değerler için `.dev.vars` dosyası kullanılır).

> Not: OpenNext derlemesi Windows'ta çalışıyor ancak resmi olarak WSL veya Linux/macOS önerilir. Cloudflare panelindeki **Workers Builds** (GitHub bağlantısı) ile de otomatik derleme yapılabilir; bu durumda `NEXT_PUBLIC_*` değerlerini "Build variables" olarak girin.

## 5. Katalog yönetimi

- Ürün, kategori, görsel ve teknik föy (PDF) işlemleri: **/admin/urunler**, **/admin/kategoriler**.
- Yüklenen fotoğraf varsa ürün sayfasında o gösterilir; yoksa ürün ailesine ait standart çizim (`public/illustrations/*.svg`) kullanılır.
- Başlangıç kataloğunu kodda değiştirmek isterseniz `src/data/catalog.mjs`'i düzenleyip `npm run seed:build` ile `supabase/seed.sql`'i yeniden üretin (seed yalnızca olmayan kayıtları ekler).

### Teknik veriler hakkında

Mekanik salmastraların çalışma limitleri (mil çapı, basınç, sıcaklık, kayma hızı, eksenel hareket), ürünlerde "Muadil tipler" olarak belirtilen standart tiplerin üretici kataloglarında yayımlanan tipik değerlerinden alınmıştır. Döner başlık, örgü salmastra, conta ve O-ring değerleri sektördeki tipik aralıklardır. **Yayına almadan önce kendi tedarikçi föylerinizle karşılaştırıp gerekirse panelden güncelleyin.** Hangi değerin hangi kaynaktan geldiği ve hangilerinin tahmini olduğu `docs/teknik-veri-kaynaklari.md` dosyasında. Ürün sayfalarında değerlerin tipik olduğu ve uygulamaya göre değişebileceği notu yer alır.

### Ürün görselleri

- Her ürünün bir **standart çizimi** vardır (`public/illustrations/*.svg`, `npm run brand:illustrations`): tüm ürünlerde aynı ölçü (4:3), açı, ışık ve arka plan. Ürüne fotoğraf yüklenmemişse bu gösterilir.
- Ürüne **birden fazla fotoğraf** panelden yüklenir (**/admin/urunler → ürün → Görseller**). İlk görsel ana görseldir; sıralama ve "ana görsel yap" panelden yapılır. Ürün sayfasında görseller kaydırılabilir galeride gösterilir.
- Yüklerken isteğe bağlı **standartlaştırma** vardır: fotoğraf tarayıcıda 1600×1200 (4:3), düz beyaz zemine getirilir (kenar boşlukları kırpılabilir; oranı 4:3'e yakınsa kırpılır, değilse ortalanır). Her dosya için orijinal ve standart sürüm yan yana önizlenir; hangisinin yükleneceğini siz seçersiniz.

## 6. Marka dosyaları

`public/brand/` altında tüm logo varyantları SVG olarak bulunur; kullanım kuralları `public/brand/README.md`'de ve sitede **/marka** sayfasındadır. Logolar `npm run brand:logos` ile yeniden üretilir (yazılar Bricolage Grotesque'ten eğriye çevrilir).

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run typecheck` / `npm run lint` | Tip kontrolü / lint |
| `npm run preview` | Cloudflare Workers çalışma ortamında yerel önizleme |
| `npm run deploy` | Cloudflare'e yayınla |
| `npm run seed:build` | `src/data/catalog.mjs` → `supabase/seed.sql` |
| `npm run brand:logos` | Logo SVG'lerini üret |
| `npm run brand:illustrations` | Standart ürün görsellerini üret |
| `npm run vapid` | Web Push anahtar çifti üret |
| `npm run check:setup` | Supabase ve ortam değişkenleri kurulum kontrolü |
