// Statik site içeriği: sektörler ve hizmetler.

// ---------------------------------------------------------------------------
// Sektörler
// ---------------------------------------------------------------------------
export const industries = [
  { slug: "su-ve-atik-su", name: "Su ve Atık Su", summary: "Temiz su, atık su ve arıtma tesislerinde çalışan santrifüj, dalgıç ve çamur pompaları." },
  { slug: "kimya-ve-petrokimya", name: "Kimya ve Petrokimya", summary: "Agresif, toksik ve yüksek sıcaklıklı akışkanlar için dengeli, çift ve metal körüklü çözümler." },
  { slug: "gida-ve-icecek", name: "Gıda ve İçecek", summary: "Hijyenik pompalar, CIP/SIP hatları ve mikserler için FDA uyumlu malzemeler." },
  { slug: "ilac", name: "İlaç ve Kozmetik", summary: "Steril proseslerde reaktör ve mikser salmastraları, kuru çalışan tasarımlar." },
  { slug: "kagit-ve-seluloz", name: "Kâğıt ve Selüloz", summary: "Kurutma silindirleri için buhar başlıkları ve lifli akışkan pompaları için salmastralar." },
  { slug: "tekstil", name: "Tekstil", summary: "Boyama makineleri, ramöz ve kalenderler için salmastra ve kızgın yağ başlıkları." },
  { slug: "demir-celik", name: "Demir-Çelik", summary: "Sürekli döküm ve haddehane soğutma hatları için döner başlıklar ve dayanıklı salmastralar." },
  { slug: "enerji", name: "Enerji", summary: "Kazan besleme, kondensat ve soğutma suyu pompalarında yüksek basınç ve sıcaklık." },
  { slug: "denizcilik", name: "Denizcilik", summary: "Gemi pompaları, balast ve soğutma sistemleri için deniz suyuna dayanıklı malzemeler." },
  { slug: "seker", name: "Şeker ve Nişasta", summary: "Viskoz ve kristal içeren akışkanlar için korumalı yaylı ve çift salmastralar." },
];

/** Sektör sayfalarındaki tipik zorluklar ve önerilen ürün grupları */
export const industryDetails: Record<string, { challenges: string[]; categories: string[] }> = {
  "su-ve-atik-su": { challenges: ["Kum ve katı içeren akışkanlarda yüzey aşınması", "Dalgıç pompalarda kuru çalışma riski", "Uzun bakım aralıkları ve erişimi zor sahalar"], categories: ["elastomer-koruklu-salmastralar", "kartus-salmastralar", "oem-pompa-salmastralari", "yumusak-salmastralar"] },
  "kimya-ve-petrokimya": { challenges: ["Toksik ve yanıcı akışkanlarda sıfır emisyon", "Agresif ortamlarda elastomer ve metal seçimi", "Yüksek basınç ve sıcaklıkta kararlı çalışma"], categories: ["kartus-salmastralar", "metal-koruklu-salmastralar", "tampon-sivi-sistemleri", "o-ringler"] },
  "gida-ve-icecek": { challenges: ["Hijyenik tasarım ve FDA uyumlu malzemeler", "CIP/SIP temizlik kimyasalları ve sıcaklık şokları", "Şeker ve süt ürünlerinde yüzeye yapışma"], categories: ["oem-pompa-salmastralari", "mikser-salmastralari", "o-ringler", "ptfe-urunleri"] },
  ilac: { challenges: ["Steril ortam ve ürün kontaminasyonunun önlenmesi", "Reaktörlerde vakum ve basınç değişimleri", "Validasyon için izlenebilir malzeme"], categories: ["mikser-salmastralari", "kartus-salmastralar", "o-ringler"] },
  "kagit-ve-seluloz": { challenges: ["Lifli hamurun yay ve yüzeyleri tıkaması", "Kurutma silindirlerinde buhar ve kondens yönetimi", "Büyük çaplı pompalarda uzun duruş süreleri"], categories: ["buhar-basliklari", "kartus-salmastralar", "ozel-tip-salmastralar", "yumusak-salmastralar"] },
  tekstil: { challenges: ["Boya ve kimyasal banyolarında kristalleşme", "Ramöz ve kalenderlerde yüksek sıcaklık", "Sürekli çalışan makinelerde hızlı yedek parça"], categories: ["kizgin-yag-basliklari", "buhar-basliklari", "mekanik-salmastralar", "metal-koruklu-salmastralar"] },
  "demir-celik": { challenges: ["Yüksek sıcaklık ve tufal içeren soğutma suyu", "Sürekli döküm hatlarında döner bağlantılar", "Ağır hizmet ve darbeli yükler"], categories: ["su-basliklari", "hava-hidrolik-basliklari", "ozel-tip-salmastralar", "conta-ve-levhalar"] },
  enerji: { challenges: ["Kazan besleme pompalarında yüksek basınç", "Sıcak su ve kondensatta buharlaşma", "Planlı duruşlarda kısa revizyon süresi"], categories: ["o-ringli-salmastralar", "metal-koruklu-salmastralar", "conta-ve-levhalar", "yumusak-salmastralar"] },
  denizcilik: { challenges: ["Deniz suyu korozyonu", "Titreşim ve mil salgısı", "Limanda sınırlı bakım süresi"], categories: ["elastomer-koruklu-salmastralar", "o-ringli-salmastralar", "yumusak-salmastralar", "swivel-joint"] },
  seker: { challenges: ["Şurup ve melasta kristalleşme", "Viskoz akışkanlarda yüzey ısınması", "Kampanya döneminde kesintisiz çalışma"], categories: ["o-ringli-salmastralar", "kartus-salmastralar", "yumusak-salmastralar"] },
};

// Hizmetler (statik içerik)
export const services = [
  { slug: "salmastra-revizyonu", title: "Salmastra Tamiri ve Revizyonu", summary: "Arızalı mekanik salmastraları söküp inceliyor, aşınan yüzey ve contaları yenileyerek test edip garanti ile teslim ediyoruz.", icon: "wrench" },
  { slug: "lepleme-hizmeti", title: "Lepleme ve Yüzey Yenileme", summary: "Karbon, SiC ve TC yüzeyleri ışık bandı hassasiyetinde lepleyip optik düzlemle kontrol ediyoruz.", icon: "disc" },
  { slug: "olcuye-ozel-imalat", title: "Ölçüye Özel İmalat", summary: "Numune veya çizimden tersine mühendislik ile salmastra, burç ve yüzey imalatı yapıyoruz.", icon: "ruler" },
  { slug: "yerinde-servis", title: "Yerinde Teknik Destek", summary: "Montaj, devreye alma ve arıza analizini sahada yapıyor, kök neden raporu sunuyoruz.", icon: "map-pin" },
  { slug: "stok-tedarik", title: "Stok ve Hızlı Tedarik", summary: "Yaygın salmastra tipleri, O-ringler ve örgü salmastralar stoktan aynı gün sevk edilir.", icon: "package" },
  { slug: "urun-secimi", title: "Ürün Seçimi ve Danışmanlık", summary: "Akışkan, basınç, sıcaklık ve devir bilgilerinize göre doğru salmastra tipini ve malzemeyi seçiyoruz.", icon: "compass" },
];
