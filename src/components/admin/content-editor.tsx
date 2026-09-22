"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, ExternalLink, LoaderCircle, Plus, RotateCcw, Save, Trash } from "lucide-react";
import { resetContent, saveContent, type ActionResult } from "@/app/admin/actions";
import { adminBtn, Card, ResultNote, selectCls } from "@/components/admin/ui";
import { ImageUploader, Thumb } from "@/components/admin/upload";
import { ContentIcon } from "@/components/site/content-icon";
import { inputCls } from "@/components/site/forms";
import { ICON_OPTIONS } from "@/lib/content/icons";
import { HOME_SECTION_LABELS, HOME_SECTIONS, type Field, type PageSchema } from "@/lib/content/schema";
import { ILLUSTRATIONS } from "@/lib/images";
import { slugify } from "@/lib/slug";

type Json = Record<string, unknown>;
type CategoryOption = { slug: string; name: string; parent: string | null };
type Ctx = { categories: CategoryOption[] };

const move = <T,>(arr: T[], from: number, to: number) => {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** Drops empty lines from string lists before saving (they exist while typing). */
function clean(value: unknown): unknown {
  if (Array.isArray(value)) {
    const mapped = value.map(clean);
    return mapped.every((v) => typeof v === "string") ? (mapped as string[]).map((s) => s.trim()).filter(Boolean) : mapped;
  }
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]));
  return value;
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="block text-sm font-medium text-foreground">{children}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted-foreground-1">{hint}</span>}
    </div>
  );
}

