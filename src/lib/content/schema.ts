// Field descriptors for the admin content editor. The editor is generic: it renders these
// descriptors against the JSON document of each page (see defaults.ts for the shapes).
import { HOME_SECTIONS, type ContentKey, type HomeSection } from "./defaults";

export type Field =
  | { type: "text"; key: string; label: string; hint?: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; hint?: string; rows?: number }
  | { type: "number"; key: string; label: string; min?: number; max?: number; hint?: string }
  | { type: "boolean"; key: string; label: string; hint?: string }
  | { type: "strings"; key: string; label: string; hint?: string }
  | { type: "link"; key: string; label: string; hint?: string }
  | { type: "icon"; key: string; label: string }
  | { type: "image"; key: string; label: string; hint?: string }
  | { type: "slug"; key: string; label: string; from: string; hint?: string }
  | { type: "categories"; key: string; label: string; hint?: string }
  | { type: "sections"; key: string; label: string; hint?: string }
  | { type: "group"; key: string; label: string; hint?: string; fields: Field[] }
  | { type: "list"; key: string; label: string; hint?: string; titleKey: string; itemName: string; fields: Field[]; newItem: Record<string, unknown> };

export const HOME_SECTION_LABELS: Record<HomeSection, string> = {
  categories: "Ürün grupları",
  featured: "Öne çıkan ürünler",
  industries: "Sektörler",
  services: "Hizmetler",
  process: "Çalışma adımları",
  cta: "Teklif çağrısı bandı",
};
export { HOME_SECTIONS };

const intro = (withDescription = true): Field => ({
  type: "group",
  key: "intro",
  label: "Sayfa başlığı",
  fields: [
    { type: "text", key: "eyebrow", label: "Üst etiket" },
    { type: "text", key: "title", label: "Başlık" },
    ...(withDescription ? [{ type: "textarea", key: "description", label: "Açıklama", rows: 2 } as Field] : []),
  ],
});

const RICH_HINT = "Boş satır yeni paragraf başlatır. \"## \" ile başlayan satır ara başlık, \"- \" ile başlayan satırlar madde listesi olur.";

