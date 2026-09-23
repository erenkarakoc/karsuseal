// Default site content. Admins override any of these fields from /admin/icerik; the stored
// JSON (table site_content) is deep-merged over these values, so new fields always have a value.

export type Cta = { label: string; href: string };
export type IconCard = { icon: string; title: string; text: string };
export type PageIntro = { eyebrow: string; title: string; description: string };

export const HOME_SECTIONS = ["categories", "featured", "industries", "services", "process", "cta"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];

export type HomeContent = {
  order: HomeSection[];
  hidden: HomeSection[];
  hero: {
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    description: string;
    primary: Cta;
    secondary: Cta;
    bullets: string[];
    mainImage: string;
    sideImage1: string;
    sideImage2: string;
    specTitle: string;
    specText: string;
  };
  categories: { eyebrow: string; title: string; description: string; linkLabel: string };
  featured: { eyebrow: string; title: string; link: Cta; limit: number };
  industries: { eyebrow: string; title: string; description: string; linkLabel: string };
  services: { eyebrow: string; title: string; description: string; buttonLabel: string };
  process: { steps: { title: string; text: string }[] };
};

export type Industry = { slug: string; name: string; summary: string; icon: string; challenges: string[]; categories: string[] };
export type IndustriesContent = { intro: PageIntro; items: Industry[] };

export type Service = { slug: string; title: string; summary: string; icon: string; details: string[] };
export type ServicesContent = { intro: PageIntro; items: Service[] };

export type AboutContent = { intro: { eyebrow: string; title: string }; body: string; primary: Cta; secondary: Cta; values: IconCard[] };
export type ContactContent = { intro: PageIntro; formTitle: string; formNote: string };
export type QuoteContent = { intro: PageIntro; cards: IconCard[] };
export type KvkkContent = { title: string; body: string };
export type GeneralContent = {
  ctaBand: { title: string; text: string; primary: Cta; secondary: Cta };
  footerAbout: string;
  megaMenu: { title: string; text: string };
  /** Floating WhatsApp button; the number itself is set in Ayarlar (settings.company_whatsapp). */
  whatsapp: { enabled: boolean; label: string; message: string };
};

export type ContentMap = {
  "ana-sayfa": HomeContent;
  sektorler: IndustriesContent;
  hizmetler: ServicesContent;
  kurumsal: AboutContent;
  iletisim: ContactContent;
  "teklif-al": QuoteContent;
  kvkk: KvkkContent;
  genel: GeneralContent;
};
export type ContentKey = keyof ContentMap;

