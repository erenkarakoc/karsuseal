# Karsu Seal — yapılacaklar

## Devam eden tur (eksikler listesi)

- [x] Mevcut durumu `karsu-seal-site` branch'ine commit et
- [x] Arama: Supabase bağlıyken muadil tipleri de kapsasın (`search_text` sütunu)
- [x] PWA manifest + PNG ikonlar (iOS ana ekran ve push bildirimi için)
- [x] Sosyal medya paylaşım görselleri (PNG): site, ürün, kategori
- [x] Cloudflare Turnstile spam koruması (anahtar tanımlıysa devreye girer)
- [x] Silinen / değiştirilen görselleri Supabase Storage'dan da sil
- [x] Supabase kurulum kontrol betiği (tablolar, seed, RLS, storage, form kaydı)
- [x] Yer tutucu içerik: canlıda sahte telefon/adres gösterilmesin, panelde eksik bilgi uyarısı
- [x] Teknik veri kaynak listesi (hangi değer nereden, hangisi tahmini) → `docs/teknik-veri-kaynaklari.md`
- [ ] Cloudflare Workers derlemesiyle son doğrulama ve commit
- [x] TODO.md çalışma kuralını CLAUDE.md ve AGENTS.md'ye ekle

## Sonraki

- [ ] Ürün illüstrasyonlarında ürünleri görselin tam ortasına hizala
- [ ] Sektörler, hizmetler, kurumsal vb. içerik sayfaları için admin panelinde düzenleme sayfası
- [ ] Admin panelinde "Ana sayfa" sayfası: ana sayfadaki bölümler özelleştirilebilsin

## Sizin tarafınızda

- [ ] Supabase projesini açıp migration + seed'i çalıştırmak, ilk yöneticiyi eklemek
- [ ] Gerçek iletişim bilgilerini panelden girmek
- [ ] KVKK metnini hukukçuya kontrol ettirmek
- [ ] Vaat ifadelerini gözden geçirmek (içerik yönetimi gelince panelden düzenlenebilecek): "stoktan aynı gün sevk" (`src/data/site.ts` stok-tedarik), "aynı iş günü teklif" (`src/app/(site)/teklif-al/page.tsx`), "stoktan hızlı sevk" (ana sayfa süreç adımları)
- [ ] Teknik değerleri tedarikçi föyleriyle karşılaştırmak (öncelik: `docs/teknik-veri-kaynaklari.md` içindeki "doğrulanmalı" satırlar)
- [ ] Ürün fotoğraflarını panelden yüklemek
