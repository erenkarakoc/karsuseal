# Teknik veri kaynakları

Başlangıç kataloğundaki (`src/data/catalog.mjs`) çalışma limitlerinin nereden geldiği. Yayına almadan önce
özellikle **"doğrulanmalı"** işaretli satırları kendi tedarikçi föylerinizle karşılaştırın; düzeltmeleri panelden
(**Ürünler → ürün → Teknik özellikler**) yapabilirsiniz.

**Kaynak (K):** EagleBurgmann genel kataloğu *Mechanical seals · Magnetic couplings · Agitator seals · Compressor seals*,
PDF: <https://www.tecnicaindustriale.it/eagleburgmann_catalogues/mechanical_seals_magnetic_couplings.pdf>.
Değerler, ürünün "Muadil tipler" alanındaki tipin katalog sayfasındaki *Operating range* tablosundan alınmıştır.

Durum: **K** = katalogdan birebir · **K\*** = katalogdan, açıklamadaki nota bakın · **D** = doğrulanmalı (tipik/tahmini değer)

## Mekanik salmastralar

| Ürün | Muadil (kaynak sayfası) | Durum | Not |
| --- | --- | --- | --- |
| KS-M2 | M2N (s. 8) | K | |
| KS-M3 | M3N (s. 10) | K | |
| KS-M7 | M7N (s. 12) | K | |
| KS-M74D | M74-D (s. 14) | K | |
| KS-H7 | H7N (s. 16) | K\* | Katalogda d1 > 200 mm için 16 bar sınırı da var; sitede gösterilmiyor. |
| KS-H74D | H74-D (s. 20) | K | |
| KS-H12 | H12N (s. 32) | K | |
| KS-HJ92 | HJ92N (s. 30) | **D** | Sıcaklık (−20 … +180 °C) ve hız (10 m/s) katalogdan. Mil çapı (18–100 mm) ve basınç (25 bar) tahmini; katalog sayfası HJ4 için d1 > 100 mm / 50 bar veriyor. |
| KS-H75 | H75VN (s. 26–28) | K | |
| KS-MG1 | MG1 (s. 54) | K | |
| KS-MG12 | MG12 / MG912 (s. 56, MG9 serisi) | K | |
| KS-MG13 | MG13 / MG913 (s. 56, MG9 serisi) | K | |
| KS-21 | BT-AR (s. 62) | K\* | "Tip 21" eşdeğerliği BT-AR üzerinden kuruldu; kendi Tip 21 föyünüzle karşılaştırın. |
| KS-560 | EA560 (s. 58) | K | |
| KS-MFL85 | MFL85N (s. 68) | K | |
| KS-MBS100 | MBS100 (s. 66) | K | |
| KS-MF95 | MF95N (s. 72) | K | |
| KS-MFLWT | MFLWT (s. 70) | K | |
| KS-MFL65 | MFL65 (s. 74) | K | |
| KS-HR | HR serisi (s. 76) | K | |
| KS-SPLIT | Splitex (s. 86) | K | |

## Kartuş ve mikser salmastraları

| Ürün | Muadil (kaynak sayfası) | Durum | Not |
| --- | --- | --- | --- |
| KS-CS | Cartex-SN (s. 36) | K | |
| KS-CSQ | Cartex-QN / TN (s. 36) | K\* | Quench basıncı (≤ 0,5 bar) genel uygulama değeri, katalogda yok. |
| KS-CD | Cartex-DN (s. 38) | K | |
| KS-MTX | Mtex (s. 48) | K | |
| KS-MTXD | Mtex dual (s. 50) | K | |
| KS-KNV | — | **D** | Sayısal değer yok; genel açıklama. |
| KS-AG1 | M481 tek (s. 108) | K | |
| KS-AG2 | M481 çift / M461 (s. 108–110) | K | |
| KS-AGDRY | SeccoMix (s. 98) | K | |
| KS-AGMR | MR-D (s. 112) | K | |

## Kaynağı katalog olmayan gruplar — tamamı **doğrulanmalı**

Aşağıdaki ürünlerin değerleri sektörde yaygın **tipik aralıklardır**; belirli bir üreticinin föyünden alınmamıştır.

| Grup | Ürünler | Doğrulanacak değerler |
| --- | --- | --- |
| OEM pompa salmastraları | KS-GF, KS-FL, KS-AL, KS-FR, KS-APV, KS-LW | Mil çapları ve uyumlu pompa modelleri (tedarikçi uyumluluk listesiyle) |
| Döner başlıklar | KS-RJ10 … KS-RJ44 | Bağlantı ölçüleri, basınç, sıcaklık, devir |
| Swivel joint | KS-SJ20, KS-SJ50 | Bağlantı, basınç sınıfı, sıcaklık |
| Tampon sıvı sistemleri | KS-P52, KS-P53B | Hacim, tasarım basıncı ve sıcaklığı |
| Yumuşak salmastralar | KS-GP10 … KS-GP64 | Sıcaklık, pH, hız, basınç |
| PTFE ürünleri | KS-PT10 … KS-PT40 | Ölçüler, kaliteler, sıcaklık |
| Conta ve levhalar | KS-CL10 … KS-CL50 | Kalınlık, sıcaklık, basınç |
| O-ringler | KS-OR-* | Sıcaklık aralıkları (bileşime göre değişir) |
| Karbon ve yüzey ürünleri | KS-FR10 … KS-CB10 | Kalite, sertlik, sıcaklık |
| Lepleme | KS-LP10 … KS-LP40 | Makine ve sarf ölçüleri |