export const DEFAULT_CONTENT: ContentMap = {
  "ana-sayfa": {
    order: [...HOME_SECTIONS],
    hidden: [],
    hero: {
      titleStart: "Sızdırmazlıkta",
      titleHighlight: "doğru parça",
      titleEnd: ", doğru zamanda.",
      description:
        "Pompa, mikser ve döner ekipmanlarınız için mekanik salmastra, kartuş salmastra, döner başlık ve sızdırmazlık ürünleri. Seçimden revizyona kadar teknik destek.",
      primary: { label: "Ürün kataloğu", href: "/urunler" },
      secondary: { label: "Teklif iste", href: "/teklif-al" },
      bullets: ["EN 12756 ölçülerinde standart tipler", "Muadil ve OEM uyumlu salmastralar", "Revizyon ve lepleme hizmeti", "Akışkana göre malzeme seçimi"],
      mainImage: "/illustrations/seal-cartridge.svg",
      sideImage1: "/illustrations/seal-multispring.svg",
      sideImage2: "/illustrations/rotary-joint.svg",
      specTitle: "KS-CS · Tek kartuş",
      specText: "d1 25–100 mm · ≤ 25 bar · −40…+220 °C",
    },
    categories: {
      eyebrow: "Ürün grupları",
      title: "Tüm sızdırmazlık ihtiyaçlarınız tek tedarikçide",
      description: "Standart tiplerden özel imalata kadar, akışkana ve çalışma koşullarına uygun ürünler.",
      linkLabel: "Tüm kategoriler",
    },
    featured: { eyebrow: "Öne çıkanlar", title: "En çok talep gören ürünler", link: { label: "Mekanik salmastralar", href: "/urunler/mekanik-salmastralar" }, limit: 8 },
    industries: {
      eyebrow: "Sektörler",
      title: "Her prosesin kendi sızdırmazlık sorunu var",
      description: "Sektörünüzün akışkanlarını, standartlarını ve bakım döngülerini biliyoruz.",
      linkLabel: "Tüm sektörler",
    },
    services: {
      eyebrow: "Hizmetler",
      title: "Ürünün ötesinde: seçim, revizyon ve saha desteği",
      description: "Salmastra ömrünü uzatmak, arızayı kökünden çözmek ve duruş süresini kısaltmak için yanınızdayız.",
      buttonLabel: "Hizmetlerimiz",
    },
    process: {
      steps: [
        { title: "Bilgileri paylaşın", text: "Pompa modeli, akışkan, basınç, sıcaklık ve mil çapı." },
        { title: "Doğru tipi seçelim", text: "Çalışma koşullarına uygun tip ve malzeme kombinasyonu." },
        { title: "Teklif ve tedarik", text: "Stoktan hızlı sevk veya ölçüye özel imalat." },
        { title: "Montaj ve destek", text: "Devreye alma, arıza analizi ve revizyon." },
      ],
    },
  },

  sektorler: {
    intro: { eyebrow: "Sektörler", title: "Sektörünüze göre sızdırmazlık", description: "Her sektörün akışkanı, standardı ve bakım döngüsü farklıdır. Uygulamanıza uygun ürün gruplarını keşfedin." },
    items: [
      { slug: "su-ve-atik-su", name: "Su ve Atık Su", icon: "droplets", summary: "Temiz su, atık su ve arıtma tesislerinde çalışan santrifüj, dalgıç ve çamur pompaları.", challenges: ["Kum ve katı içeren akışkanlarda yüzey aşınması", "Dalgıç pompalarda kuru çalışma riski", "Uzun bakım aralıkları ve erişimi zor sahalar"], categories: ["elastomer-koruklu-salmastralar", "kartus-salmastralar", "oem-pompa-salmastralari", "yumusak-salmastralar"] },
      { slug: "kimya-ve-petrokimya", name: "Kimya ve Petrokimya", icon: "flask", summary: "Agresif, toksik ve yüksek sıcaklıklı akışkanlar için dengeli, çift ve metal körüklü çözümler.", challenges: ["Toksik ve yanıcı akışkanlarda sıfır emisyon", "Agresif ortamlarda elastomer ve metal seçimi", "Yüksek basınç ve sıcaklıkta kararlı çalışma"], categories: ["kartus-salmastralar", "metal-koruklu-salmastralar", "tampon-sivi-sistemleri", "o-ringler"] },
      { slug: "gida-ve-icecek", name: "Gıda ve İçecek", icon: "utensils", summary: "Hijyenik pompalar, CIP/SIP hatları ve mikserler için FDA uyumlu malzemeler.", challenges: ["Hijyenik tasarım ve FDA uyumlu malzemeler", "CIP/SIP temizlik kimyasalları ve sıcaklık şokları", "Şeker ve süt ürünlerinde yüzeye yapışma"], categories: ["oem-pompa-salmastralari", "mikser-salmastralari", "o-ringler", "ptfe-urunleri"] },
      { slug: "ilac", name: "İlaç ve Kozmetik", icon: "pill", summary: "Steril proseslerde reaktör ve mikser salmastraları, kuru çalışan tasarımlar.", challenges: ["Steril ortam ve ürün kontaminasyonunun önlenmesi", "Reaktörlerde vakum ve basınç değişimleri", "Validasyon için izlenebilir malzeme"], categories: ["mikser-salmastralari", "kartus-salmastralar", "o-ringler"] },
      { slug: "kagit-ve-seluloz", name: "Kâğıt ve Selüloz", icon: "scroll", summary: "Kurutma silindirleri için buhar başlıkları ve lifli akışkan pompaları için salmastralar.", challenges: ["Lifli hamurun yay ve yüzeyleri tıkaması", "Kurutma silindirlerinde buhar ve kondens yönetimi", "Büyük çaplı pompalarda uzun duruş süreleri"], categories: ["buhar-basliklari", "kartus-salmastralar", "ozel-tip-salmastralar", "yumusak-salmastralar"] },
      { slug: "tekstil", name: "Tekstil", icon: "shirt", summary: "Boyama makineleri, ramöz ve kalenderler için salmastra ve kızgın yağ başlıkları.", challenges: ["Boya ve kimyasal banyolarında kristalleşme", "Ramöz ve kalenderlerde yüksek sıcaklık", "Sürekli çalışan makinelerde hızlı yedek parça"], categories: ["kizgin-yag-basliklari", "buhar-basliklari", "mekanik-salmastralar", "metal-koruklu-salmastralar"] },
      { slug: "demir-celik", name: "Demir-Çelik", icon: "flame", summary: "Sürekli döküm ve haddehane soğutma hatları için döner başlıklar ve dayanıklı salmastralar.", challenges: ["Yüksek sıcaklık ve tufal içeren soğutma suyu", "Sürekli döküm hatlarında döner bağlantılar", "Ağır hizmet ve darbeli yükler"], categories: ["su-basliklari", "hava-hidrolik-basliklari", "ozel-tip-salmastralar", "conta-ve-levhalar"] },
      { slug: "enerji", name: "Enerji", icon: "zap", summary: "Kazan besleme, kondensat ve soğutma suyu pompalarında yüksek basınç ve sıcaklık.", challenges: ["Kazan besleme pompalarında yüksek basınç", "Sıcak su ve kondensatta buharlaşma", "Planlı duruşlarda kısa revizyon süresi"], categories: ["o-ringli-salmastralar", "metal-koruklu-salmastralar", "conta-ve-levhalar", "yumusak-salmastralar"] },
      { slug: "denizcilik", name: "Denizcilik", icon: "ship", summary: "Gemi pompaları, balast ve soğutma sistemleri için deniz suyuna dayanıklı malzemeler.", challenges: ["Deniz suyu korozyonu", "Titreşim ve mil salgısı", "Limanda sınırlı bakım süresi"], categories: ["elastomer-koruklu-salmastralar", "o-ringli-salmastralar", "yumusak-salmastralar", "swivel-joint"] },
      { slug: "seker", name: "Şeker ve Nişasta", icon: "wheat", summary: "Viskoz ve kristal içeren akışkanlar için korumalı yaylı ve çift salmastralar.", challenges: ["Şurup ve melasta kristalleşme", "Viskoz akışkanlarda yüzey ısınması", "Kampanya döneminde kesintisiz çalışma"], categories: ["o-ringli-salmastralar", "kartus-salmastralar", "yumusak-salmastralar"] },
    ],
  },

  hizmetler: {
    intro: { eyebrow: "Hizmetler", title: "Seçimden revizyona teknik destek", description: "Salmastra ömrünü uzatmak, arızaları kökünden çözmek ve duruş süresini kısaltmak için ürünün ötesinde hizmet veriyoruz." },
    items: [
      { slug: "salmastra-revizyonu", title: "Salmastra Tamiri ve Revizyonu", icon: "wrench", summary: "Arızalı mekanik salmastraları söküp inceliyor, aşınan yüzey ve contaları yenileyerek test edip garanti ile teslim ediyoruz.", details: ["Sökme, temizlik ve hasar analizi", "Yüzeylerin lepleme ile yenilenmesi veya değişimi", "O-ring, yay ve sekonder conta yenileme", "Basınç / sızdırmazlık testi ve raporlama"] },
      { slug: "lepleme-hizmeti", title: "Lepleme ve Yüzey Yenileme", icon: "disc", summary: "Karbon, SiC ve TC yüzeyleri ışık bandı hassasiyetinde lepleyip optik düzlemle kontrol ediyoruz.", details: ["Karbon, SiC, TC ve seramik yüzeyler", "Monokromatik ışık ve optik düzlem ile kontrol", "Ø 10 – 250 mm aralığında parçalar", "Hızlı iş akışı ile kısa teslim"] },
      { slug: "olcuye-ozel-imalat", title: "Ölçüye Özel İmalat", icon: "ruler", summary: "Numune veya çizimden tersine mühendislik ile salmastra, burç ve yüzey imalatı yapıyoruz.", details: ["Numuneden ölçü alma ve teknik çizim", "Muadil salmastra ve yedek parça imalatı", "Özel malzeme kombinasyonları", "Küçük seri ve tekil üretim"] },
      { slug: "yerinde-servis", title: "Yerinde Teknik Destek", icon: "map-pin", summary: "Montaj, devreye alma ve arıza analizini sahada yapıyor, kök neden raporu sunuyoruz.", details: ["Montaj ve devreye alma", "Titreşim, hizalama ve mil salgısı kontrolü", "Arıza kök neden analizi", "Bakım personeline uygulamalı eğitim"] },
      { slug: "stok-tedarik", title: "Stok ve Hızlı Tedarik", icon: "package", summary: "Yaygın salmastra tipleri, O-ringler ve örgü salmastralar stoktan aynı gün sevk edilir.", details: ["Standart tipler ve yaygın ölçüler stokta", "O-ring ve örgü salmastra stoğu", "Planlı bakımlar için yedek parça setleri", "Türkiye geneli hızlı sevkiyat"] },
      { slug: "urun-secimi", title: "Ürün Seçimi ve Danışmanlık", icon: "compass", summary: "Akışkan, basınç, sıcaklık ve devir bilgilerinize göre doğru salmastra tipini ve malzemeyi seçiyoruz.", details: ["Akışkan, basınç, sıcaklık ve devir analizi", "Malzeme uyumluluk değerlendirmesi", "API 682 destek sistemi seçimi", "Toplam sahip olma maliyeti karşılaştırması"] },
    ],
  },

  kurumsal: {
    intro: { eyebrow: "Kurumsal", title: "Sızdırmazlığı bir parça değil, bir süreç olarak görüyoruz" },
    body: [
      "Karsu Seal; pompa, mikser, karıştırıcı ve döner ekipmanlar için mekanik salmastra, kartuş salmastra, döner başlık ve tamamlayıcı sızdırmazlık ürünleri sunar. Standart EN 12756 tiplerinden OEM uyumlu muadillere, örgü salmastradan O-ring ve conta ürünlerine kadar geniş bir yelpazede tek noktadan tedarik sağlar.",
      "Amacımız yalnızca doğru parçayı teslim etmek değil; salmastranın neden arızalandığını anlamak, çalışma koşullarına en uygun tip ve malzemeyi seçmek ve ekipmanlarınızın bir sonraki bakıma kadar sorunsuz çalışmasını sağlamaktır. Revizyon, lepleme ve ölçüye özel imalat hizmetlerimiz bu yaklaşımın parçasıdır.",
      "Su ve atık sudan kimyaya, gıdadan enerjiye kadar farklı sektörlerdeki müşterilerimize hızlı teklif, teknik danışmanlık ve saha desteğiyle hizmet veriyoruz.",
    ].join("\n\n"),
    primary: { label: "Ürün kataloğu", href: "/urunler" },
    secondary: { label: "İletişime geçin", href: "/iletisim" },
    values: [
      { icon: "microscope", title: "Mühendislik odaklı seçim", text: "Her talebi akışkan, basınç, sıcaklık ve devir bilgisiyle değerlendirir; ürünü değil çözümü öneririz." },
      { icon: "timer", title: "Duruş süresine saygı", text: "Stok, hızlı teklif ve revizyon hizmetiyle tesislerinizin çalışmaya devam etmesini önceliklendiririz." },
      { icon: "shield", title: "İzlenebilir kalite", text: "Malzeme kombinasyonlarını, çalışma limitlerini ve test sonuçlarını şeffaf biçimde paylaşırız." },
      { icon: "handshake", title: "Uzun vadeli iş birliği", text: "Tekrarlayan arızaların kök nedenini birlikte bularak bakım maliyetini düşürmeyi hedefleriz." },
    ],
  },

  iletisim: {
    intro: { eyebrow: "İletişim", title: "Size nasıl yardımcı olabiliriz?", description: "Ürün seçimi, teknik destek veya sipariş için bize yazın; mesai saatleri içinde dönüş yapıyoruz." },
    formTitle: "Mesaj gönderin",
    formNote: "Fiyat teklifi için teklif formunu kullanmanız daha hızlı sonuç verir.",
  },

  "teklif-al": {
    intro: { eyebrow: "Teklif", title: "Fiyat teklifi alın", description: "Listenizdeki ürünleri ve bildiğiniz çalışma koşullarını paylaşın; uygun tipi ve malzemeyi belirleyip size teklif gönderelim." },
    cards: [
      { icon: "file-search", title: "Ölçüyü bilmiyor musunuz?", text: "Pompa etiketindeki bilgileri veya eski salmastranın ölçülerini mesajınıza yazın; gerekirse fotoğraf için size e-posta ile dönelim." },
      { icon: "clock", title: "Hızlı dönüş", text: "Stoktaki ürünler için aynı iş günü, özel imalatlar için termin bilgisiyle birlikte teklif hazırlanır." },
    ],
  },

  kvkk: {
    title: "Kişisel Verilerin Korunması Aydınlatma Metni",
    body: [
      "Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") kapsamında, veri sorumlusu sıfatıyla Karsu Seal tarafından internet sitemizdeki iletişim ve teklif formları aracılığıyla elde edilen kişisel verilerin işlenmesine ilişkin olarak hazırlanmıştır.",
      "## İşlenen kişisel veriler",
      "Ad soyad, firma adı, e-posta adresi, telefon numarası, şehir ve form üzerinden ilettiğiniz mesaj ile teknik bilgiler.",
      "## İşleme amaçları",
      "Talebinizin değerlendirilmesi ve yanıtlanması, fiyat teklifi hazırlanması, satış öncesi ve sonrası iletişimin yürütülmesi.",
      "## Hukuki sebep ve toplama yöntemi",
      "Kişisel verileriniz, internet sitemizdeki formlar aracılığıyla elektronik ortamda; KVKK m. 5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması) ve m. 5/2-f (meşru menfaat) hukuki sebeplerine dayanılarak toplanmaktadır.",
      "## Aktarım",
      "Verileriniz; barındırma, veritabanı ve e-posta bildirim hizmeti aldığımız tedarikçilerle, yalnızca hizmetin sunulması amacıyla ve gerekli güvenlik önlemleri alınarak paylaşılabilir. Bu hizmet sağlayıcıların sunucuları yurt dışında bulunabilir.",
      "## Haklarınız",
      "KVKK m. 11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme ve itiraz etme haklarına sahipsiniz. Başvurularınızı iletişim sayfasındaki e-posta adresimize iletebilirsiniz.",
    ].join("\n\n"),
  },

  genel: {
    ctaBand: {
      title: "Salmastranızın ölçüsünü bilmiyor musunuz?",
      text: "Pompa marka-modelini veya eski salmastranın ölçülerini paylaşın; muadilini belirleyip hızlıca teklif verelim.",
      primary: { label: "Teklif iste", href: "/teklif-al" },
      secondary: { label: "Bize ulaşın", href: "/iletisim" },
    },
    footerAbout: "Pompa, mikser ve döner ekipmanlar için mekanik salmastra, döner başlık ve sızdırmazlık ürünleri; seçim, tedarik ve revizyon hizmetleri.",
    megaMenu: { title: "Doğru salmastrayı birlikte seçelim", text: "Akışkan, basınç, sıcaklık ve mil çapını paylaşın; uygun tipi ve malzemeyi önerelim." },
    whatsapp: {
      enabled: true,
      label: "WhatsApp'tan yazın",
      message: "Merhaba, salmastra hakkında bilgi almak istiyorum.",
    },
  },
};

export const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT) as ContentKey[];