export type PageSchema = { key: ContentKey; title: string; description: string; href: string; fields: Field[] };

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    key: "ana-sayfa",
    title: "Ana sayfa",
    description: "Giriş bölümü, bölümlerin sırası/görünürlüğü ve bölüm başlıkları",
    href: "/",
    fields: [
      { type: "sections", key: "order", label: "Bölümler", hint: "Giriş bölümü her zaman en üsttedir. Diğer bölümleri sıralayın veya gizleyin." },
      {
        type: "group",
        key: "hero",
        label: "Giriş bölümü (hero)",
        fields: [
          { type: "text", key: "titleStart", label: "Başlık — başı" },
          { type: "text", key: "titleHighlight", label: "Başlık — vurgulu kısım (mavi)" },
          { type: "text", key: "titleEnd", label: "Başlık — sonu", hint: "Noktalama işaretiyle başlıyorsa boşluk bırakmayın, ör. \", doğru zamanda.\"" },
          { type: "textarea", key: "description", label: "Açıklama", rows: 3 },
          { type: "link", key: "primary", label: "Birincil buton" },
          { type: "link", key: "secondary", label: "İkincil buton" },
          { type: "strings", key: "bullets", label: "Madde işaretleri", hint: "Her satıra bir madde" },
          { type: "image", key: "mainImage", label: "Ana görsel" },
          { type: "image", key: "sideImage1", label: "Sol alt küçük görsel" },
          { type: "image", key: "sideImage2", label: "Sağ üst küçük görsel" },
          { type: "text", key: "specTitle", label: "Bilgi kartı başlığı", hint: "Boş bırakılırsa kart gösterilmez" },
          { type: "text", key: "specText", label: "Bilgi kartı metni" },
        ],
      },
      {
        type: "group",
        key: "categories",
        label: "Ürün grupları bölümü",
        fields: [
          { type: "text", key: "eyebrow", label: "Üst etiket" },
          { type: "text", key: "title", label: "Başlık" },
          { type: "textarea", key: "description", label: "Açıklama", rows: 2 },
          { type: "text", key: "linkLabel", label: "Bağlantı metni", hint: "Boş bırakılırsa bağlantı gösterilmez" },
        ],
      },
      {
        type: "group",
        key: "featured",
        label: "Öne çıkan ürünler bölümü",
        hint: "Hangi ürünlerin görüneceği Ürünler sayfasındaki \"Öne çıkan\" anahtarıyla seçilir.",
        fields: [
          { type: "text", key: "eyebrow", label: "Üst etiket" },
          { type: "text", key: "title", label: "Başlık" },
          { type: "link", key: "link", label: "Bağlantı" },
          { type: "number", key: "limit", label: "Gösterilecek ürün sayısı", min: 1, max: 24 },
        ],
      },
      {
        type: "group",
        key: "industries",
        label: "Sektörler bölümü",
        hint: "Sektör kartları Sektörler sayfasının içeriğinden gelir.",
        fields: [
          { type: "text", key: "eyebrow", label: "Üst etiket" },
          { type: "text", key: "title", label: "Başlık" },
          { type: "textarea", key: "description", label: "Açıklama", rows: 2 },
          { type: "text", key: "linkLabel", label: "Bağlantı metni" },
        ],
      },
      {
        type: "group",
        key: "services",
        label: "Hizmetler bölümü",
        hint: "Hizmet kartları Hizmetler sayfasının içeriğinden gelir.",
        fields: [
          { type: "text", key: "eyebrow", label: "Üst etiket" },
          { type: "text", key: "title", label: "Başlık" },
          { type: "textarea", key: "description", label: "Açıklama", rows: 2 },
          { type: "text", key: "buttonLabel", label: "Buton metni" },
        ],
      },
      {
        type: "group",
        key: "process",
        label: "Çalışma adımları bölümü",
        fields: [
          { type: "list", key: "steps", label: "Adımlar", titleKey: "title", itemName: "adım", newItem: { title: "", text: "" }, fields: [
            { type: "text", key: "title", label: "Başlık" },
            { type: "textarea", key: "text", label: "Açıklama", rows: 2 },
          ] },
        ],
      },
    ],
  },
  {
    key: "sektorler",
    title: "Sektörler",
    description: "Sektör listesi, her sektörün sayfası, sorunları ve önerilen ürün grupları",
    href: "/sektorler",
    fields: [
      intro(),
      {
        type: "list",
        key: "items",
        label: "Sektörler",
        hint: "Menüde, ana sayfada ve ürün formundaki sektör listesinde bu sıra kullanılır.",
        titleKey: "name",
        itemName: "sektör",
        newItem: { slug: "", name: "", summary: "", icon: "factory", challenges: [], categories: [] },
        fields: [
          { type: "text", key: "name", label: "Sektör adı" },
          { type: "slug", key: "slug", label: "Sayfa adresi", from: "name", hint: "Değiştirirseniz bu sektöre bağlı ürünlerin sektör seçimi kaybolur." },
          { type: "icon", key: "icon", label: "İkon" },
          { type: "textarea", key: "summary", label: "Kısa açıklama", rows: 2 },
          { type: "strings", key: "challenges", label: "Sık karşılaşılan sorunlar", hint: "Her satıra bir madde" },
          { type: "categories", key: "categories", label: "Önerilen ürün grupları" },
        ],
      },
    ],
  },
  {
    key: "hizmetler",
    title: "Hizmetler",
    description: "Hizmet kartları ve ayrıntıları",
    href: "/hizmetler",
    fields: [
      intro(),
      {
        type: "list",
        key: "items",
        label: "Hizmetler",
        titleKey: "title",
        itemName: "hizmet",
        newItem: { slug: "", title: "", summary: "", icon: "wrench", details: [] },
        fields: [
          { type: "text", key: "title", label: "Hizmet adı" },
          { type: "slug", key: "slug", label: "Sayfa içi bağlantı adı", from: "title" },
          { type: "icon", key: "icon", label: "İkon" },
          { type: "textarea", key: "summary", label: "Kısa açıklama", rows: 2 },
          { type: "strings", key: "details", label: "Ayrıntılar", hint: "Her satıra bir madde" },
        ],
      },
    ],
  },
  {
    key: "kurumsal",
    title: "Kurumsal",
    description: "Hakkımızda metni, butonlar ve değer kartları",
    href: "/kurumsal",
    fields: [
      intro(false),
      { type: "textarea", key: "body", label: "Metin", rows: 12, hint: RICH_HINT },
      { type: "link", key: "primary", label: "Birincil buton" },
      { type: "link", key: "secondary", label: "İkincil buton" },
      { type: "list", key: "values", label: "Değer kartları", titleKey: "title", itemName: "kart", newItem: { icon: "badge-check", title: "", text: "" }, fields: [
        { type: "icon", key: "icon", label: "İkon" },
        { type: "text", key: "title", label: "Başlık" },
        { type: "textarea", key: "text", label: "Metin", rows: 2 },
      ] },
    ],
  },
  {
    key: "iletisim",
    title: "İletişim",
    description: "Sayfa başlığı ve form metinleri (iletişim bilgileri Ayarlar'dan)",
    href: "/iletisim",
    fields: [
      intro(),
      { type: "text", key: "formTitle", label: "Form başlığı" },
      { type: "textarea", key: "formNote", label: "Form notu", rows: 2 },
    ],
  },
  {
    key: "teklif-al",
    title: "Teklif al",
    description: "Sayfa başlığı ve yan bilgi kartları",
    href: "/teklif-al",
    fields: [
      intro(),
      { type: "list", key: "cards", label: "Yan bilgi kartları", titleKey: "title", itemName: "kart", newItem: { icon: "clock", title: "", text: "" }, fields: [
        { type: "icon", key: "icon", label: "İkon" },
        { type: "text", key: "title", label: "Başlık" },
        { type: "textarea", key: "text", label: "Metin", rows: 3 },
      ] },
    ],
  },
  {
    key: "kvkk",
    title: "KVKK aydınlatma metni",
    description: "Formlardaki onay kutusunun bağlandığı metin",
    href: "/kvkk",
    fields: [
      { type: "text", key: "title", label: "Başlık" },
      { type: "textarea", key: "body", label: "Metin", rows: 18, hint: RICH_HINT },
    ],
  },
  {
    key: "genel",
    title: "Genel",
    description: "Sayfa sonundaki teklif bandı, footer ve ürün menüsü metinleri",
    href: "/",
    fields: [
      {
        type: "group",
        key: "ctaBand",
        label: "Sayfa sonu teklif bandı",
        fields: [
          { type: "text", key: "title", label: "Başlık" },
          { type: "textarea", key: "text", label: "Metin", rows: 2 },
          { type: "link", key: "primary", label: "Birincil buton" },
          { type: "link", key: "secondary", label: "İkincil buton" },
        ],
      },
      { type: "textarea", key: "footerAbout", label: "Footer tanıtım metni", rows: 3 },
      {
        type: "group",
        key: "whatsapp",
        label: "WhatsApp butonu (sol altta sabit)",
        hint: "Numara Ayarlar sayfasındaki \"WhatsApp\" alanından girilir. Numara boşsa buton hiç gösterilmez.",
        fields: [
          { type: "boolean", key: "enabled", label: "Butonu göster" },
          { type: "text", key: "label", label: "Buton yazısı", hint: "Masaüstünde ikonun yanında görünür" },
          { type: "textarea", key: "message", label: "Hazır mesaj", rows: 2, hint: "WhatsApp açıldığında mesaj kutusuna önceden yazılır. Boş bırakılabilir." },
        ],
      },
      {
        type: "group",
        key: "megaMenu",
        label: "Ürünler menüsündeki kutu",
        fields: [
          { type: "text", key: "title", label: "Başlık" },
          { type: "textarea", key: "text", label: "Metin", rows: 2 },
        ],
      },
    ],
  },
];

export const schemaFor = (key: string) => PAGE_SCHEMAS.find((p) => p.key === key);
