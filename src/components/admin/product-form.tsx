"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, LoaderCircle, Plus, Save, Star, Trash, X } from "lucide-react";
import { deleteProduct, saveProduct, type ProductInput } from "@/app/admin/actions";
import { adminBtn, Card, ResultNote, selectCls } from "@/components/admin/ui";
import { FileUploadButton, ImageUploader, Thumb } from "@/components/admin/upload";
import { inputCls } from "@/components/site/forms";
import { ILLUSTRATIONS } from "@/lib/images";
import { slugify } from "@/lib/slug";
import type { Category, MaterialGroup, Product, Spec } from "@/lib/types";

type Props = { product?: Product; categories: Category[]; industries: { slug: string; name: string }[] };

const toText = (a: string[]) => a.join("\n");
const move = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
const fromText = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground-1">{description}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground">{children}</label>;
}

export function ProductForm({ product, categories, industries }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);

  const [code, setCode] = useState(product?.code ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [summary, setSummary] = useState(product?.summary ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [specs, setSpecs] = useState<Spec[]>(product?.specs ?? [{ label: "Mil çapı (d1)", value: "" }, { label: "Basınç (p1)", value: "" }, { label: "Sıcaklık (t)", value: "" }, { label: "Kayma hızı (vg)", value: "" }]);
  const [materials, setMaterials] = useState<MaterialGroup[]>(product?.materials ?? []);
  const [features, setFeatures] = useState(toText(product?.features ?? []));
  const [applications, setApplications] = useState(toText(product?.applications ?? []));
  const [standards, setStandards] = useState(toText(product?.standards ?? []));
  const [equivalents, setEquivalents] = useState(toText(product?.equivalents ?? []));
  const [inds, setInds] = useState<string[]>(product?.industries ?? []);
  const [illustration, setIllustration] = useState(product?.illustration ?? "seal-multispring");
  const [images, setImages] = useState<string[]>([...(product?.image_url ? [product.image_url] : []), ...(product?.gallery ?? [])]);
  const [datasheet, setDatasheet] = useState(product?.datasheet_url ?? "");
  const [published, setPublished] = useState(product?.is_published ?? true);
  const [featured, setFeatured] = useState(product?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(product?.sort_order ?? 1000);

  const parents = categories.filter((c) => !c.parent_id);
  const folder = `products/${slugify(code) || "yeni"}`;

  function submit() {
    const input: ProductInput = {
      id: product?.id ?? "",
      category_id: categoryId,
      code, name, slug: slug || slugify(code),
      summary, description,
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      materials: materials.filter((m) => m.part.trim() && m.options.length),
      features: fromText(features), applications: fromText(applications), standards: fromText(standards), equivalents: fromText(equivalents),
      industries: inds, illustration, image_url: images[0] ?? "", gallery: images.slice(1), datasheet_url: datasheet,
      is_published: published, is_featured: featured, sort_order: sortOrder,
    };
    start(async () => {
      const res = await saveProduct(input);
      setResult(res);
      if (res.ok && !product && res.id) router.replace(`/admin/urunler/${res.id}`);
      else if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Temel bilgiler">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="code">Ürün kodu *</Label>
                <input id="code" value={code} onChange={(e) => setCode(e.target.value)} required className={`${inputCls} font-mono`} placeholder="KS-M7" />
              </div>
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={selectCls}>
                  <option value="">Seçin</option>
                  {parents.map((p) => (
                    <optgroup key={p.id} label={p.name}>
                      <option value={p.id}>{p.name}</option>
                      {categories.filter((c) => c.parent_id === p.id).map((c) => <option key={c.id} value={c.id}>— {c.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="name">Ürün adı *</Label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="KS-M7 Çok Yaylı Salmastra (EN 12756)" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="slug">URL</Label>
                <div className="flex rounded-lg">
                  <span className="inline-flex items-center rounded-s-lg border border-e-0 border-layer-line bg-muted px-3 text-sm text-muted-foreground-1">/urun/</span>
                  <input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(code) || "otomatik"} className={`${inputCls} rounded-s-none`} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="summary">Kısa açıklama</Label>
                <textarea id="summary" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={400} className={inputCls} placeholder="Kartlarda ve arama sonuçlarında görünen tek cümlelik özet" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Detaylı açıklama</Label>
                <textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Paragrafları boş satırla ayırın" />
              </div>
            </div>
          </Section>

          <Section title="Görseller" description="Birden fazla fotoğraf ekleyebilirsiniz. İlk görsel ana görseldir; fotoğraf yoksa standart çizim gösterilir.">
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((src, i) => (
                  <div key={src} className="group relative">
                    <Thumb src={src} onRemove={() => setImages(images.filter((x) => x !== src))} />
                    {i === 0 && <span className="absolute start-1.5 top-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">Ana görsel</span>}
                    <div className="mt-1.5 flex items-center justify-between gap-1">
                      <div className="flex gap-1">
                        <button type="button" disabled={i === 0} onClick={() => setImages(move(images, i, i - 1))} aria-label="Sola taşı" className="inline-flex size-7 items-center justify-center rounded-md border border-layer-line text-layer-foreground hover:bg-layer-hover disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                        <button type="button" disabled={i === images.length - 1} onClick={() => setImages(move(images, i, i + 1))} aria-label="Sağa taşı" className="inline-flex size-7 items-center justify-center rounded-md border border-layer-line text-layer-foreground hover:bg-layer-hover disabled:opacity-40"><ChevronRight className="size-4" /></button>
                      </div>
                      {i > 0 && (
                        <button type="button" onClick={() => setImages(move(images, i, 0))} className="inline-flex items-center gap-x-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-primary hover:bg-primary-50 dark:hover:bg-primary-950/40">
                          <Star className="size-3.5" /> Ana görsel yap
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ImageUploader folder={folder} onUploaded={(urls) => setImages([...images, ...urls])} label={images.length ? "Fotoğraf ekle" : "Fotoğraf yükle"} />
          </Section>

          <Section title="Teknik özellikler" description="Ürün sayfasındaki tabloda gösterilir; ilk dört satır özet kartlarında yer alır.">
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
                  <input aria-label="Özellik" value={s.label} onChange={(e) => setSpecs(specs.map((x, n) => (n === i ? { ...x, label: e.target.value } : x)))} className={inputCls} placeholder="Özellik" />
                  <input aria-label="Değer" value={s.value} onChange={(e) => setSpecs(specs.map((x, n) => (n === i ? { ...x, value: e.target.value } : x)))} className={inputCls} placeholder="Değer" />
                  <button type="button" aria-label="Satırı sil" onClick={() => setSpecs(specs.filter((_, n) => n !== i))} className="size-11 inline-flex items-center justify-center rounded-lg text-muted-foreground-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"><X className="size-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setSpecs([...specs, { label: "", value: "" }])} className="mt-1 inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline"><Plus className="size-4" /> Satır ekle</button>
            </div>
          </Section>

          <Section title="Malzemeler" description="Her parça için seçenekleri virgülle ayırın.">
            <div className="space-y-2">
              {materials.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.6fr_auto] gap-2">
                  <input aria-label="Parça" value={m.part} onChange={(e) => setMaterials(materials.map((x, n) => (n === i ? { ...x, part: e.target.value } : x)))} className={inputCls} placeholder="Dönen yüzey" />
                  <input aria-label="Seçenekler" defaultValue={m.options.join(", ")} onBlur={(e) => setMaterials(materials.map((x, n) => (n === i ? { ...x, options: e.target.value.split(",").map((o) => o.trim()).filter(Boolean) } : x)))} className={inputCls} placeholder="Karbon, SiC, TC" />
                  <button type="button" aria-label="Satırı sil" onClick={() => setMaterials(materials.filter((_, n) => n !== i))} className="size-11 inline-flex items-center justify-center rounded-lg text-muted-foreground-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"><X className="size-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setMaterials([...materials, { part: "", options: [] }])} className="mt-1 inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline"><Plus className="size-4" /> Parça ekle</button>
            </div>
          </Section>

          <Section title="Listeler" description="Her satıra bir madde yazın.">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["features", "Özellikler", features, setFeatures],
                ["applications", "Uygulama alanları", applications, setApplications],
                ["standards", "Standartlar", standards, setStandards],
                ["equivalents", "Muadil tipler", equivalents, setEquivalents],
              ].map(([id, label, value, set]) => (
                <div key={id as string}>
                  <Label htmlFor={id as string}>{label as string}</Label>
                  <textarea id={id as string} rows={5} value={value as string} onChange={(e) => (set as (v: string) => void)(e.target.value)} className={inputCls} />
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Yayın">
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 text-sm text-foreground">Sitede yayında
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm text-foreground">Ana sayfada öne çıkar
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
              </label>
              <div>
                <Label htmlFor="sort">Sıra</Label>
                <input id="sort" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} />
              </div>
            </div>
          </Section>

          <Section title="Standart çizim ve teknik föy">
            <div className="space-y-4">
              <div>
                <Label htmlFor="illustration">Standart çizim {images.length > 0 && <span className="font-normal text-muted-foreground-1">(fotoğraf yoksa)</span>}</Label>
                <select id="illustration" value={illustration} onChange={(e) => setIllustration(e.target.value)} className={selectCls}>
                  {ILLUSTRATIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="mt-2"><Thumb src={`/illustrations/${illustration}.svg`} /></div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Teknik föy (PDF)</p>
                {datasheet ? (
                  <div className="flex items-center gap-2 text-sm">
                    <a href={datasheet} target="_blank" rel="noreferrer" className="inline-flex items-center gap-x-1.5 text-primary hover:underline"><FileText className="size-4" /> Dosyayı aç</a>
                    <button type="button" onClick={() => setDatasheet("")} className="text-muted-foreground-1 hover:text-red-600">Kaldır</button>
                  </div>
                ) : (
                  <FileUploadButton folder={`datasheets/${slugify(code) || "yeni"}`} accept="application/pdf" label="PDF yükle" onUploaded={setDatasheet} />
                )}
              </div>
            </div>
          </Section>

          <Section title="Sektörler">
            <div className="space-y-2">
              {industries.map((i) => (
                <label key={i.slug} className="flex items-center gap-x-2 text-sm text-foreground">
                  <input type="checkbox" checked={inds.includes(i.slug)} onChange={(e) => setInds(e.target.checked ? [...inds, i.slug] : inds.filter((x) => x !== i.slug))} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
                  {i.name}
                </label>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-card-line bg-background-1/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <button type="submit" disabled={pending} className={adminBtn.primary}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Kaydet</button>
        {product && (
          <>
            <Link href={`/urun/${product.slug}`} target="_blank" className={adminBtn.secondary}><ExternalLink className="size-4" /> Sitede gör</Link>
            <button type="button" disabled={pending} onClick={() => confirm("Ürün kalıcı olarak silinsin mi?") && start(() => deleteProduct(product.id))} className={adminBtn.danger}><Trash className="size-4" /> Sil</button>
          </>
        )}
        <ResultNote result={result} />
      </div>
    </form>
  );
}
