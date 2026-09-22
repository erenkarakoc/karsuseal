# Karsu Seal — logo dosyaları

Tüm dosyalar vektördür (SVG), yazılar Bricolage Grotesque'ten eğriye çevrilmiştir; font kurulumu gerekmez.
Yeniden üretmek için: `npm run brand:logos` (kaynak: `scripts/generate-logos.mjs`).

## Konsept

Kapalı bir sızdırmazlık halkası ve içinde, ortasından ikiye ayrılmış bir damla. Halka salmastrayı, damla
sızdırılmayan akışkanı, damlanın ortasındaki ince boşluk ise mekanik salmastranın birbirine temas eden
dönen ve sabit yüzeylerini temsil eder. İkon 48 × 48 birimlik ızgara üzerine çizilmiştir.

## Varyantlar

| Dosya | Kullanım |
| --- | --- |
| `karsu-seal-logo-horizontal-{light,dark,mono-black,mono-white}.svg` | Birincil logo (ikon + yazı) |
| `karsu-seal-logo-stacked-*.svg` | Dikey logo — kare ve dar alanlar |
| `karsu-seal-logo-tagline-*.svg` | "Mekanik Sızdırmazlık Çözümleri" sloganlı logo |
| `karsu-seal-wordmark-*.svg` | Yalnızca yazı |
| `karsu-seal-icon-*.svg` | Yalnızca ikon |
| `karsu-seal-app-icon.svg`, `karsu-seal-app-icon-navy.svg` | Uygulama / sosyal medya profil ikonu (512 × 512) |
| `karsu-seal-favicon.svg` | Sistem temasına (açık/koyu) uyum sağlayan favicon |

- `light`: açık zeminler için renkli · `dark`: koyu zeminler için · `mono-black` / `mono-white`: tek renk baskı

## Renkler

| Ad | HEX | RGB |
| --- | --- | --- |
| Karsu Lacivert | `#0B1F3F` | 11 31 63 |
| Karsu Mavi | `#1D5FD1` | 29 95 209 |
| Koyu Zemin Mavisi | `#5B97F7` | 91 151 247 |
| Beyaz | `#FFFFFF` | 255 255 255 |

## Tipografi

- Logo ve başlıklar: **Bricolage Grotesque** (Karsu: Bold 700, Seal: Regular 400)
- Metin: **Geist**

## Kurallar

- Güvenli alan: logonun çevresinde en az ikon yüksekliğinin ¼'ü kadar boşluk bırakın.
- En küçük boyut: yatay logo dijitalde 24 px, baskıda 8 mm yükseklik; ikon tek başına 16 px.
- Logoyu döndürmeyin, esnetmeyin, renklerini değiştirmeyin, gölge/efekt eklemeyin.
- Karmaşık fotoğraf zeminlerinde tek renk beyaz veya siyah sürümü kullanın.