function FieldEditor({ field, value, onChange, parent, ctx }: { field: Field; value: unknown; onChange: (v: unknown) => void; parent: Json; ctx: Ctx }) {
  switch (field.type) {
    case "text":
      return (
        <label className="block">
          <Label hint={field.hint}>{field.label}</Label>
          <input className={inputCls} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case "textarea":
      return (
        <label className="block">
          <Label hint={field.hint}>{field.label}</Label>
          <textarea className={inputCls} rows={field.rows ?? 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case "number":
      return (
        <label className="block max-w-40">
          <Label hint={field.hint}>{field.label}</Label>
          <input type="number" className={inputCls} min={field.min} max={field.max} value={Number(value ?? 0)} onChange={(e) => onChange(Math.min(field.max ?? Infinity, Math.max(field.min ?? -Infinity, Number(e.target.value) || 0)))} />
        </label>
      );
    case "strings": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      return (
        <label className="block">
          <Label hint={field.hint}>{field.label}</Label>
          <textarea className={inputCls} rows={Math.max(3, list.length + 1)} value={list.join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} />
        </label>
      );
    }
    case "link": {
      const link = (value ?? { label: "", href: "" }) as { label: string; href: string };
      return (
        <div>
          <Label hint={field.hint ?? "Metni boş bırakırsanız buton gösterilmez."}>{field.label}</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={inputCls} placeholder="Buton metni" value={link.label} onChange={(e) => onChange({ ...link, label: e.target.value })} />
            <input className={`${inputCls} font-mono`} placeholder="/teklif-al" value={link.href} onChange={(e) => onChange({ ...link, href: e.target.value })} />
          </div>
        </div>
      );
    }
    case "icon":
      return (
        <label className="block">
          <Label>{field.label}</Label>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
              <ContentIcon name={String(value ?? "")} className="size-5" />
            </span>
            <select className={selectCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
              {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </label>
      );
    case "image": {
      const src = String(value ?? "");
      return (
        <div>
          <Label hint={field.hint ?? "Fotoğraf yükleyin, standart çizimlerden birini seçin veya adres girin. Boş bırakılırsa gösterilmez."}>{field.label}</Label>
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
            {src ? <Thumb src={src} onRemove={() => onChange("")} /> : <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-line-3 text-xs text-muted-foreground-1">Görsel yok</div>}
            <div className="space-y-2">
              <select className={selectCls} value={src.startsWith("/illustrations/") ? src : ""} onChange={(e) => e.target.value && onChange(e.target.value)}>
                <option value="">Standart çizim seç…</option>
                {ILLUSTRATIONS.map((k) => <option key={k} value={`/illustrations/${k}.svg`}>{k}</option>)}
              </select>
              <input className={`${inputCls} font-mono text-xs`} placeholder="https://… veya /…" value={src} onChange={(e) => onChange(e.target.value)} />
              <ImageUploader folder="content" multiple={false} label="Fotoğraf yükle" onUploaded={([u]) => onChange(u)} />
            </div>
          </div>
        </div>
      );
    }
    case "slug": {
      const auto = slugify(String(parent[field.from] ?? ""));
      return (
        <label className="block">
          <Label hint={field.hint}>{field.label}</Label>
          <input className={`${inputCls} font-mono`} placeholder={auto || "otomatik"} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    }
    case "categories": {
      const selected = new Set(Array.isArray(value) ? (value as string[]) : []);
      const toggle = (slug: string, on: boolean) => onChange(ctx.categories.map((c) => c.slug).filter((s) => (s === slug ? on : selected.has(s))));
      const parents = ctx.categories.filter((c) => !c.parent);
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {parents.map((p) => (
              <div key={p.slug} className="py-1">
                <label className="flex items-center gap-x-2 text-sm font-medium text-foreground">
                  <input type="checkbox" checked={selected.has(p.slug)} onChange={(e) => toggle(p.slug, e.target.checked)} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
                  {p.name}
                </label>
                {ctx.categories.filter((c) => c.parent === p.slug).map((c) => (
                  <label key={c.slug} className="ms-6 mt-1 flex items-center gap-x-2 text-sm text-muted-foreground-2">
                    <input type="checkbox" checked={selected.has(c.slug)} onChange={(e) => toggle(c.slug, e.target.checked)} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
                    {c.name}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "sections": {
      const order = (Array.isArray(parent.order) ? parent.order : [...HOME_SECTIONS]) as string[];
      const hidden = new Set((Array.isArray(parent.hidden) ? parent.hidden : []) as string[]);
      const setBoth = (nextOrder: string[], nextHidden: Set<string>) => onChange({ __sections: true, order: nextOrder, hidden: [...nextHidden] });
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <ol className="divide-y divide-card-divider overflow-hidden rounded-lg border border-card-line">
            <li className="flex items-center gap-3 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground-1">Giriş bölümü (sabit)</li>
            {order.map((key, i) => {
              const isHidden = hidden.has(key);
              return (
                <li key={key} className="flex items-center gap-2 px-3 py-2">
                  <span className={`flex-1 text-sm ${isHidden ? "text-muted-foreground line-through" : "font-medium text-foreground"}`}>{HOME_SECTION_LABELS[key as keyof typeof HOME_SECTION_LABELS] ?? key}</span>
                  <button type="button" aria-label="Yukarı taşı" disabled={i === 0} onClick={() => setBoth(move(order, i, i - 1), hidden)} className="inline-flex size-8 items-center justify-center rounded-md border border-layer-line text-layer-foreground hover:bg-layer-hover disabled:opacity-40"><ArrowUp className="size-4" /></button>
                  <button type="button" aria-label="Aşağı taşı" disabled={i === order.length - 1} onClick={() => setBoth(move(order, i, i + 1), hidden)} className="inline-flex size-8 items-center justify-center rounded-md border border-layer-line text-layer-foreground hover:bg-layer-hover disabled:opacity-40"><ArrowDown className="size-4" /></button>
                  <button
                    type="button"
                    onClick={() => { const h = new Set(hidden); if (isHidden) h.delete(key); else h.add(key); setBoth(order, h); }}
                    className={`inline-flex h-8 items-center gap-x-1.5 rounded-md border px-2.5 text-xs font-medium ${isHidden ? "border-layer-line text-muted-foreground-1 hover:bg-layer-hover" : "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-200"}`}
                  >
                    {isHidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />} {isHidden ? "Gizli" : "Görünür"}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      );
    }
    case "group": {
      const obj = (value ?? {}) as Json;
      return (
        <fieldset className="rounded-xl border border-card-line p-4 sm:p-5">
          <legend className="px-1 font-display text-sm font-semibold text-foreground">{field.label}</legend>
          {field.hint && <p className="mb-3 text-xs text-muted-foreground-1">{field.hint}</p>}
          <div className="space-y-4">
            {field.fields.map((f) => (
              <FieldEditor key={f.key} field={f} value={obj[f.key]} parent={obj} ctx={ctx} onChange={(v) => onChange({ ...obj, [f.key]: v })} />
            ))}
          </div>
        </fieldset>
      );
    }
    case "list":
      return <ListEditor field={field} value={value} onChange={onChange} ctx={ctx} />;
  }
}

function ListEditor({ field, value, onChange, ctx }: { field: Extract<Field, { type: "list" }>; value: unknown; onChange: (v: unknown) => void; ctx: Ctx }) {
  const items = (Array.isArray(value) ? value : []) as Json[];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <Label hint={field.hint}>{field.label} <span className="font-normal text-muted-foreground-1">({items.length})</span></Label>
      <div className="divide-y divide-card-divider overflow-hidden rounded-xl border border-card-line">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 px-3 py-2">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex min-w-0 flex-1 items-center gap-x-2 text-start text-sm font-medium text-foreground" aria-expanded={open === i}>
                <ChevronDown className={`size-4 shrink-0 transition ${open === i ? "" : "-rotate-90"}`} />
                <span className="truncate">{String(item[field.titleKey] || `Yeni ${field.itemName}`)}</span>
              </button>
              <button type="button" aria-label="Yukarı taşı" disabled={i === 0} onClick={() => { onChange(move(items, i, i - 1)); setOpen(null); }} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground-1 hover:bg-layer-hover disabled:opacity-30"><ArrowUp className="size-4" /></button>
              <button type="button" aria-label="Aşağı taşı" disabled={i === items.length - 1} onClick={() => { onChange(move(items, i, i + 1)); setOpen(null); }} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground-1 hover:bg-layer-hover disabled:opacity-30"><ArrowDown className="size-4" /></button>
              <button type="button" aria-label="Sil" onClick={() => confirm(`Bu ${field.itemName} silinsin mi?`) && (onChange(items.filter((_, n) => n !== i)), setOpen(null))} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"><Trash className="size-4" /></button>
            </div>
            {open === i && (
              <div className="space-y-4 border-t border-card-divider bg-background-1 p-4">
                {field.fields.map((f) => (
                  <FieldEditor key={f.key} field={f} value={item[f.key]} parent={item} ctx={ctx} onChange={(v) => onChange(items.map((it, n) => (n === i ? { ...it, [f.key]: v } : it)))} />
                ))}
              </div>
            )}
          </div>
        ))}
        {!items.length && <p className="px-3 py-4 text-sm text-muted-foreground-1">Henüz kayıt yok.</p>}
      </div>
      <button type="button" onClick={() => { onChange([...items, structuredClone(field.newItem)]); setOpen(items.length); }} className="mt-2 inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline">
        <Plus className="size-4" /> {field.itemName.charAt(0).toLocaleUpperCase("tr") + field.itemName.slice(1)} ekle
      </button>
    </div>
  );
}

export function ContentEditor({ schema, initial, isCustomized, categories }: { schema: PageSchema; initial: Json; isCustomized: boolean; categories: CategoryOption[] }) {
  const router = useRouter();
  const [value, setValue] = useState<Json>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved]);
  const ctx = useMemo(() => ({ categories }), [categories]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (key: string, v: unknown) => {
    // the "sections" field edits two root keys at once
    if (v && typeof v === "object" && (v as Json).__sections) {
      const { order, hidden } = v as { order: string[]; hidden: string[] };
      setValue((cur) => ({ ...cur, order, hidden }));
    } else setValue((cur) => ({ ...cur, [key]: v }));
    setResult(null);
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const doc = clean(value) as Json;
          const res = await saveContent(schema.key, doc);
          setResult(res);
          if (res.ok) {
            setValue(doc);
            setSaved(JSON.stringify(doc));
            router.refresh();
          }
        });
      }}
    >
      <Card className="space-y-6 p-5 sm:p-6">
        {schema.fields.map((f) => (
          <FieldEditor key={f.key} field={f} value={value[f.key]} parent={value} ctx={ctx} onChange={(v) => set(f.key, v)} />
        ))}
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-card-line bg-background-1/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <button type="submit" disabled={pending || !dirty} className={adminBtn.primary}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Kaydet</button>
        <Link href={schema.href} target="_blank" className={adminBtn.secondary}><ExternalLink className="size-4" /> Sitede gör</Link>
        {isCustomized && (
          <button
            type="button"
            disabled={pending}
            onClick={() => confirm("Bu sayfadaki tüm değişiklikler silinip varsayılan metinlere dönülsün mü?") && start(async () => { const res = await resetContent(schema.key); setResult(res); if (res.ok) router.refresh(); })}
            className={adminBtn.secondary}
          >
            <RotateCcw className="size-4" /> Varsayılana dön
          </button>
        )}
        {dirty && !result && <span className="text-sm text-amber-600 dark:text-amber-400">Kaydedilmemiş değişiklikler var</span>}
        <ResultNote result={result} />
      </div>
    </form>
  );
}
