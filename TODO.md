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
- [x] Paylaşım görsellerini statik PNG olarak üret (`npm run og:build`; Worker 2,8 → 1,9 MB gzip)
- [x] Cloudflare Workers derlemesiyle son doğrulama ve commit
- [x] TODO.md çalışma kuralını CLAUDE.md ve AGENTS.md'ye ekle

## Sonraki

- [x] Ürün illüstrasyonlarında ürünleri görselin tam ortasına hizala (ölçülen sınırlara göre ortalama + ortak boyut)
- [x] Sektörler, hizmetler, kurumsal vb. içerik sayfaları için admin panelinde düzenleme sayfası (/admin/icerik)
- [x] Admin panelinde "Ana sayfa" sayfası: ana sayfadaki bölümler özelleştirilebilsin (/admin/icerik/ana-sayfa)
- [x] Ana sayfadaki hero üst etiketini (badge) tamamen kaldır (sayfa, panel alanı, varsayılan içerik)
- [x] Yeni logo ikonu: yuvarlak köşeli kare içinde tırtıklı halka (yazı aynı kaldı); tüm SVG/PNG varyantları, favicon, site logosu ve paylaşım görselleri yenilendi

## Sizin tarafınızda

- [ ] Supabase projesini açıp iki migration dosyasını + seed'i çalıştırmak, ilk yöneticiyi eklemek, `npm run check:setup`
- [ ] Gerçek iletişim bilgilerini panelden girmek
- [ ] KVKK metnini hukukçuya kontrol ettirmek
- [ ] Vaat ifadelerini gözden geçirmek — panelden: Sayfa içerikleri → Hizmetler ("Stok ve Hızlı Tedarik": "stoktan aynı gün sevk"), Teklif al (yan kart: "aynı iş günü"), Ana sayfa → Çalışma adımları ("stoktan hızlı sevk")
- [ ] Teknik değerleri tedarikçi föyleriyle karşılaştırmak (öncelik: `docs/teknik-veri-kaynaklari.md` içindeki "doğrulanmalı" satırlar)
- [ ] Ürün fotoğraflarını panelden yüklemek
