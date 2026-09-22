// Karsu Seal — başlangıç ürün kataloğu.
// Bu dosya `npm run seed:build` ile supabase/seed.sql dosyasına dönüştürülür.
// Yayına aldıktan sonra katalog yönetim panelinden güncellenir; bu dosya yalnızca ilk veri kaynağıdır.
//
// Mekanik salmastraların çalışma limitleri, belirtilen muadil tiplerin üretici kataloglarında
// yayımlanan tipik değerlerdir. Nihai limitler malzeme kombinasyonuna, akışkana ve
// mil çapına bağlıdır.

// ---------------------------------------------------------------------------
// Ortak yardımcılar
// ---------------------------------------------------------------------------
const s = (label, value) => ({ label, value });
const m = (part, options) => ({ part, options });

const FACES = {
  rotating: m("Dönen yüzey", ["Karbon grafit (reçine / antimon emdirilmiş)", "Silisyum karbür (SiC)", "Tungsten karbür (TC)"]),
  stationary: m("Sabit yüzey (yatak)", ["Silisyum karbür (SiC)", "Tungsten karbür (TC)", "Alümina seramik (Al₂O₃)", "Karbon grafit"]),
  elastomer: m("Sekonder conta (O-ring)", ["NBR", "EPDM", "FKM", "FFKM", "VMQ (silikon)", "FEP kaplı FKM"]),
  metal: m("Yay ve metal parçalar", ["AISI 316 (1.4401)", "Hastelloy® C-4 (opsiyonel)"]),
};
const PUSHER_MATERIALS = [FACES.rotating, FACES.stationary, FACES.elastomer, FACES.metal];
const BELLOWS_MATERIALS = [
  m("Dönen yüzey", ["Karbon grafit", "Silisyum karbür (SiC)"]),
  m("Sabit yüzey (yatak)", ["Silisyum karbür (SiC)", "Alümina seramik (Al₂O₃)", "Tungsten karbür (TC)"]),
  m("Körük", ["NBR", "EPDM", "FKM"]),
  m("Yay ve metal parçalar", ["AISI 304", "AISI 316"]),
];
const METAL_BELLOWS_MATERIALS = [
  m("Dönen yüzey", ["Karbon grafit", "Silisyum karbür (SiC)"]),
  m("Sabit yüzey (yatak)", ["Silisyum karbür (SiC)", "Tungsten karbür (TC)"]),
  m("Metal körük", ["Hastelloy® C-276", "AM 350", "Inconel® 718"]),
  m("Sekonder conta", ["FKM", "FFKM", "Esnek grafit (yüksek sıcaklık)"]),
];

const axialEN = "d1 ≤ 25 mm: ±1,0 mm · d1 28 … 63 mm: ±1,5 mm · d1 ≥ 65 mm: ±2,0 mm";

// ---------------------------------------------------------------------------
// Kategoriler (parent → alt kategori)
// ---------------------------------------------------------------------------
export const categories = [
  {
    slug: "mekanik-salmastralar", name: "Mekanik Salmastralar", illustration: "seal-multispring",
    summary: "Pompa, mikser ve kompresörler için O-ringli, körüklü ve özel tip mekanik salmastralar.",
    description: "Mekanik salmastralar, dönen mil ile sabit gövde arasındaki sızdırmazlığı birbirine hassas biçimde lepleme ile düzlenmiş iki yüzey sayesinde sağlar. EN 12756 (DIN 24960) ölçülerindeki standart tiplerden özel imalatlara kadar geniş bir yelpazede, akışkana ve çalışma koşullarına uygun malzeme kombinasyonlarıyla tedarik ediyoruz.",
    children: [
      { slug: "o-ringli-salmastralar", name: "O-Ringli Salmastralar", illustration: "seal-multispring", summary: "Konik, çok yaylı ve dalga yaylı; dengeli ve dengesiz itmeli (pusher) tipler." },
      { slug: "elastomer-koruklu-salmastralar", name: "Elastomer Körüklü Salmastralar", illustration: "seal-elastomer-bellows", summary: "Su, atık su ve hafif kimyasallar için ekonomik, milin aşınmasını önleyen körüklü tipler." },
      { slug: "metal-koruklu-salmastralar", name: "Metal Körüklü Salmastralar", illustration: "seal-metal-bellows", summary: "Yüksek sıcaklık ve kimyasal dayanım gerektiren prosesler için elastomersiz dinamik yapı." },
      { slug: "ozel-tip-salmastralar", name: "Özel Tip Salmastralar", illustration: "seal-split", summary: "Çamur, yüksek basınç ve ayrık (split) uygulamalar için özel tasarımlar." },
    ],
  },
  {
    slug: "kartus-salmastralar", name: "Kartuş Salmastralar", illustration: "seal-cartridge",
    summary: "Fabrikada ayarlı, montajı kolay tek ve çift kartuş salmastralar.",
    description: "Kartuş salmastralar; salmastra, burç ve flanşın tek ünite halinde, fabrikada ayarlanmış olarak teslim edildiği sistemlerdir. Montaj hatalarını ortadan kaldırır, bakım süresini kısaltır ve pompa değişikliği gerektirmeden tek veya çift salmastra düzenine geçişi mümkün kılar.",
    children: [],
  },
  {
    slug: "mikser-salmastralari", name: "Mikser Salmastraları", illustration: "seal-agitator",
    summary: "Reaktör, karıştırıcı ve tanklar için DIN 28138 uyumlu tek, çift ve kuru çalışan salmastralar.",
    description: "Karıştırıcı ve reaktörlerde mil salgısı, düşük devir ve gaz fazı gibi pompalardan farklı koşullar vardır. Rulman destekli, kartuş tipli mikser salmastralarımız sıvı veya gaz yağlamalı olarak tek ve çift düzenlerde sunulur.",
    children: [],
  },
  {
    slug: "oem-pompa-salmastralari", name: "OEM Pompa Salmastraları", illustration: "seal-cartridge",
    summary: "Yaygın pompa markaları için birebir ölçüde muadil salmastralar.",
    description: "Orijinal ölçü ve montaj şekline birebir uyan muadil salmastralarla yedek parça maliyetini ve bekleme süresini düşürün. Pompa marka ve modelini ya da eski salmastranın fotoğrafını göndermeniz yeterli. Marka adları yalnızca uyumluluğu belirtmek amacıyla kullanılmıştır.",
    children: [],
  },
  {
    slug: "doner-baglanti-elemanlari", name: "Döner Bağlantı Elemanları", illustration: "rotary-joint",
    summary: "Su, buhar, kızgın yağ, hava ve hidrolik için döner başlıklar (rotary joint).",
    description: "Döner başlıklar, dönen silindir ve millere akışkanın sızdırmadan iletilmesini sağlar. Kâğıt, tekstil, plastik, kauçuk ve metal işleme sektörlerinde tek ve çift akışlı, sifonlu ve vakum kırıcılı modeller sunuyoruz.",
    children: [
      { slug: "su-basliklari", name: "Su Başlıkları", illustration: "rotary-joint", summary: "Soğutma ve proses suyu için tek ve çift akışlı başlıklar." },
      { slug: "buhar-basliklari", name: "Buhar Başlıkları", illustration: "rotary-joint-double", summary: "Kurutma silindirleri için sifonlu ve vakum kırıcılı buhar başlıkları." },
      { slug: "kizgin-yag-basliklari", name: "Kızgın Yağ Başlıkları", illustration: "rotary-joint-double", summary: "350 °C'ye kadar ısı transfer yağı uygulamaları." },
      { slug: "hava-hidrolik-basliklari", name: "Hava, Hidrolik ve Soğutma Başlıkları", illustration: "rotary-joint", summary: "Pnömatik, hidrolik ve yüksek devirli soğutma sıvısı başlıkları." },
    ],
  },
  {
    slug: "swivel-joint", name: "Swivel Joint (Döner Mafsal)", illustration: "swivel-joint",
    summary: "Dolum-boşaltım kolları ve hortum hatları için bilyalı döner mafsallar.",
    description: "Swivel joint'ler, boru hatlarında 360° serbest dönüş sağlayarak dolum kolları, hortum makaraları ve esnek bağlantılarda hattın burulmasını önler.",
    children: [],
  },
  {
    slug: "tampon-sivi-sistemleri", name: "Tampon Sıvı Sistemleri", illustration: "seal-support-vessel",
    summary: "Çift salmastralar için API 682 planlarına uygun basınçlandırma ve soğutma üniteleri.",
    description: "Çift mekanik salmastraların güvenli çalışması için bariyer veya tampon sıvının basıncı, sıcaklığı ve seviyesi kontrol altında tutulmalıdır. API 682 planlarına uygun tank ve akümülatör sistemleri tasarlıyor ve tedarik ediyoruz.",
    children: [],
  },
  {
    slug: "yumusak-salmastralar", name: "Yumuşak Salmastralar", illustration: "packing-ptfe",
    summary: "Pompa, vana ve karıştırıcılar için PTFE, grafit, aramid ve cam elyaf örgü salmastralar.",
    description: "Örgü (yumuşak) salmastralar; pompa, vana, karıştırıcı ve kırıcılarda ekonomik ve kolay uygulanabilir sızdırmazlık sağlar. Kare kesitli örgüler 3 mm'den 30 mm'ye kadar kesitlerde, makara veya ölçüye kesilmiş halka olarak tedarik edilir.",
    children: [],
  },
  {
    slug: "ptfe-urunleri", name: "PTFE Ürünleri", illustration: "ptfe",
    summary: "PTFE levha, çubuk, boru ve genleşmiş PTFE conta bantları.",
    description: "PTFE; neredeyse tüm kimyasallara dayanımı, düşük sürtünme katsayısı ve geniş sıcaklık aralığıyla sızdırmazlık uygulamalarının temel malzemesidir. Saf ve dolgulu (cam, karbon, bronz, grafit) kalitelerde yarı mamul ve işlenmiş parça sunuyoruz.",
    children: [],
  },
  {
    slug: "conta-ve-levhalar", name: "Conta ve Levhalar", illustration: "gasket-sheet",
    summary: "Asbestsiz, grafit ve kauçuk conta levhaları; spiral sargılı ve ölçüye kesilmiş contalar.",
    description: "Flanş ve kapak sızdırmazlığı için asbestsiz lifli, esnek grafit ve kauçuk levhaları stoktan tedarik ediyor, çizime veya numuneye göre hassas kesim yapıyoruz.",
    children: [],
  },
  {
    slug: "o-ringler", name: "O-Ringler", illustration: "o-ring-nbr",
    summary: "NBR, FKM, EPDM, silikon, FFKM ve FEP kaplı O-ringler.",
    description: "Standart (ISO 3601, AS568, JIS) ve özel ölçülerde O-ringleri akışkana ve sıcaklığa uygun elastomer seçimiyle tedarik ediyoruz. Mekanik salmastra yedek O-ring setleri de hazırlanır.",
    children: [],
  },
  {
    slug: "karbon-ve-yuzey-urunleri", name: "Karbon ve Yüzey Ürünleri", illustration: "seal-face-carbon",
    summary: "Mekanik salmastra yedek yüzleri: karbon, SiC, TC ve seramik halkalar; karbon burçlar.",
    description: "Mekanik salmastraların aşınan yüzeylerini çizime veya numuneye göre üretiyor, lepleme ile ışık bandı düzlemselliğinde teslim ediyoruz.",
    children: [],
  },
  {
    slug: "lepleme", name: "Lepleme", illustration: "lapping",
    summary: "Lepleme makineleri, elmas süspansiyonlar ve düzlemsellik ölçüm ekipmanları.",
    description: "Salmastra yüzeylerinin yenilenmesi için lepleme makineleri, sarf malzemeleri ve optik düzlemsellik kontrol ekipmanları. Yüzey yenileme hizmeti de veriyoruz.",
    children: [],
  },
];

// ---------------------------------------------------------------------------
// Ürünler
// ---------------------------------------------------------------------------
const P = (category, fields) => ({ category, ...fields });

export const products = [
  // ===================== O-RINGLI =====================
  P("o-ringli-salmastralar", {
    code: "KS-M2", name: "KS-M2 Konik Yaylı Salmastra", illustration: "seal-conical",
    summary: "Küçük mil çapları için konik yaylı, dengesiz, tek yönlü ekonomik salmastra.",
    description: "KS-M2, tek konik yayla yüzey baskısını sağlayan kompakt bir O-ringli salmastradır. Az sayıda parçadan oluşan yapısı sayesinde küçük sirkülasyon ve santrifüj pompalarda güvenilir ve ekonomik bir çözüm sunar. Konik yay, dönüş yönüne bağlı çalışır; sağ ve sol yönlü olarak tedarik edilir.",
    specs: [s("Mil çapı (d1)", "6 … 38 mm"), s("Basınç (p1)", "≤ 10 bar"), s("Sıcaklık (t)", "−20 … +140 °C"), s("Kayma hızı (vg)", "≤ 15 m/s"), s("Eksenel hareket", "±1,0 mm")],
    materials: PUSHER_MATERIALS,
    features: ["Tek, dengesiz, O-ringli itmeli (pusher) tip", "Konik yay — dönüş yönüne bağlı", "Kirliliğe karşı toleranslı basit yapı", "Az parça, kolay montaj"],
    applications: ["Sirkülasyon pompaları", "Temiz ve hafif kirli su", "Soğutma suyu devreleri", "Düşük katı içerikli akışkanlar"],
    standards: [], equivalents: ["EagleBurgmann M2N", "Tip M2"], industries: ["su-ve-atik-su", "enerji"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-M3", name: "KS-M3 Konik Yaylı Salmastra", illustration: "seal-conical", is_featured: true,
    summary: "6–80 mm aralığında konik yaylı, genel amaçlı O-ringli salmastra.",
    description: "KS-M3, konik yaylı dengesiz salmastraların en yaygın kullanılan tipidir. Geniş mil çapı aralığı, sade yapısı ve farklı yüzey malzemesi seçenekleriyle su, yağ ve hafif kimyasallarda uzun ömürlü çalışır. Yüzey ve O-ring malzemeleri akışkana göre seçilir.",
    specs: [s("Mil çapı (d1)", "6 … 80 mm"), s("Basınç (p1)", "≤ 10 bar"), s("Sıcaklık (t)", "−20 … +140 °C"), s("Kayma hızı (vg)", "≤ 15 m/s"), s("Eksenel hareket", "±1,0 mm")],
    materials: PUSHER_MATERIALS,
    features: ["Konik yay, dönüş yönüne bağlı", "Sağ / sol dönüşlü seçenek", "Geniş malzeme kombinasyonu", "Ekonomik yedek parça"],
    applications: ["Santrifüj pompalar", "Su ve atık su", "Yağlar ve hafif kimyasallar", "Tarımsal sulama pompaları"],
    standards: [], equivalents: ["EagleBurgmann M3N", "Tip M3"], industries: ["su-ve-atik-su", "kimya-ve-petrokimya", "enerji"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-M7", name: "KS-M7 Çok Yaylı Salmastra (EN 12756)", illustration: "seal-multispring", is_featured: true,
    summary: "EN 12756 ölçülerinde, dönüş yönünden bağımsız çok yaylı dengesiz salmastra.",
    description: "KS-M7, dönen yüzey tutucusu içindeki çok sayıda küçük yay ile yüzey üzerinde eşit baskı dağılımı sağlar. Dönüş yönünden bağımsızdır ve EN 12756 (DIN 24960) KU/NU montaj ölçülerine uygundur. Değiştirilebilir yüzeyleri ve geniş malzeme seçenekleri sayesinde proses pompalarında standart çözümdür.",
    specs: [s("Mil çapı (d1)", "14 … 100 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Sıcaklık (t)", "−50 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s"), s("Eksenel hareket", axialEN)],
    materials: PUSHER_MATERIALS,
    features: ["Çok yaylı, dönüş yönünden bağımsız", "EN 12756 KU / NU ölçüleri", "Akışkandan korunmuş yaylar (opsiyon)", "Değiştirilebilir yüzeyler"],
    applications: ["Kimya ve petrokimya pompaları", "Kazan besleme ve kondensat", "Gıda ve içecek prosesleri", "Denizcilik uygulamaları"],
    standards: ["EN 12756 (DIN 24960)"], equivalents: ["EagleBurgmann M7N", "Tip M7"], industries: ["kimya-ve-petrokimya", "gida-ve-icecek", "denizcilik", "enerji"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-M74D", name: "KS-M74D Çift Salmastra", illustration: "seal-double",
    summary: "Arka arkaya (back-to-back) düzenli, çok yaylı çift mekanik salmastra.",
    description: "KS-M74D, iki adet çok yaylı salmastranın bariyer sıvısıyla birlikte çalıştığı çift düzendir. Toksik, yanıcı, kristalleşen veya yağlama özelliği zayıf akışkanlarda ürünün atmosfere kaçmasını önler. Tandem ve arka arkaya düzenlerde tedarik edilir.",
    specs: [s("Mil çapı (d1)", "18 … 200 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Sıcaklık (t)", "−50 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s"), s("Eksenel hareket", "d1 ≤ 100 mm: ±0,5 mm · d1 > 100 mm: ±2,0 mm")],
    materials: PUSHER_MATERIALS,
    features: ["Çift salmastra — bariyer sıvısı ile", "Dönüş yönünden bağımsız", "API Plan 52 / 53 ile uyumlu", "Sıfır emisyon hedefli uygulamalar"],
    applications: ["Toksik ve yanıcı akışkanlar", "Kristalleşen ürünler", "Vakum altında çalışan pompalar", "Reaktör besleme pompaları"],
    standards: ["EN 12756 (DIN 24960)"], equivalents: ["EagleBurgmann M74-D"], industries: ["kimya-ve-petrokimya", "ilac"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-H7", name: "KS-H7 Dengeli Çok Yaylı Salmastra", illustration: "seal-multispring", is_featured: true,
    summary: "80 bar'a kadar basınçlar için dengeli (balanced), EN 12756 ölçülerinde salmastra.",
    description: "KS-H7, kademeli mil veya burç üzerinde çalışan dengeli bir salmastradır. Dengeleme sayesinde yüzeylerdeki kapanma kuvveti basınçtan büyük ölçüde bağımsız kalır; bu da yüksek basınçta düşük ısınma ve uzun ömür sağlar. Rafineri, petrokimya ve enerji santrallerinde yaygın olarak kullanılır.",
    specs: [s("Mil çapı (d1)", "14 … 200 mm"), s("Basınç (p1)", "d1 14 … 100 mm: ≤ 80 bar · d1 100 … 200 mm: ≤ 25 bar"), s("Sıcaklık (t)", "−50 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s"), s("Eksenel hareket", "d1 ≤ 22 mm: ±1,0 mm · d1 24 … 58 mm: ±1,5 mm · d1 ≥ 60 mm: ±2,0 mm")],
    materials: PUSHER_MATERIALS,
    features: ["Dengeli (balanced) tasarım", "Çok yaylı, dönüş yönünden bağımsız", "Yüksek basınçta düşük ısı üretimi", "EN 12756 KB / NB ölçüleri"],
    applications: ["Kazan besleme pompaları", "Hidrokarbon ve solventler", "Yüksek basınçlı proses pompaları", "Sıcak su devreleri"],
    standards: ["EN 12756 (DIN 24960)"], equivalents: ["EagleBurgmann H7N", "Tip H7"], industries: ["kimya-ve-petrokimya", "enerji"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-H74D", name: "KS-H74D Dengeli Çift Salmastra", illustration: "seal-double",
    summary: "Yüksek basınçlı ve tehlikeli akışkanlar için dengeli çift salmastra.",
    description: "KS-H74D, iki dengeli salmastranın bariyer sıvısı ile çalıştığı çift düzendir. Basınçlı bariyer sisteminde ürün tarafı basıncının yüksek olduğu tehlikeli proseslerde emniyetli sızdırmazlık sağlar.",
    specs: [s("Mil çapı (d1)", "14 … 200 mm"), s("Basınç (p1)", "d1 ≤ 100 mm: ≤ 80 bar · d1 100 … 200 mm: ≤ 25 bar"), s("Sıcaklık (t)", "−50 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s"), s("Eksenel hareket", "d1 ≤ 100 mm: ±0,5 mm · d1 > 100 mm: ±2,0 mm")],
    materials: PUSHER_MATERIALS,
    features: ["Dengeli çift salmastra", "Basınçlı bariyer sıvısı ile çalışma", "Dönüş yönünden bağımsız", "API Plan 53A/B/C uyumlu"],
    applications: ["Hidrokarbonlar", "Yüksek basınçlı reaktör besleme", "Sıvılaştırılmış gazlar", "Tehlikeli kimyasallar"],
    standards: ["EN 12756 (DIN 24960)"], equivalents: ["EagleBurgmann H74-D"], industries: ["kimya-ve-petrokimya", "enerji"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-H12", name: "KS-H12 Dengeli Konik Yaylı Salmastra", illustration: "seal-conical",
    summary: "Konik yaylı, dengeli, EN 12756 ölçülerinde kompakt salmastra.",
    description: "KS-H12, konik yay yapısının sadeliğini dengeli tasarımın basınç avantajıyla birleştirir. Kademeli mil gerektirir; orta basınçlı proses ve sıcak su pompalarında ekonomik bir dengeli salmastra çözümüdür.",
    specs: [s("Mil çapı (d1)", "10 … 80 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Sıcaklık (t)", "−50 … +220 °C"), s("Kayma hızı (vg)", "≤ 15 m/s"), s("Eksenel hareket", "±1,0 mm")],
    materials: PUSHER_MATERIALS,
    features: ["Dengeli tasarım", "Konik yay, dönüş yönüne bağlı", "Kompakt montaj boyu", "EN 12756 ölçüleri"],
    applications: ["Sıcak su pompaları", "Isıtma devreleri", "Orta basınçlı proses pompaları"],
    standards: ["EN 12756 (DIN 24960)"], equivalents: ["EagleBurgmann H12N"], industries: ["enerji", "kimya-ve-petrokimya"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-HJ92", name: "KS-HJ92 Korumalı Yaylı Salmastra", illustration: "seal-multispring",
    summary: "Yayları akışkandan korunmuş, viskoz ve kirli ortamlar için dengeli salmastra.",
    description: "KS-HJ92'de yaylar akışkanla temas etmeyecek şekilde gövde içinde korunur. Böylece lifli, yapışkan, kristalleşen veya katı içeren akışkanlarda yayların tıkanması önlenir. Kâğıt, şeker ve atık su endüstrisinde tercih edilir.",
    specs: [s("Mil çapı (d1)", "18 … 100 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Sıcaklık (t)", "−20 … +180 °C"), s("Kayma hızı (vg)", "≤ 10 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["Akışkandan korunmuş yaylar", "Dengeli tasarım", "Tıkanmaya karşı dayanıklı", "Dönüş yönünden bağımsız"],
    applications: ["Kâğıt hamuru ve lifli akışkanlar", "Şeker şurubu ve melas", "Çamur ve atık su", "Boya ve lateks"],
    standards: [], equivalents: ["EagleBurgmann HJ92N"], industries: ["kagit-ve-seluloz", "seker", "su-ve-atik-su"],
  }),
  P("o-ringli-salmastralar", {
    code: "KS-H75", name: "KS-H75 Ağır Hizmet Dengeli Salmastra", illustration: "seal-multispring",
    summary: "40 bar'a kadar, yüksek eksenel harekete izin veren ağır hizmet salmastrası.",
    description: "KS-H75, rafineri ve enerji pompalarında karşılaşılan yüksek basınç, sıcaklık ve eksenel harekete göre tasarlanmış dengeli bir salmastradır. Sabit yay yapısıyla yüksek devirlerde de kararlı çalışır.",
    specs: [s("Mil çapı (d1)", "20 … 110 mm"), s("Basınç (p1)", "≤ 40 bar"), s("Sıcaklık (t)", "−40 … +220 °C"), s("Kayma hızı (vg)", "≤ 23 m/s"), s("Eksenel hareket", "±2,0 … 4,0 mm (çapa bağlı)")],
    materials: PUSHER_MATERIALS,
    features: ["Dengeli, ağır hizmet tipi", "Yüksek eksenel hareket toleransı", "Yüksek devirlerde kararlı", "API uyumlu malzeme seçenekleri"],
    applications: ["Rafineri proses pompaları", "Kazan besleme", "Sıcak hidrokarbonlar"],
    standards: [], equivalents: ["EagleBurgmann H75VN"], industries: ["kimya-ve-petrokimya", "enerji"],
  }),

  // ===================== ELASTOMER KÖRÜKLÜ =====================
  P("elastomer-koruklu-salmastralar", {
    code: "KS-MG1", name: "KS-MG1 Elastomer Körüklü Salmastra", illustration: "seal-elastomer-bellows", is_featured: true,
    summary: "Mil üzerinde kaymayan elastomer körük sayesinde mili aşındırmayan, dünyada en yaygın salmastra tiplerinden biri.",
    description: "KS-MG1, dönen yüzeyi taşıyan elastomer körük ve körüğü saran konik yaydan oluşur. Körük mil üzerinde kaymadığından mil aşınması (fretting) oluşmaz. Temiz su, atık su, soğutma sıvıları ve hafif kimyasallarda uzun ömür sunar. EN 12756 KU montaj ölçüsüne uygun versiyonu mevcuttur.",
    specs: [s("Mil çapı (d1)", "10 … 100 mm"), s("Basınç (p1)", "≤ 16 bar · vakum ≤ 0,5 bar (yatak kilitli 1 bar)"), s("Sıcaklık (t)", "−20 … +140 °C"), s("Kayma hızı (vg)", "≤ 10 m/s"), s("Eksenel hareket", "±2,0 mm")],
    materials: BELLOWS_MATERIALS,
    features: ["Dönüş yönünden bağımsız", "Mili aşındırmayan körük yapısı", "Mil salgısı ve eksenel harekete toleranslı", "EN 12756 uyumlu versiyon"],
    applications: ["Temiz ve atık su", "Dalgıç pompalar", "Soğutma sıvıları", "Havuz ve sulama pompaları"],
    standards: ["EN 12756 (KU)"], equivalents: ["EagleBurgmann MG1", "Tip MG1"], industries: ["su-ve-atik-su", "gida-ve-icecek", "denizcilik"],
  }),
  P("elastomer-koruklu-salmastralar", {
    code: "KS-MG12", name: "KS-MG12 Elastomer Körüklü Salmastra", illustration: "seal-elastomer-bellows",
    summary: "Silindirik yaylı, kısa montaj boylu elastomer körüklü salmastra.",
    description: "KS-MG12, silindirik yay ile elastomer körüğün birlikte çalıştığı kompakt bir salmastradır. Kısa montaj boyu gerektiren sirkülasyon ve blok pompalarda tercih edilir; ayna yüzeyi farklı malzemelerle kombine edilebilir.",
    specs: [s("Mil çapı (d1)", "10 … 100 mm"), s("Basınç (p1)", "≤ 12 bar · vakum ≤ 0,5 bar"), s("Sıcaklık (t)", "−20 … +140 °C"), s("Kayma hızı (vg)", "≤ 10 m/s"), s("Eksenel hareket", "±0,5 mm")],
    materials: BELLOWS_MATERIALS,
    features: ["Silindirik yay", "Kısa montaj boyu", "Dönüş yönünden bağımsız", "Ekonomik yedek parça"],
    applications: ["Blok ve sirkülasyon pompaları", "Isıtma ve soğutma devreleri", "Su ve glikol karışımları"],
    standards: ["EN 12756 (KU, kısa versiyon)"], equivalents: ["EagleBurgmann MG12 / MG912"], industries: ["su-ve-atik-su", "enerji"],
  }),
  P("elastomer-koruklu-salmastralar", {
    code: "KS-MG13", name: "KS-MG13 Elastomer Körüklü Salmastra", illustration: "seal-elastomer-bellows",
    summary: "EN 12756 uzun montaj boyuna uygun, silindirik yaylı elastomer körüklü salmastra.",
    description: "KS-MG13, KS-MG12 ile aynı çalışma prensibine sahip, EN 12756 KU uzun montaj boyuna uygun versiyondur. Standart norm pompalarda mevcut salmastranın doğrudan yerine kullanılabilir.",
    specs: [s("Mil çapı (d1)", "10 … 100 mm"), s("Basınç (p1)", "≤ 12 bar · vakum ≤ 0,5 bar"), s("Sıcaklık (t)", "−20 … +140 °C"), s("Kayma hızı (vg)", "≤ 10 m/s"), s("Eksenel hareket", "±0,5 mm")],
    materials: BELLOWS_MATERIALS,
    features: ["EN 12756 KU montaj boyu", "Silindirik yay", "Dönüş yönünden bağımsız"],
    applications: ["Norm pompalar", "Su ve atık su", "Hafif kimyasallar"],
    standards: ["EN 12756 (KU)"], equivalents: ["EagleBurgmann MG13 / MG913"], industries: ["su-ve-atik-su", "kimya-ve-petrokimya"],
  }),
  P("elastomer-koruklu-salmastralar", {
    code: "KS-21", name: "KS-21 Elastomer Körüklü Salmastra (Tip 21)", illustration: "seal-elastomer-bellows",
    summary: "Metal kovanlı elastomer körüklü, inç ve metrik ölçülerde genel amaçlı salmastra.",
    description: "KS-21, metal bir kovanla desteklenmiş elastomer körük ve silindirik yaydan oluşan klasik bir tasarımdır. Beyaz eşya, ev tipi ve hafif endüstriyel pompalarda, sirkülasyon ve sulama pompalarında yaygın olarak kullanılır.",
    specs: [s("Mil çapı (d1)", "6 … 70 mm (inç ölçüler mevcut)"), s("Basınç (p1)", "≤ 6 bar · vakum ≤ 0,5 bar"), s("Sıcaklık (t)", "−20 … +120 °C"), s("Kayma hızı (vg)", "≤ 10 m/s")],
    materials: BELLOWS_MATERIALS,
    features: ["Metal kovanlı körük", "Dönüş yönünden bağımsız", "İnç ve metrik ölçüler", "Stoktan hızlı teslim"],
    applications: ["Sirkülasyon ve hidrofor pompaları", "Sulama pompaları", "Beyaz eşya ve ev tipi pompalar"],
    standards: [], equivalents: ["Tip 21", "EagleBurgmann BT-AR"], industries: ["su-ve-atik-su"],
  }),
  P("elastomer-koruklu-salmastralar", {
    code: "KS-560", name: "KS-560 Kompakt Körüklü Salmastra", illustration: "seal-elastomer-bellows",
    summary: "Küçük pompalar için kauçuk körüklü, düşük basınçlı kompakt salmastra.",
    description: "KS-560, küçük mil çaplarında sade ve ekonomik bir sızdırmazlık çözümüdür. Kauçuk körük, yüzey ve yay tek ünite halinde monte edilir; küçük santrifüj ve dalgıç pompalar için idealdir.",
    specs: [s("Mil çapı (d1)", "8 … 50 mm"), s("Basınç (p1)", "≤ 7 bar · vakum ≤ 0,1 bar"), s("Sıcaklık (t)", "−20 … +100 °C"), s("Kayma hızı (vg)", "≤ 5 m/s"), s("Eksenel hareket", "±1,0 mm")],
    materials: BELLOWS_MATERIALS,
    features: ["Kompakt ve hafif", "Tek ünite montaj", "Ekonomik"],
    applications: ["Küçük santrifüj pompalar", "Dalgıç drenaj pompaları", "Yıkama makinesi pompaları"],
    standards: [], equivalents: ["Tip 560", "EagleBurgmann EA560"], industries: ["su-ve-atik-su"],
  }),

  // ===================== METAL KÖRÜKLÜ =====================
  P("metal-koruklu-salmastralar", {
    code: "KS-MFL85", name: "KS-MFL85 Metal Körüklü Salmastra", illustration: "seal-metal-bellows", is_featured: true,
    summary: "Kaynaklı metal körüklü, sabit tip, dönüş yönünden bağımsız salmastra.",
    description: "KS-MFL85'te yay görevini kaynaklı metal körük üstlenir; dinamik O-ring bulunmaz. Bu sayede O-ring kaynaklı yapışma ve aşınma sorunları ortadan kalkar, geniş kimyasal ve sıcaklık aralığında çalışılabilir. Sıcak su, hidrokarbon ve polimerleşen akışkanlarda tercih edilir.",
    specs: [s("Mil çapı (d1)", "16 … 100 mm"), s("Basınç (p1)", "Dıştan basınçlı ≤ 25 bar · içten basınçlı ≤ 10 bar (<120 °C), ≤ 5 bar (<220 °C)"), s("Sıcaklık (t)", "−40 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s")],
    materials: METAL_BELLOWS_MATERIALS,
    features: ["Dinamik O-ring yok", "Kaynaklı metal körük", "Dönüş yönünden bağımsız", "Kendi kendini temizleyen körük hareketi"],
    applications: ["Sıcak su ve kondensat", "Hidrokarbonlar", "Polimerleşen akışkanlar", "Yüksek sıcaklıklı prosesler"],
    standards: [], equivalents: ["EagleBurgmann MFL85N"], industries: ["kimya-ve-petrokimya", "enerji"],
  }),
  P("metal-koruklu-salmastralar", {
    code: "KS-MBS100", name: "KS-MBS100 Metal Körüklü Salmastra", illustration: "seal-metal-bellows",
    summary: "Dönen metal körüklü, EN 12756 ölçülerine uygun salmastra.",
    description: "KS-MBS100, dönen metal körük yapısıyla standart pompalarda O-ringli salmastraların doğrudan yerine kullanılabilen bir metal körüklü salmastradır. Kimya ve proses pompalarında kararlı performans sunar.",
    specs: [s("Mil çapı (d1)", "20 … 100 mm"), s("Basınç (p1)", "≤ 25 bar (Q1/Q1 kombinasyonunda ≤ 16 bar)"), s("Sıcaklık (t)", "−40 … +220 °C (Q1/Q1: +160 °C)"), s("Kayma hızı (vg)", "≤ 20 m/s")],
    materials: METAL_BELLOWS_MATERIALS,
    features: ["Dönen metal körük", "EN 12756 ölçülerine uygun", "Dönüş yönünden bağımsız"],
    applications: ["Kimya proses pompaları", "Solventler", "Sıcak yağlar"],
    standards: ["EN 12756"], equivalents: ["EagleBurgmann MBS100"], industries: ["kimya-ve-petrokimya"],
  }),
  P("metal-koruklu-salmastralar", {
    code: "KS-MF95", name: "KS-MF95 Metal Körüklü Salmastra", illustration: "seal-metal-bellows",
    summary: "EN 12756 ölçülerinde dönen metal körüklü, kompakt salmastra.",
    description: "KS-MF95, dönen metal körüklü kompakt yapısıyla standart norm pompalara uyar. Kimyasal dayanımı yüksek körük malzemesi sayesinde agresif akışkanlarda güvenle kullanılabilir.",
    specs: [s("Mil çapı (d1)", "14 … 100 mm"), s("Basınç (p1)", "≤ 16 bar"), s("Sıcaklık (t)", "−40 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s"), s("Eksenel hareket", "±0,5 mm")],
    materials: METAL_BELLOWS_MATERIALS,
    features: ["Dönen metal körük", "EN 12756 ölçüleri", "Kompakt yapı"],
    applications: ["Norm kimya pompaları", "Asit ve alkaliler", "Sıcak su"],
    standards: ["EN 12756"], equivalents: ["EagleBurgmann MF95N"], industries: ["kimya-ve-petrokimya"],
  }),
  P("metal-koruklu-salmastralar", {
    code: "KS-MFLWT", name: "KS-MFLWT Yüksek Sıcaklık Metal Körüklü Salmastra", illustration: "seal-metal-bellows",
    summary: "Isı transfer yağları için +400 °C'ye kadar metal körüklü salmastra.",
    description: "KS-MFLWT, ısı transfer yağları ve sıcak hidrokarbonlar için geliştirilmiş, esnek grafit sekonder contalı metal körüklü bir salmastradır. Elastomer içermeyen yapısı yüksek sıcaklıklarda güvenli çalışma sağlar.",
    specs: [s("Mil çapı (d1)", "16 … 150 mm"), s("Basınç (p1)", "Dıştan basınçlı ≤ 25 bar · içten basınçlı ≤ 10 bar (<120 °C), ≤ 5 bar (<220 °C), ≤ 3 bar (<400 °C)"), s("Sıcaklık (t)", "−20 … +400 °C"), s("Kayma hızı (vg)", "≤ 20 m/s")],
    materials: METAL_BELLOWS_MATERIALS,
    features: ["Elastomersiz tasarım", "Esnek grafit sekonder conta", "+400 °C'ye kadar", "Sabit yatak kilitli"],
    applications: ["Kızgın yağ (termal yağ) pompaları", "Sıcak bitüm ve asfalt", "Sıcak hidrokarbonlar"],
    standards: [], equivalents: ["EagleBurgmann MFLWT"], industries: ["tekstil", "kimya-ve-petrokimya", "enerji"],
  }),
  P("metal-koruklu-salmastralar", {
    code: "KS-MFL65", name: "KS-MFL65 Yüksek Hız Metal Körüklü Salmastra", illustration: "seal-metal-bellows",
    summary: "50 m/s kayma hızına ve +400 °C'ye kadar sabit metal körüklü salmastra.",
    description: "KS-MFL65, sabit metal körük yapısı sayesinde yüksek devirli ve yüksek sıcaklıklı uygulamalarda kararlı çalışır. Rafineri ve petrokimya proseslerinde API uyumlu malzemelerle tedarik edilir.",
    specs: [s("Mil çapı (d1)", "16 … 100 mm (daha büyük çaplar talebe göre)"), s("Basınç (p1)", "Dıştan basınçlı ≤ 25 bar · içten basınçlı ≤ 10 / 5 / 3 bar (120 / 220 / 400 °C)"), s("Sıcaklık (t)", "−20 … +400 °C"), s("Kayma hızı (vg)", "≤ 50 m/s")],
    materials: METAL_BELLOWS_MATERIALS,
    features: ["Sabit metal körük", "Yüksek kayma hızı", "Yüksek sıcaklık", "Sabit yatak kilitli"],
    applications: ["Rafineri pompaları", "Sıcak hidrokarbonlar", "Yüksek devirli pompalar"],
    standards: [], equivalents: ["EagleBurgmann MFL65"], industries: ["kimya-ve-petrokimya", "enerji"],
  }),

  // ===================== ÖZEL TİP =====================
  P("ozel-tip-salmastralar", {
    code: "KS-HR", name: "KS-HR Çamur Tipi Salmastra", illustration: "seal-cartridge",
    summary: "Katı içerikli ve aşındırıcı akışkanlar için ağır hizmet salmastrası.",
    description: "KS-HR, çamur, maden ve kum içeren akışkanlarda çalışan pompalar için tasarlanmıştır. Aşınmaya dayanıklı SiC/SiC yüzeyleri ve akışkandan korunmuş yay yapısı sayesinde zorlu ortamlarda uzun ömür sağlar.",
    specs: [s("Mil çapı (dN)", "36 … 270 mm"), s("Basınç (p1)", "≤ 16 bar"), s("Sıcaklık (t)", "−20 … +160 °C"), s("Kayma hızı (vg)", "≤ 10 m/s")],
    materials: [m("Yüzeyler", ["SiC / SiC", "TC / TC"]), FACES.elastomer, m("Metal parçalar", ["AISI 316", "Duplex paslanmaz"])],
    features: ["Aşındırıcı akışkanlara dayanıklı", "Korunmuş yaylar", "Geniş katı toleransı", "Vakumda quench bağlantısı"],
    applications: ["Çamur pompaları", "Maden ve cevher işleme", "Kum ve çakıl yıkama", "Baca gazı desülfürizasyonu"],
    standards: [], equivalents: ["EagleBurgmann HR serisi"], industries: ["su-ve-atik-su", "demir-celik", "enerji"],
  }),
  P("ozel-tip-salmastralar", {
    code: "KS-SPLIT", name: "KS-SPLIT Ayrık (Split) Salmastra", illustration: "seal-split",
    summary: "Pompayı sökmeden monte edilebilen, iki parçalı kartuş salmastra.",
    description: "KS-SPLIT, tüm parçaları ikiye bölünmüş olarak üretilir; bu sayede motor ve pompa sökülmeden, mil üzerinde montaj yapılabilir. Büyük çaplı pompa, mikser ve pervane millerinde bakım süresini günlerden saatlere indirir.",
    specs: [s("Mil çapı (d1)", "50 … 150 mm"), s("Basınç (p1)", "≤ 10 bar"), s("Sıcaklık (t)", "−40 … +150 °C (80 °C üzerinde yıkama önerilir)"), s("Kayma hızı (vg)", "≤ 10 m/s"), s("Eksenel / radyal hareket", "±1,5 mm / ±0,8 mm")],
    materials: [m("Yüzeyler", ["Karbon / SiC", "SiC / SiC"]), FACES.elastomer, m("Metal parçalar", ["AISI 316"])],
    features: ["Pompa sökülmeden montaj", "Tamamen ayrık yapı", "Büyük mil çapları", "Kısa duruş süresi"],
    applications: ["Büyük santrifüj pompalar", "Mikserler ve pervaneler", "Kâğıt makineleri", "Gemi pervane milleri"],
    standards: [], equivalents: ["EagleBurgmann Splitex"], industries: ["kagit-ve-seluloz", "su-ve-atik-su", "denizcilik"],
  }),

  // ===================== KARTUŞ =====================
  P("kartus-salmastralar", {
    code: "KS-CS", name: "KS-CS Tek Kartuş Salmastra", illustration: "seal-cartridge", is_featured: true,
    summary: "Fabrikada ayarlı, dengeli, tek kartuş salmastra — norm pompalar için standart çözüm.",
    description: "KS-CS; salmastra, burç, flanş ve ayar klipsleriyle birlikte tek ünite olarak teslim edilir. Montajda ölçü alma ve ayar gerekmez; klipsler çıkarıldıktan sonra salmastra çalışmaya hazırdır. Dengeli tasarımı ve farklı flanş seçenekleriyle ISO 2858 / ISO 5199 pompalarına uyar.",
    specs: [s("Mil çapı (d1)", "25 … 100 mm (diğer ölçüler talebe göre)"), s("Basınç (p1)", "Karbon/SiC: ≤ 25 bar · SiC/SiC: ≤ 12 bar"), s("Sıcaklık (t)", "−40 … +220 °C (O-ring dayanımına bağlı)"), s("Kayma hızı (vg)", "Karbon/SiC: ≤ 16 m/s · SiC/SiC: ≤ 10 m/s"), s("Eksenel hareket", "±1,0 mm (d1 ≥ 75 mm: ±1,5 mm)")],
    materials: PUSHER_MATERIALS,
    features: ["Fabrikada ayarlı, montaja hazır", "Dengeli, dönüş yönünden bağımsız", "Yıkama (flush) ve quench bağlantıları", "Norm pompalara uygun flanşlar"],
    applications: ["Kimya proses pompaları", "Kâğıt ve selüloz", "Su ve atık su", "Gıda ve içecek"],
    standards: ["ISO 2858 / ISO 5199 pompalarına uygun"], equivalents: ["EagleBurgmann Cartex-SN"], industries: ["kimya-ve-petrokimya", "kagit-ve-seluloz", "su-ve-atik-su", "gida-ve-icecek"],
  }),
  P("kartus-salmastralar", {
    code: "KS-CSQ", name: "KS-CSQ Quench'li Tek Kartuş Salmastra", illustration: "seal-cartridge",
    summary: "Atmosfer tarafında dudak conta veya kısma burcuyla quench uygulamalı tek kartuş salmastra.",
    description: "KS-CSQ, tek kartuş salmastranın atmosfer tarafına dudak conta (Q) veya kısma burcu (T) eklenmiş versiyonudur. Kristalleşen, havayla reaksiyona giren veya soğutulması gereken akışkanlarda quench sıvısı veya buharı ile güvenli çalışma sağlar.",
    specs: [s("Mil çapı (d1)", "25 … 100 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Sıcaklık (t)", "−40 … +220 °C"), s("Kayma hızı (vg)", "≤ 16 m/s"), s("Quench basıncı", "Basınçsız (≤ 0,5 bar)")],
    materials: PUSHER_MATERIALS,
    features: ["Dudak contalı veya kısma burçlu quench", "Kristalleşme ve kurumaya karşı koruma", "Fabrikada ayarlı"],
    applications: ["Şeker çözeltileri", "Kostik ve kristalleşen ürünler", "Sıcak akışkanlar"],
    standards: [], equivalents: ["EagleBurgmann Cartex-QN / TN"], industries: ["seker", "kimya-ve-petrokimya"],
  }),
  P("kartus-salmastralar", {
    code: "KS-CD", name: "KS-CD Çift Kartuş Salmastra", illustration: "seal-cartridge-double", is_featured: true,
    summary: "Bariyer sıvısı ile çalışan, fabrikada ayarlı çift kartuş salmastra.",
    description: "KS-CD, iki salmastranın tek kartuş ünitede birleştirildiği, basınçlı bariyer sıvısı ile çalışan bir sistemdir. Tehlikeli, toksik veya aşındırıcı akışkanlarda ürünün atmosfere kaçmasını engeller. Dahili pompalama halkası bariyer sıvısının dolaşımını sağlar.",
    specs: [s("Mil çapı (d1)", "25 … 100 mm"), s("Basınç (p1)", "Karbon/SiC: ≤ 25 bar · SiC/SiC: ≤ 20 bar"), s("Bariyer basıncı (p3)", "≤ 25 bar · ideal Δp (p3 − p1) = 2 … 3 bar"), s("Sıcaklık (t)", "−40 … +220 °C"), s("Kayma hızı (vg)", "≤ 16 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["Çift salmastra, tek kartuş", "Dahili pompalama halkası", "API Plan 53A/B/C ve 54 uyumlu", "Fabrikada basınç testli"],
    applications: ["Toksik ve yanıcı akışkanlar", "Solventler", "Polimer ve reçineler", "Vakum pompaları"],
    standards: [], equivalents: ["EagleBurgmann Cartex-DN"], industries: ["kimya-ve-petrokimya", "ilac"],
  }),
  P("kartus-salmastralar", {
    code: "KS-MTX", name: "KS-MTX Kompakt Kartuş Salmastra", illustration: "seal-cartridge",
    summary: "EN 12756 salmastra boşluklarına sığan, kompakt tek kartuş salmastra.",
    description: "KS-MTX, standart EN 12756 salmastra boşluğunda pompa üzerinde değişiklik gerektirmeden kullanılabilen kompakt bir kartuş salmastradır. Montaj kolaylığını dar yerlerde de mümkün kılar.",
    specs: [s("Mil çapı (d1)", "25 … 80 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Sıcaklık (t)", "−40 … +220 °C (O-ring dayanımına bağlı)"), s("Kayma hızı (vg)", "≤ 20 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["Kompakt kartuş", "Pompa değişikliği gerektirmez", "Dönüş yönünden bağımsız"],
    applications: ["Norm pompalar", "Blok pompalar", "Proses pompaları"],
    standards: ["EN 12756 boşluklarına uygun"], equivalents: ["EagleBurgmann Mtex"], industries: ["kimya-ve-petrokimya", "su-ve-atik-su"],
  }),
  P("kartus-salmastralar", {
    code: "KS-MTXD", name: "KS-MTXD Kompakt Çift Kartuş Salmastra", illustration: "seal-cartridge-double",
    summary: "Standart salmastra boşluğuna sığan kompakt çift kartuş salmastra.",
    description: "KS-MTXD, kompakt kartuş yapısını çift salmastra güvenliğiyle birleştirir. Bariyer sıvısı sistemleriyle birlikte, dar salmastra boşluklarında bile tehlikeli akışkanların sızdırmazlığını sağlar.",
    specs: [s("Mil çapı (d1)", "25 … 80 mm"), s("Basınç (p1)", "≤ 25 bar"), s("Bariyer basıncı (p3)", "≤ 16 bar · ideal Δp = 2 … 3 bar"), s("Sıcaklık (t)", "−40 … +220 °C"), s("Kayma hızı (vg)", "≤ 20 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["Kompakt çift kartuş", "API Plan 52 / 53 / 54 uyumlu", "Pompa değişikliği gerektirmez"],
    applications: ["Tehlikeli kimyasallar", "Sıcak akışkanlar", "Solventler"],
    standards: [], equivalents: ["EagleBurgmann Mtex-D"], industries: ["kimya-ve-petrokimya"],
  }),
  P("kartus-salmastralar", {
    code: "KS-KNV", name: "KS-KNV Salmastra Konvertörü", illustration: "seal-cartridge",
    summary: "Örgü salmastralı pompaları mekanik salmastraya dönüştüren adaptör kiti.",
    description: "KS-KNV, örgü salmastra kutusuna sahip eski pompaların salmastra kutusu işlenmeden kartuş mekanik salmastraya dönüştürülmesini sağlar. Pompa ölçüleri yerinde alınarak projelendirilir; su kaybını ve bakım ihtiyacını büyük ölçüde azaltır.",
    specs: [s("Uygulama", "Örgü salmastra kutulu pompalar"), s("Mil çapı", "Pompaya göre projelendirilir"), s("Malzeme", "AISI 316 flanş ve burç")],
    materials: [m("Flanş ve burç", ["AISI 316", "Duplex paslanmaz"]), FACES.elastomer],
    features: ["Pompa gövdesinde işleme gerektirmez", "Kartuş salmastra ile uyumlu", "Yerinde ölçü ve projelendirme"],
    applications: ["Eski tip su pompaları", "Kâğıt ve selüloz pompaları", "Sirkülasyon pompaları"],
    standards: [], equivalents: [], industries: ["su-ve-atik-su", "kagit-ve-seluloz"],
  }),

  // ===================== MİKSER =====================
  P("mikser-salmastralari", {
    code: "KS-AG1", name: "KS-AG1 Tek Mikser Salmastrası (DIN 28138)", illustration: "seal-agitator", is_featured: true,
    summary: "Üstten tahrikli karıştırıcılar için rulmanlı, tek kartuş mikser salmastrası.",
    description: "KS-AG1, DIN 28138 bağlantı ölçülerine uygun, entegre rulmanlı kartuş tipi bir mikser salmastrasıdır. Rulman, mil salgısını salmastra yüzeylerinden uzak tutar. Basınçsız veya düşük basınçlı tanklarda, quench sistemiyle birlikte kullanılır.",
    specs: [s("Mil çapı (d3)", "40 … 220 mm"), s("Basınç (p1)", "vakum … 6 bar"), s("Sıcaklık (t)", "−40 … +150 °C (soğutma flanşıyla +250 °C)"), s("Kayma hızı (vg)", "0 … 5 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["DIN 28138 bağlantı ölçüleri", "Entegre rulman", "Kartuş tasarım", "Quench bağlantısı"],
    applications: ["Karıştırıcı tankları", "Reaktörler", "Depolama tankları"],
    standards: ["DIN 28138 T2"], equivalents: ["EagleBurgmann M481"], industries: ["kimya-ve-petrokimya", "ilac", "gida-ve-icecek"],
  }),
  P("mikser-salmastralari", {
    code: "KS-AG2", name: "KS-AG2 Çift Mikser Salmastrası (DIN 28138)", illustration: "seal-agitator",
    summary: "Basınçlı reaktörler için bariyer sıvılı çift mikser salmastrası.",
    description: "KS-AG2, iki salmastranın bariyer sıvısı ile çalıştığı, entegre rulmanlı çift mikser salmastrasıdır. Basınçlı reaktörlerde tehlikeli buharların ve ürünün atmosfere çıkmasını önler; tampon sıvı sistemleriyle birlikte kullanılır.",
    specs: [s("Mil çapı (d3)", "40 … 220 mm"), s("Basınç (p1)", "vakum … 16 bar"), s("Bariyer basıncı (p3)", "≤ 18 bar"), s("Sıcaklık (t)", "−40 … +200 °C (özel tasarımda +350 °C)"), s("Kayma hızı (vg)", "0 … 5 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["Çift salmastra", "Entegre rulman", "Tampon sıvı sistemi ile uyumlu", "Soğutma flanşı seçeneği"],
    applications: ["Basınçlı reaktörler", "Polimerizasyon", "Hidrojenasyon"],
    standards: ["DIN 28138 T2"], equivalents: ["EagleBurgmann M481 (çift)", "M461"], industries: ["kimya-ve-petrokimya", "ilac"],
  }),
  P("mikser-salmastralari", {
    code: "KS-AGDRY", name: "KS-AGDRY Kuru Çalışan Mikser Salmastrası", illustration: "seal-agitator",
    summary: "Sıvı yağlama gerektirmeyen, gaz fazında çalışan mikser salmastrası.",
    description: "KS-AGDRY, özel karbon yüzey malzemesi sayesinde yağlama sıvısı olmadan kuru çalışır. Bariyer sıvısının ürüne karışmasının istenmediği gıda, ilaç ve toz karıştırıcılarında temiz bir çözüm sunar.",
    specs: [s("Mil çapı (d1)", "25 … 160 mm"), s("Basınç (p1)", "vakum … 6 bar"), s("Sıcaklık (t)", "−20 … +150 °C (soğutma flanşıyla +250 °C)"), s("Kayma hızı (vg)", "0 … 2 m/s"), s("Eksenel / radyal hareket", "±1,5 mm / ±1,5 mm")],
    materials: [m("Yüzeyler", ["Özel karbon / SiC", "Karbon / TC"]), FACES.elastomer, m("Metal parçalar", ["AISI 316L"])],
    features: ["Kuru çalışma — bariyer sıvısı gerekmez", "Ürün kontaminasyonu riski yok", "Toz ve katı karıştırıcılar için uygun"],
    applications: ["Toz mikserleri", "Gıda ve ilaç reaktörleri", "Kurutucular"],
    standards: [], equivalents: ["EagleBurgmann SeccoMix"], industries: ["gida-ve-icecek", "ilac"],
  }),
  P("mikser-salmastralari", {
    code: "KS-AGMR", name: "KS-AGMR Yan Girişli Mikser Salmastrası", illustration: "seal-cartridge-double",
    summary: "Yan ve alttan girişli karıştırıcılar için çift kartuş mikser salmastrası.",
    description: "KS-AGMR, yan veya alttan tahrikli karıştırıcılarda sıvı altında çalışan çift kartuş salmastradır. Mil salgısı ve eksenel kaçıklığa toleranslı tasarımı, büyük tank karıştırıcılarında güvenilir çalışma sağlar.",
    specs: [s("Mil çapı (d1)", "30 … 200 mm"), s("Basınç (p1)", "vakum … 14 bar"), s("Bariyer basıncı (p3)", "≤ 16 bar · Δp = 2 … 10 bar"), s("Sıcaklık (t)", "−20 … +200 °C"), s("Kayma hızı (vg)", "≤ 10 m/s")],
    materials: PUSHER_MATERIALS,
    features: ["Yan ve alttan girişli karıştırıcılar", "Çift kartuş", "Eksenel ve radyal kaçıklık toleransı"],
    applications: ["Kâğıt hamuru tankları", "Biyogaz fermentörleri", "Büyük depolama tankları"],
    standards: [], equivalents: ["EagleBurgmann MR-D"], industries: ["kagit-ve-seluloz", "su-ve-atik-su", "kimya-ve-petrokimya"],
  }),

  // ===================== OEM =====================
  ...[
    ["KS-GF", "Grundfos Uyumlu Kartuş Salmastra", "Grundfos CR, CRN, CRI ve NB/NK serisi pompalar için 12, 16 ve 22 mm mil çaplarında muadil kartuş salmastralar.", ["12 mm", "16 mm", "22 mm"], ["Grundfos CR / CRN / CRI", "NB / NK serisi"], "seal-cartridge"],
    ["KS-FL", "Flygt Uyumlu Plug-in Salmastra", "Flygt dalgıç pompaları için iç ve dış salmastra setleri; plug-in tip muadil salmastralar.", ["20 mm", "25 mm", "35 mm", "45 mm"], ["Flygt 3085 / 3102 / 3127 / 3153", "Flygt 3171 / 3202 / 3301"], "seal-cartridge"],
    ["KS-AL", "Alfa Laval Uyumlu Salmastra", "Alfa Laval LKH, SolidC ve MR serisi hijyenik pompalar için muadil salmastralar.", ["22 mm", "32 mm", "42 mm"], ["Alfa Laval LKH", "SolidC", "MR serisi"], "seal-multispring"],
    ["KS-FR", "Fristam Uyumlu Salmastra", "Fristam FP ve FPR hijyenik santrifüj pompaları için muadil salmastralar.", ["25 mm", "35 mm", "45 mm"], ["Fristam FP / FPR / FPE"], "seal-multispring"],
    ["KS-APV", "APV Uyumlu Salmastra", "APV W+ ve Puma serisi hijyenik pompalar için muadil salmastralar.", ["25 mm", "35 mm"], ["APV W+ serisi", "APV Puma"], "seal-multispring"],
    ["KS-LW", "Lowara Uyumlu Salmastra", "Lowara e-SV, SV ve FH serisi pompalar için muadil salmastralar.", ["12 mm", "16 mm", "22 mm", "28 mm"], ["Lowara e-SV / SV", "FH / SH serisi"], "seal-conical"],
  ].map(([code, name, summary, sizes, pumps, illustration]) =>
    P("oem-pompa-salmastralari", {
      code, name: `${code} ${name}`, illustration, summary,
      description: `${summary} Orijinal parça ile aynı montaj ölçülerine sahip olup doğrudan değiştirilebilir. Siparişte pompa etiketindeki model ve seri numarasını veya eski salmastranın fotoğrafını paylaşmanız yeterlidir. Marka adları yalnızca uyumluluğu belirtmek amacıyla kullanılmaktadır; ürünler ilgili üreticinin orijinal parçası değildir.`,
      specs: [s("Mil çapı", sizes.join(" · ")), s("Uyumlu pompalar", pumps.join(" · ")), s("Çalışma limitleri", "Pompa üreticisinin salmastra limitleri geçerlidir")],
      materials: PUSHER_MATERIALS,
      features: ["Birebir montaj ölçüsü", "Orijinal malzeme kombinasyonlarına eşdeğer seçenekler", "Stoktan hızlı teslimat"],
      applications: pumps,
      standards: [], equivalents: [], industries: ["su-ve-atik-su", "gida-ve-icecek"],
    }),
  ),

  // ===================== DÖNER BAŞLIKLAR =====================
  ...[
    ["su-basliklari", "KS-RJ10", "Su Başlığı — Tek Akışlı", "rotary-joint", "Soğutma ve proses suyu için tek akışlı, karbon grafit contalı döner başlık.", [s("Bağlantı ölçüsü", "3/8\" … 3\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +90 °C"), s("Devir", "≤ 1500 d/d (ölçüye bağlı)")], ["Plastik ve kauçuk kalenderleri", "Soğutma silindirleri", "Ekstrüzyon hatları"], ["tekstil", "demir-celik"]],
    ["su-basliklari", "KS-RJ12", "Su Başlığı — Çift Akışlı", "rotary-joint-double", "Giriş ve dönüşün aynı başlıktan yapıldığı, sabit veya dönen sifonlu çift akışlı su başlığı.", [s("Bağlantı ölçüsü", "1/2\" … 3\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +90 °C"), s("Devir", "≤ 1000 d/d")], ["Soğutma silindirleri", "Kalıp soğutma", "Merdane soğutma"], ["tekstil", "demir-celik"]],
    ["su-basliklari", "KS-RJ14", "Paslanmaz Su Başlığı", "rotary-joint", "Gıda ve korozif ortamlar için AISI 316 gövdeli su başlığı.", [s("Bağlantı ölçüsü", "3/8\" … 2\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +90 °C"), s("Gövde", "AISI 316")], ["Gıda silindirleri", "Deniz suyu soğutma", "Korozif akışkanlar"], ["gida-ve-icecek", "denizcilik"]],
    ["su-basliklari", "KS-RJ16", "Sürekli Döküm Su Başlığı", "rotary-joint", "Sürekli döküm makinelerinin rulo soğutma hatları için yüksek debili, kompakt su başlığı.", [s("Bağlantı ölçüsü", "1/2\" … 1 1/2\""), s("Basınç", "≤ 16 bar"), s("Sıcaklık", "≤ +90 °C"), s("Devir", "≤ 250 d/d")], ["Sürekli döküm makineleri", "Haddehane soğutma hatları"], ["demir-celik"]],
    ["buhar-basliklari", "KS-RJ20", "Buhar Başlığı — Tek Akışlı", "rotary-joint", "Kurutma silindirleri için kendinden yataklı, tek akışlı buhar başlığı.", [s("Bağlantı ölçüsü", "1/2\" … 4\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +200 °C (doymuş buhar)"), s("Devir", "≤ 500 d/d")], ["Kâğıt kurutma silindirleri", "Tekstil kurutma silindirleri", "Ütü ve kalender merdaneleri"], ["kagit-ve-seluloz", "tekstil"]],
    ["buhar-basliklari", "KS-RJ22", "Buhar Başlığı — Çift Akışlı Sifonlu", "rotary-joint-double", "Kondensin sabit veya dönen sifonla tahliye edildiği çift akışlı buhar başlığı.", [s("Bağlantı ölçüsü", "3/4\" … 4\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +200 °C"), s("Devir", "≤ 500 d/d")], ["Kâğıt makineleri kurutma grubu", "Oluklu mukavva makineleri", "Tekstil silindirleri"], ["kagit-ve-seluloz", "tekstil"]],
    ["buhar-basliklari", "KS-RJ24", "Kompakt Buhar Başlığı", "rotary-joint", "Dar alanlar için kısa boylu, flanş bağlantılı buhar başlığı.", [s("Bağlantı ölçüsü", "1/2\" … 2\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +200 °C"), s("Devir", "≤ 300 d/d")], ["Ütü presleri", "Kalenderler"], ["tekstil"]],
    ["buhar-basliklari", "KS-RJ26", "Vakum Kırıcılı Buhar Başlığı", "rotary-joint-double", "Makine duruşunda silindir içinde vakum oluşmasını önleyen vakum kırıcılı çift akışlı başlık.", [s("Bağlantı ölçüsü", "1\" … 3\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +200 °C"), s("Devir", "≤ 500 d/d")], ["Kurutma silindirleri", "Buharlı ısıtma merdaneleri"], ["kagit-ve-seluloz", "tekstil"]],
    ["kizgin-yag-basliklari", "KS-RJ30", "Kızgın Yağ Başlığı — Tek Akışlı", "rotary-joint", "Isı transfer yağları için soğutma kanatlı, çift rulmanlı döner başlık.", [s("Bağlantı ölçüsü", "1/2\" … 3\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +350 °C"), s("Devir", "≤ 500 d/d")], ["Ramöz ve kurutma makineleri", "Laminasyon silindirleri", "Plastik film hatları"], ["tekstil", "kimya-ve-petrokimya"]],
    ["kizgin-yag-basliklari", "KS-RJ32", "Kızgın Yağ Başlığı — Çift Akışlı", "rotary-joint-double", "Giriş ve dönüşün tek başlıktan yapıldığı kızgın yağ başlığı.", [s("Bağlantı ölçüsü", "3/4\" … 3\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +350 °C"), s("Devir", "≤ 300 d/d")], ["Kalenderler", "Isıtmalı silindirler"], ["tekstil", "kimya-ve-petrokimya"]],
    ["kizgin-yag-basliklari", "KS-RJ34", "Yüksek Sıcaklık Kızgın Yağ Başlığı", "rotary-joint", "Uzatılmış soğutma boynu ve yüksek sıcaklık rulmanlarıyla ağır hizmet kızgın yağ başlığı.", [s("Bağlantı ölçüsü", "1\" … 4\""), s("Basınç", "≤ 10 bar"), s("Sıcaklık", "≤ +350 °C"), s("Devir", "≤ 250 d/d")], ["Kauçuk ve plastik kalenderleri", "Pres plakaları"], ["kimya-ve-petrokimya"]],
    ["hava-hidrolik-basliklari", "KS-RJ40", "Pnömatik Başlık", "rotary-joint", "Basınçlı hava ve vakum için yüksek devirli döner başlık.", [s("Bağlantı ölçüsü", "1/8\" … 1\""), s("Basınç", "≤ 10 bar · vakum"), s("Sıcaklık", "≤ +70 °C"), s("Devir", "≤ 3000 d/d")], ["Pnömatik aynalar ve frenler", "Sarıcı miller", "Vakum tutuculu tamburlar"], ["tekstil", "kagit-ve-seluloz"]],
    ["hava-hidrolik-basliklari", "KS-RJ42", "Hidrolik Başlık", "rotary-joint", "Hidrolik yağ için yüksek basınçlı, tek ve çok kanallı döner başlık.", [s("Bağlantı ölçüsü", "1/4\" … 1\""), s("Basınç", "≤ 200 bar"), s("Sıcaklık", "≤ +80 °C"), s("Devir", "≤ 300 d/d")], ["Hidrolik aynalar", "Döner tablalar", "Vinç ve iş makineleri"], ["demir-celik"]],
    ["hava-hidrolik-basliklari", "KS-RJ44", "Yüksek Devirli Soğutma Sıvısı Başlığı", "rotary-joint", "CNC tezgâhlarında iş milinden soğutma sıvısı iletimi için dengeli yüzeyli başlık.", [s("Bağlantı ölçüsü", "1/8\" … 1/2\""), s("Basınç", "≤ 70 bar"), s("Sıcaklık", "≤ +70 °C"), s("Devir", "≤ 20.000 d/d")], ["CNC iş milleri", "Delik delme ve taşlama tezgâhları"], ["demir-celik"]],
  ].map(([cat, code, name, illustration, summary, specs, applications, industries]) =>
    P(cat, {
      code, name: `${code} ${name}`, illustration, summary,
      description: `${summary} Sızdırmazlık, lepleme ile düzlenmiş karbon grafit ve sert yüzey çifti ile sağlanır; tüm yıpranan parçalar yedek set olarak tedarik edilebilir. Ölçü seçimi için silindir bağlantı ölçüsü, akışkan, basınç, sıcaklık ve devir bilgisini paylaşmanız yeterlidir.`,
      specs: [...specs, s("Not", "Değerler tipik olup ölçü ve akışkana göre değişir")],
      materials: [m("Gövde", ["Dökme demir", "Pirinç", "AISI 316 (opsiyon)"]), m("Sızdırmazlık yüzeyleri", ["Karbon grafit", "SiC", "Seramik"]), m("Conta", ["NBR", "FKM", "PTFE", "Esnek grafit"])],
      features: ["Karbon grafit yüzeyli sızdırmazlık", "Kendinden yataklı yapı", "Yedek parça setleri mevcuttur", "Esnek hortum bağlantısı önerilir"],
      applications, standards: [], equivalents: [], industries,
    }),
  ),

  // ===================== SWIVEL JOINT =====================
  P("swivel-joint", {
    code: "KS-SJ20", name: "KS-SJ20 Dişli Swivel Joint", illustration: "swivel-joint",
    summary: "Dişli bağlantılı, tek düzlemde 360° dönen bilyalı döner mafsal.",
    description: "KS-SJ20, çift sıra bilyalı yatak yapısıyla eksenel ve radyal yükleri taşıyarak hortum ve boru hatlarında serbest dönüş sağlar. Dolum kolları ve hortum makaralarında hattın burulmasını engeller.",
    specs: [s("Bağlantı", "1/2\" … 4\" BSP / NPT"), s("Basınç", "≤ PN 25"), s("Sıcaklık", "−30 … +200 °C (conta malzemesine bağlı)"), s("Gövde", "Karbon çelik (galvaniz) · AISI 316")],
    materials: [m("Gövde", ["Karbon çelik", "AISI 316"]), m("Conta", ["NBR", "FKM", "PTFE", "EPDM"])],
    features: ["Çift sıra bilyalı yatak", "360° serbest dönüş", "Değiştirilebilir contalar"],
    applications: ["Dolum ve boşaltım kolları", "Hortum makaraları", "Tank kamyonları"],
    standards: [], equivalents: [], industries: ["kimya-ve-petrokimya", "gida-ve-icecek"],
  }),
  P("swivel-joint", {
    code: "KS-SJ50", name: "KS-SJ50 Flanşlı Swivel Joint", illustration: "swivel-joint",
    summary: "Flanş bağlantılı, çok düzlemde dönüş için ağır hizmet döner mafsal.",
    description: "KS-SJ50, flanşlı bağlantısı ve güçlendirilmiş bilyalı yataklarıyla büyük çaplı hatlarda ve yükleme kollarında kullanılır. Farklı stil kombinasyonlarıyla bir, iki veya üç düzlemde hareket sağlar.",
    specs: [s("Bağlantı", "DN 25 … DN 150 (EN 1092-1 / ASME B16.5 flanş)"), s("Basınç", "≤ PN 40"), s("Sıcaklık", "−30 … +200 °C"), s("Gövde", "Karbon çelik · AISI 316")],
    materials: [m("Gövde", ["Karbon çelik", "AISI 316"]), m("Conta", ["NBR", "FKM", "PTFE"])],
    features: ["Flanşlı bağlantı", "Ağır hizmet yatakları", "Çok düzlemli stiller"],
    applications: ["Yükleme kolları", "Liman ve terminal hatları", "Proses boru hatları"],
    standards: ["EN 1092-1", "ASME B16.5"], equivalents: [], industries: ["kimya-ve-petrokimya", "denizcilik"],
  }),

  // ===================== TAMPON SIVI =====================
  P("tampon-sivi-sistemleri", {
    code: "KS-P52", name: "KS-P52 Termosifon Tankı (API Plan 52 / 53A)", illustration: "seal-support-vessel",
    summary: "Çift salmastralar için soğutma serpantinli, seviye ve basınç göstergeli tampon/bariyer tankı.",
    description: "KS-P52, çift mekanik salmastraların tampon (Plan 52) veya basınçlı bariyer (Plan 53A) sıvısını depolar ve termosifon etkisiyle dolaştırır. Soğutma serpantini, seviye göstergesi, basınç göstergesi ve seviye/basınç switch'leri ile donatılır.",
    specs: [s("Hacim", "10 L · 20 L"), s("Tasarım basıncı", "≤ 40 bar"), s("Tasarım sıcaklığı", "−20 … +200 °C"), s("Malzeme", "AISI 316L")],
    materials: [m("Tank ve bağlantılar", ["AISI 316L"]), m("Enstrümantasyon", ["Seviye göstergesi", "Manometre", "Seviye / basınç switch'i"])],
    features: ["Dahili soğutma serpantini", "Termosifon dolaşımı", "Enstrümantasyon seçenekleri", "Duvar veya şase montajı"],
    applications: ["Çift mekanik salmastralar", "Tandem salmastralar", "Mikser salmastraları"],
    standards: ["API 682 Plan 52 / 53A"], equivalents: [], industries: ["kimya-ve-petrokimya", "enerji"],
  }),
  P("tampon-sivi-sistemleri", {
    code: "KS-P53B", name: "KS-P53B Akümülatörlü Bariyer Sistemi (API Plan 53B)", illustration: "seal-support-vessel",
    summary: "Balon akümülatörlü, kanatlı soğutuculu kapalı devre bariyer sistemi.",
    description: "KS-P53B, bariyer sıvısını azot ön dolumlu balon akümülatör ile basınçlandırır; böylece gaz bariyer sıvısına karışmaz. Kanatlı hava soğutucu veya su soğutmalı eşanjör ile ısı uzaklaştırılır. Uzun süre dolum gerektirmeden çalışır.",
    specs: [s("Akümülatör hacmi", "10 L · 20 L · 35 L"), s("Tasarım basıncı", "≤ 100 bar"), s("Tasarım sıcaklığı", "−20 … +150 °C"), s("Soğutma", "Kanatlı hava soğutucu · su soğutmalı eşanjör")],
    materials: [m("Borulama", ["AISI 316L"]), m("Balon", ["NBR", "FKM", "ECO"])],
    features: ["Gaz-sıvı teması yok", "Yüksek basınçlı uygulamalar", "Uzun dolum aralığı", "Manuel veya otomatik dolum ünitesi"],
    applications: ["Yüksek basınçlı çift salmastralar", "Hidrokarbon pompaları", "Uzak sahalar"],
    standards: ["API 682 Plan 53B"], equivalents: [], industries: ["kimya-ve-petrokimya", "enerji"],
  }),

  // ===================== YUMUŞAK SALMASTRALAR =====================
  ...[
    ["KS-GP10", "Saf PTFE Örgü Salmastra", "packing-ptfe", "Saf PTFE ipliklerden örülmüş, gıda ve kimya uygulamaları için beyaz örgü salmastra.", "−200 … +260 °C", "0 … 14", "8 m/s", "Dönen 15 bar · Pistonlu 100 bar · Statik 200 bar", ["Gıda ve ilaç pompaları", "Güçlü asitler ve alkaliler", "Karıştırıcılar ve vanalar"], ["gida-ve-icecek", "ilac", "kimya-ve-petrokimya"]],
    ["KS-GP12", "Grafitli PTFE Örgü Salmastra", "packing-graphite-ptfe", "Grafit emdirilmiş PTFE ipliklerden örülmüş; yüksek ısı iletkenliği ve düşük sürtünmeli genel amaçlı salmastra.", "−200 … +280 °C", "0 … 14", "20 m/s", "Dönen 25 bar · Pistonlu 100 bar · Statik 200 bar", ["Santrifüj pompalar", "Sıcak su ve buhar", "Kimyasal akışkanlar"], ["kimya-ve-petrokimya", "enerji", "kagit-ve-seluloz"]],
    ["KS-GP14", "Sentetik Elyaf Örgü Salmastra", "packing-synthetic", "PTFE emdirilmiş sentetik elyaflardan örülmüş, aşınmaya dayanıklı çok amaçlı salmastra.", "−100 … +250 °C", "1 … 13", "15 m/s", "Dönen 20 bar · Pistonlu 100 bar · Statik 150 bar", ["Su ve atık su pompaları", "Kâğıt hamuru", "Genel endüstriyel pompalar"], ["su-ve-atik-su", "kagit-ve-seluloz"]],
    ["KS-GP20", "Rami Örgü Salmastra", "packing-ramie", "PTFE ve yağlayıcı emdirilmiş rami liflerinden örülmüş, su ve deniz suyu için ekonomik salmastra.", "−30 … +130 °C", "4 … 12", "12 m/s", "Dönen 15 bar · Pistonlu 150 bar · Statik 200 bar", ["Su pompaları", "Deniz suyu ve tuzlu su", "Gemi pervane milleri"], ["su-ve-atik-su", "denizcilik"]],
    ["KS-GP30", "Aramid (Kevlar®) Örgü Salmastra", "packing-aramid", "PTFE emdirilmiş aramid ipliklerden örülmüş; aşındırıcı ve katı içeren akışkanlar için yüksek mukavemetli salmastra.", "−50 … +280 °C", "2 … 12", "15 m/s", "Dönen 25 bar · Pistonlu 200 bar · Statik 250 bar", ["Çamur ve katı içeren pompalar", "Şeker ve kâğıt hamuru", "Maden pompaları"], ["seker", "kagit-ve-seluloz", "demir-celik"]],
    ["KS-GP32", "Zebra Örgü Salmastra (Aramid Köşeli)", "packing-zebra", "Köşeleri aramid, yüzeyleri grafitli PTFE olan hibrit örgü; aşınma dayanımı ile düşük sürtünmeyi birleştirir.", "−50 … +280 °C", "2 … 12", "20 m/s", "Dönen 25 bar · Pistonlu 150 bar · Statik 250 bar", ["Aşındırıcı akışkanlı pompalar", "Kâğıt ve selüloz", "Karıştırıcılar"], ["kagit-ve-seluloz", "kimya-ve-petrokimya"]],
    ["KS-GP50", "Saf Grafit Örgü Salmastra", "packing-graphite", "Esnek (genleşmiş) grafit ipliklerden örülmüş; yüksek sıcaklık ve buhar için salmastra.", "−200 … +450 °C (oksitleyici ortam) · +650 °C (buhar)", "0 … 14", "20 m/s", "Dönen 40 bar · Pistonlu 100 bar · Statik 300 bar", ["Buhar ve sıcak su vanaları", "Kazan besleme pompaları", "Sıcak yağlar"], ["enerji", "kimya-ve-petrokimya"]],
    ["KS-GP52", "Telli Grafit Örgü Salmastra", "packing-graphite-wire", "Inconel® tel takviyeli esnek grafit örgü; yüksek basınçlı vana ve buhar uygulamaları için.", "−200 … +550 °C (oksitleyici ortam) · +650 °C (buhar)", "0 … 14", "2 m/s", "Pistonlu / vana 250 bar · Statik 400 bar", ["Yüksek basınçlı buhar vanaları", "Kızgın yağ vanaları", "Santral vanaları"], ["enerji", "kimya-ve-petrokimya"]],
    ["KS-GP60", "Cam Elyaf Kare Örgü", "packing-glass", "Cam elyaf ipliklerden kare kesitli örgü; fırın ve kazan kapaklarında ısıl sızdırmazlık için.", "≤ +550 °C", "—", "Statik", "Statik uygulama", ["Fırın ve kazan kapakları", "Baca ve duman kanalları", "Isıl yalıtım"], ["enerji", "demir-celik"]],
    ["KS-GP62", "Cam Elyaf Yuvarlak Fitil", "packing-glass", "Cam elyaf ipliklerden yuvarlak kesitli örgü fitil; kapak ve kanal sızdırmazlığı için.", "≤ +550 °C", "—", "Statik", "Statik uygulama", ["Soba ve şömine kapakları", "Fırın kapakları", "Isıl yalıtım"], ["enerji"]],
    ["KS-GP64", "Cam Elyaf Şerit", "packing-glass", "Cam elyaf dokuma şerit; flanş, kapak ve ısıl yalıtım uygulamaları için.", "≤ +550 °C", "—", "Statik", "Statik uygulama", ["Egzoz ve baca sargısı", "Flanş yalıtımı", "Fırın kapakları"], ["enerji", "demir-celik"]],
  ].map(([code, name, illustration, summary, temp, ph, speed, pressure, applications, industries]) =>
    P("yumusak-salmastralar", {
      code, name: `${code} ${name}`, illustration, summary,
      description: `${summary} Makara halinde (1–5 kg) veya ölçüye kesilmiş/preslenmiş halkalar olarak tedarik edilir. Standart kesitler 3 × 3 mm'den 30 × 30 mm'ye kadardır.`,
      specs: [s("Sıcaklık", temp), s("pH aralığı", ph), s("Kayma hızı", speed), s("Basınç", pressure), s("Kesitler", "3 × 3 … 30 × 30 mm")],
      materials: [],
      features: ["Makara veya hazır halka", "Standart kesitler stoktan", "Kolay kesim ve montaj"],
      applications, standards: [], equivalents: [], industries,
    }),
  ),

  // ===================== PTFE =====================
  ...[
    ["KS-PT10", "PTFE Levha", "Saf ve dolgulu (cam, karbon, bronz, grafit) PTFE levhalar; conta kesimi ve işlenmiş parçalar için.", [s("Kalınlık", "0,5 … 100 mm"), s("Ölçü", "1000 × 1000 mm · 1200 × 1200 mm"), s("Sıcaklık", "−200 … +260 °C"), s("Kaliteler", "Saf · %25 cam · %25 karbon · %40 bronz · %15 grafit")]],
    ["KS-PT20", "PTFE Çubuk", "Burç, yatak ve işlenmiş sızdırmazlık parçaları için saf ve dolgulu PTFE çubuklar.", [s("Çap", "Ø 5 … 300 mm"), s("Boy", "1000 mm"), s("Sıcaklık", "−200 … +260 °C"), s("Kaliteler", "Saf · cam · karbon · bronz dolgulu")]],
    ["KS-PT30", "PTFE Boru (Kovan)", "Büyük çaplı burç, kovan ve contalar için PTFE borular.", [s("Dış çap", "Ø 20 … 500 mm"), s("Boy", "≤ 300 mm (kalıpla)"), s("Sıcaklık", "−200 … +260 °C")]],
    ["KS-PT40", "Genleşmiş PTFE Conta Bandı", "Yapışkan arkalı, yumuşak genleşmiş PTFE (ePTFE) bant; düzgün olmayan flanşlarda hızlı conta uygulaması.", [s("Genişlik", "3 … 50 mm"), s("Kalınlık", "1,5 … 12 mm"), s("Sıcaklık", "−240 … +270 °C"), s("pH", "0 … 14"), s("Basınç", "≤ 200 bar")]],
  ].map(([code, name, summary, specs]) =>
    P("ptfe-urunleri", {
      code, name: `${code} ${name}`, illustration: "ptfe", summary,
      description: `${summary} Talebe göre ölçüye kesim ve CNC işleme hizmeti verilir.`,
      specs, materials: [], features: ["Neredeyse tüm kimyasallara dayanıklı", "Düşük sürtünme katsayısı", "Gıdaya uygun kaliteler (FDA)"],
      applications: ["Contalar ve burçlar", "Kimya ekipmanları", "Gıda makineleri"], standards: [], equivalents: [], industries: ["kimya-ve-petrokimya", "gida-ve-icecek"],
    }),
  ),

  // ===================== CONTA VE LEVHALAR =====================
  P("conta-ve-levhalar", {
    code: "KS-CL10", name: "KS-CL10 Asbestsiz Conta Levhası", illustration: "gasket-sheet",
    summary: "Aramid lif ve NBR bağlayıcılı, genel amaçlı asbestsiz conta levhası.",
    description: "KS-CL10; su, buhar, yağ, yakıt ve hafif kimyasallar için flanş contalarında kullanılan asbestsiz lifli levhadır. Levha olarak veya ölçüye kesilmiş conta olarak tedarik edilir.",
    specs: [s("Kalınlık", "0,5 · 1 · 1,5 · 2 · 3 mm"), s("Ölçü", "1500 × 1500 mm"), s("Sıcaklık", "≤ +250 °C (anlık +350 °C)"), s("Basınç", "≤ 80 bar")],
    materials: [], features: ["Asbestsiz", "Kolay kesilebilir", "Yüksek sıkıştırma dayanımı"],
    applications: ["Flanş contaları", "Pompa ve kompresör kapakları", "Buhar ve sıcak su hatları"], standards: [], equivalents: [], industries: ["enerji", "kimya-ve-petrokimya"],
  }),
  P("conta-ve-levhalar", {
    code: "KS-CL20", name: "KS-CL20 Grafit Conta Levhası", illustration: "gasket-sheet",
    summary: "Paslanmaz tel veya folyo takviyeli esnek grafit levha; yüksek sıcaklık ve buhar için.",
    description: "KS-CL20, AISI 316 folyo veya tel örgü ile takviye edilmiş esnek grafit levhadır. Yüksek sıcaklık, buhar ve ısı transfer yağlarında uzun ömürlü conta sağlar.",
    specs: [s("Kalınlık", "1 · 1,5 · 2 · 3 mm"), s("Ölçü", "1000 × 1000 mm · 1500 × 1500 mm"), s("Sıcaklık", "−200 … +450 °C (oksitleyici ortam) · +650 °C (buhar)"), s("Basınç", "≤ 100 bar")],
    materials: [], features: ["Esnek grafit", "AISI 316 takviye", "Yüksek sıcaklık"],
    applications: ["Buhar hatları", "Kızgın yağ sistemleri", "Eşanjörler"], standards: [], equivalents: [], industries: ["enerji", "kimya-ve-petrokimya", "tekstil"],
  }),
  P("conta-ve-levhalar", {
    code: "KS-CL30", name: "KS-CL30 Spiral Sargılı Conta", illustration: "spiral-gasket",
    summary: "Paslanmaz çelik şerit ve grafit/PTFE dolgulu, iç ve dış halkalı spiral sargılı conta.",
    description: "KS-CL30, yüksek basınç ve sıcaklık dalgalanmalarında güvenilir sızdırmazlık sağlayan spiral sargılı contadır. EN 1514-2 ve ASME B16.20 ölçülerinde, iç ve/veya dış merkezleme halkalı olarak tedarik edilir.",
    specs: [s("Ölçüler", "DN 15 … DN 600 · 1/2\" … 24\""), s("Basınç sınıfı", "PN 10 … PN 160 · Class 150 … 2500"), s("Sıcaklık", "−200 … +550 °C (grafit dolgu)"), s("Malzeme", "AISI 316L şerit · grafit / PTFE dolgu")],
    materials: [], features: ["İç ve dış halka seçenekleri", "Yüksek basınç ve sıcaklık", "Standart ve özel ölçüler"],
    applications: ["Rafineri ve petrokimya flanşları", "Buhar hatları", "Eşanjörler"], standards: ["EN 1514-2", "ASME B16.20"], equivalents: [], industries: ["kimya-ve-petrokimya", "enerji"],
  }),
  P("conta-ve-levhalar", {
    code: "KS-CL40", name: "KS-CL40 Kauçuk Levha", illustration: "rubber-sheet",
    summary: "NBR, EPDM, FKM, silikon ve SBR kauçuk levhalar; bezli ve bezsiz.",
    description: "KS-CL40 kauçuk levhalar; yağ (NBR), su ve buhar (EPDM), yüksek sıcaklık ve kimyasal (FKM), gıda (silikon) ve genel amaçlı (SBR) uygulamalar için farklı sertlik ve kalınlıklarda sunulur.",
    specs: [s("Kalınlık", "1 … 20 mm"), s("Genişlik", "1000 · 1200 · 1400 mm"), s("Sertlik", "60 … 70 Shore A"), s("Malzemeler", "NBR · EPDM · FKM · VMQ · SBR")],
    materials: [], features: ["Bezli / bezsiz seçenek", "Gıdaya uygun kaliteler", "Ölçüye kesim"],
    applications: ["Conta kesimi", "Titreşim sönümleme", "Kapak ve kapı sızdırmazlığı"], standards: [], equivalents: [], industries: ["gida-ve-icecek", "su-ve-atik-su"],
  }),
  P("conta-ve-levhalar", {
    code: "KS-CL50", name: "KS-CL50 Ölçüye Kesilmiş Contalar", illustration: "gasket-sheet",
    summary: "Çizim veya numuneye göre CNC ile kesilmiş flanş, kapak ve özel contalar.",
    description: "KS-CL50, stoktaki levhalardan çizime veya numuneye göre hassas kesilen contalardır. Tek adetten seri üretime kadar hızlı teslim edilir.",
    specs: [s("Malzemeler", "Asbestsiz · grafit · PTFE · kauçuk"), s("Ölçü", "Çizim veya numuneye göre"), s("Kesim", "CNC bıçak / kalıp")],
    materials: [], features: ["Tek adetten seri üretime", "Hassas kesim", "Hızlı teslimat"],
    applications: ["Flanş contaları", "Kapak contaları", "Özel makine contaları"], standards: [], equivalents: [], industries: ["kimya-ve-petrokimya", "enerji", "gida-ve-icecek"],
  }),

  // ===================== O-RINGLER =====================
  ...[
    ["KS-OR-NBR", "NBR O-Ring", "o-ring-nbr", "Mineral yağlar, yakıtlar ve su için en yaygın O-ring malzemesi.", "−30 … +100 °C", ["Hidrolik ve pnömatik sistemler", "Yağ ve yakıt hatları", "Su pompaları"]],
    ["KS-OR-FKM", "FKM (Viton®) O-Ring", "o-ring-fkm", "Yüksek sıcaklık, yağlar, yakıtlar ve pek çok kimyasal için florokarbon O-ring.", "−20 … +200 °C", ["Kimya pompaları", "Mekanik salmastralar", "Sıcak yağ sistemleri"]],
    ["KS-OR-EPDM", "EPDM O-Ring", "o-ring-epdm", "Sıcak su, buhar, alkaliler ve hava koşullarına dayanıklı; mineral yağa uygun değildir.", "−50 … +150 °C", ["Sıcak su ve buhar", "Gıda ve içecek (FDA kaliteler)", "Soğutma suyu"]],
    ["KS-OR-VMQ", "Silikon (VMQ) O-Ring", "o-ring-vmq", "Geniş sıcaklık aralığı ve gıda uyumluluğu gereken statik uygulamalar için silikon O-ring.", "−60 … +200 °C", ["Gıda ve ilaç ekipmanları", "Statik yüksek sıcaklık contaları", "Tıbbi cihazlar"]],
    ["KS-OR-FFKM", "FFKM O-Ring", "o-ring-ffkm", "Neredeyse tüm kimyasallara ve yüksek sıcaklıklara dayanıklı perfloroelastomer O-ring.", "−15 … +320 °C", ["Agresif kimyasallar", "Yarı iletken ve ilaç prosesleri", "Mekanik salmastralar"]],
    ["KS-OR-FEP", "FEP Kaplı O-Ring", "o-ring-fep", "FKM veya silikon çekirdekli, FEP kaplı O-ring; PTFE'ye yakın kimyasal dayanım ve elastik yapı.", "−60 … +205 °C", ["Kimya pompaları", "Mekanik salmastralar", "Gıda ve ilaç"]],
  ].map(([code, name, illustration, summary, temp, applications]) =>
    P("o-ringler", {
      code, name: `${code} ${name}`, illustration, summary,
      description: `${summary} ISO 3601, AS568 ve JIS standart ölçülerinde stoktan; özel ölçülerde kalıptan veya vulkanize birleştirme ile tedarik edilir.`,
      specs: [s("Sıcaklık", temp), s("Sertlik", "70 … 90 Shore A (FEP kaplı hariç)"), s("Ölçü standardı", "ISO 3601 · AS568 · JIS B 2401"), s("Kesit", "1 … 12 mm")],
      materials: [], features: ["Standart ölçüler stoktan", "Özel ölçü imalatı", "Mekanik salmastra O-ring setleri"],
      applications, standards: ["ISO 3601", "AS568"], equivalents: [], industries: ["kimya-ve-petrokimya", "gida-ve-icecek"],
    }),
  ),

  // ===================== KARBON VE YÜZEY =====================
  ...[
    ["KS-FR10", "Karbon Grafit Salmastra Yüzü", "seal-face-carbon", "Reçine veya antimon emdirilmiş karbon grafit dönen/sabit yüzler.", [s("Kaliteler", "Reçine emdirilmiş · antimon emdirilmiş"), s("Düzlemsellik", "≤ 2 ışık bandı (≈ 0,6 µm)"), s("Sıcaklık", "Reçine: ≤ +200 °C · antimon: ≤ +450 °C")]],
    ["KS-FR20", "Silisyum Karbür (SiC) Yüz", "seal-face-sic", "Sinterlenmiş (SSiC) veya reaksiyon bağlı (RBSiC) silisyum karbür sert yüzler.", [s("Kaliteler", "SSiC · RBSiC · grafit katkılı SiC"), s("Sertlik", "≈ 2500 HV"), s("Düzlemsellik", "≤ 2 ışık bandı")]],
    ["KS-FR30", "Tungsten Karbür (TC) Yüz", "seal-face-tc", "Nikel veya kobalt bağlayıcılı tungsten karbür yüzler; darbe ve aşınmaya dayanıklı.", [s("Kaliteler", "Ni bağlayıcılı (korozyona dayanıklı) · Co bağlayıcılı"), s("Sertlik", "≈ 1400 … 1600 HV"), s("Düzlemsellik", "≤ 2 ışık bandı")]],
    ["KS-FR40", "Seramik (Al₂O₃) Yüz", "seal-face-ceramic", "%99,5 alümina seramik sabit yüzler; su ve hafif kimyasallar için ekonomik çözüm.", [s("Saflık", "%99,5 Al₂O₃"), s("Sertlik", "≈ 1600 HV"), s("Düzlemsellik", "≤ 2 ışık bandı")]],
    ["KS-CB10", "Karbon Burç ve Yataklar", "seal-face-carbon", "Kuru veya akışkan yağlamalı çalışan karbon grafit burç, yatak ve segmanlar.", [s("Ölçü", "Çizim veya numuneye göre"), s("Sıcaklık", "≤ +350 °C (kaliteye bağlı)"), s("Kaliteler", "Reçine · antimon · bakır emdirilmiş")]],
  ].map(([code, name, illustration, summary, specs]) =>
    P("karbon-ve-yuzey-urunleri", {
      code, name: `${code} ${name}`, illustration, summary,
      description: `${summary} Çizime veya numuneye göre üretilir; tüm sızdırmazlık yüzeyleri lepleme ile düzlenip monokromatik ışık altında kontrol edilerek teslim edilir.`,
      specs, materials: [], features: ["Çizim veya numuneye göre üretim", "Lepleme ve düzlemsellik kontrolü", "Hızlı revizyon"],
      applications: ["Mekanik salmastra revizyonu", "Döner başlık yedekleri", "Pompa yatakları"], standards: [], equivalents: [], industries: ["kimya-ve-petrokimya", "su-ve-atik-su"],
    }),
  ),

  // ===================== LEPLEME =====================
  ...[
    ["KS-LP10", "Lepleme Makinesi", "Salmastra yüzlerinin düzlenmesi için dökme demir lepleme plakalı, koşullandırma halkalı tezgâh tipi makine.", [s("Plaka çapı", "Ø 380 · Ø 600 mm"), s("Halka sayısı", "3 koşullandırma halkası"), s("Parça çapı", "≤ Ø 160 / Ø 250 mm")]],
    ["KS-LP20", "Elmas Süspansiyon ve Pasta", "Farklı tane boyutlarında monokristal elmas süspansiyon ve lepleme pastaları.", [s("Tane boyutu", "1 · 3 · 6 · 9 · 15 µm"), s("Ambalaj", "250 ml · 500 ml · 1 L")]],
    ["KS-LP30", "Optik Düzlem Camı", "Işık bandı yöntemiyle düzlemsellik ölçümü için kuvars optik düzlem camları.", [s("Çap", "Ø 60 … Ø 300 mm"), s("Doğruluk", "λ/10 … λ/4")]],
    ["KS-LP40", "Monokromatik Işık Kaynağı", "Optik düzlem ile birlikte ışık bandı okumaya yarayan helyum ışık kaynağı.", [s("Dalga boyu", "Helyum ≈ 0,588 µm"), s("Kullanım", "1 ışık bandı ≈ 0,29 µm düzlemsellik")]],
  ].map(([code, name, summary, specs]) =>
    P("lepleme", {
      code, name: `${code} ${name}`, illustration: "lapping", summary,
      description: `${summary} Kurulum ve kullanım eğitimi verilebilir.`,
      specs, materials: [], features: ["Salmastra atölyeleri için eksiksiz set", "Sarf malzemeleri stoktan"],
      applications: ["Salmastra yüzü yenileme", "Vana yüzeyi lepleme", "Hassas düzlem parçalar"], standards: [], equivalents: [], industries: [],
    }),
  ),
];
