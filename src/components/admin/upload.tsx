"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { canStandardize, imageSize, standardizeImage, type FitMode, type StandardizedImage } from "@/lib/standardize-image";

const MAX = 5 * 1024 * 1024;
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/** Uploads to the public `catalog` bucket and returns the public URL. */
export async function uploadToCatalog(file: Blob, folder: string, fileName: string) {
  if (file.size > MAX) throw new Error(`${fileName}: dosya 5 MB'tan büyük olamaz`);
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const base = slugify(fileName.replace(/\.[^.]+$/, "")).slice(0, 40) || "dosya";
  const path = `${folder}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}-${base}.${ext}`;
  const supabase = getBrowserClient();
  const { error } = await supabase.storage.from("catalog").upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return supabase.storage.from("catalog").getPublicUrl(path).data.publicUrl;
}

/** Plain file upload (e.g. PDF datasheets). */
export function FileUploadButton({ folder, accept, label, onUploaded }: { folder: string; accept: string; label: string; onUploaded: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          setError(undefined);
          try {
            onUploaded(await uploadToCatalog(file, folder, file.name));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Yükleme başarısız");
          } finally {
            setBusy(false);
          }
        }}
      />
      <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-dashed border-line-3 text-muted-foreground-2 hover:border-primary hover:text-primary disabled:opacity-50">
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} {label}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image uploader with optional standardisation (original vs. standard preview)
// ---------------------------------------------------------------------------
type Item = {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: { width: number; height: number } | null;
  supported: boolean;
  trim: boolean;
  fit: FitMode;
  std: StandardizedImage | null;
  processing: boolean;
  choice: "standard" | "original";
};

export function ImageUploader({ folder, multiple = true, label = "Fotoğraf yükle", onUploaded }: {
  folder: string;
  multiple?: boolean;
  label?: string;
  onUploaded: (urls: string[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [defaultStandard, setDefaultStandard] = useState(true);

  // free object URLs when items go away
  const urls = useRef(new Set<string>());
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);
  const track = (u: string) => (urls.current.add(u), u);

  const patch = (id: string, p: Partial<Item>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  async function process(item: Item, opts?: Partial<Pick<Item, "trim" | "fit">>) {
    const next = { ...item, ...opts };
    if (!next.supported) return;
    patch(item.id, { ...opts, processing: true });
    try {
      const std = await standardizeImage(next.file, { trim: next.trim, fit: next.fit });
      track(std.url);
      patch(item.id, { std, processing: false });
    } catch {
      patch(item.id, { std: null, processing: false, choice: "original" });
    }
  }

  async function onFiles(list: FileList | null) {
    const files = [...(list ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setError(undefined);
    const created: Item[] = await Promise.all(
      files.map(async (file) => {
        const supported = canStandardize(file);
        return {
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          originalUrl: track(URL.createObjectURL(file)),
          originalSize: await imageSize(file),
          supported,
          trim: true,
          fit: "auto" as FitMode,
          std: null,
          processing: supported,
          choice: supported && defaultStandard ? ("standard" as const) : ("original" as const),
        };
      }),
    );
    setItems((prev) => (multiple ? [...prev, ...created] : created.slice(0, 1)));
    for (const it of created) void process(it);
  }

  async function uploadAll() {
    setUploading(true);
    setError(undefined);
    try {
      const out: string[] = [];
      for (const it of items) {
        const useStd = it.choice === "standard" && it.std;
        const base = it.file.name.replace(/\.[^.]+$/, "");
        const blob = useStd ? it.std!.blob : it.file;
        const name = useStd ? `${base}-std.${it.std!.blob.type === "image/webp" ? "webp" : "jpg"}` : it.file.name;
        out.push(await uploadToCatalog(blob, folder, name));
      }
      onUploaded(out);
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  const busy = items.some((i) => i.processing);

  return (
    <div className="space-y-3">
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" multiple={multiple} className="hidden" onChange={(e) => { void onFiles(e.target.files); e.target.value = ""; }} />

      {items.length === 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); void onFiles(e.dataTransfer.files); }}
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-dashed border-line-3 text-muted-foreground-2 hover:border-primary hover:text-primary"
          >
            <ImagePlus className="size-4" /> {label}
          </button>
          <label className="inline-flex items-center gap-x-2 text-xs text-muted-foreground-2">
            <input type="checkbox" checked={defaultStandard} onChange={(e) => setDefaultStandard(e.target.checked)} className="size-3.5 rounded-sm border-line-3 text-primary focus:ring-primary" />
            Standartlaştırılmış sürümü öner (1600×1200, beyaz zemin)
          </label>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-card-line bg-background-1 p-3">
          {items.map((it) => (
            <div key={it.id} className="rounded-lg border border-card-line bg-card p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground" title={it.file.name}>{it.file.name}</p>
                <button type="button" aria-label="Listeden çıkar" onClick={() => setItems((l) => l.filter((x) => x.id !== it.id))} className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground-1 hover:bg-muted-hover">
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Original */}
                <button type="button" onClick={() => patch(it.id, { choice: "original" })} className={`overflow-hidden rounded-lg border-2 text-start ${it.choice === "original" ? "border-primary" : "border-card-line hover:border-primary-300"}`} aria-pressed={it.choice === "original"}>
                  <div className="bg-[repeating-conic-gradient(#e5e7eb_0_25%,#fff_0_50%)] bg-[length:16px_16px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.originalUrl} alt="Orijinal" className="aspect-[4/3] w-full object-contain" />
                  </div>
                  <p className="px-2 py-1.5 text-[11px] text-muted-foreground-2">
                    <span className="font-semibold text-foreground">Orijinal</span>
                    {it.originalSize && ` · ${it.originalSize.width}×${it.originalSize.height}`} · {kb(it.file.size)}
                  </p>
                </button>

                {/* Standardised */}
                <button type="button" disabled={!it.supported || !it.std} onClick={() => patch(it.id, { choice: "standard" })} className={`overflow-hidden rounded-lg border-2 text-start disabled:opacity-60 ${it.choice === "standard" ? "border-primary" : "border-card-line hover:border-primary-300"}`} aria-pressed={it.choice === "standard"}>
                  <div className="relative bg-white">
                    {it.std ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.std.url} alt="Standart" className="aspect-[4/3] w-full object-contain" />
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center text-xs text-muted-foreground-1">
                        {it.processing ? <LoaderCircle className="size-5 animate-spin" /> : "Bu dosya türü standartlaştırılamaz"}
                      </div>
                    )}
                    {it.processing && it.std && <LoaderCircle className="absolute end-2 top-2 size-4 animate-spin text-primary" />}
                  </div>
                  <p className="px-2 py-1.5 text-[11px] text-muted-foreground-2">
                    <span className="font-semibold text-foreground">Standart</span>
                    {it.std && ` · 1600×1200 · ${kb(it.std.blob.size)} · ${it.std.mode === "cover" ? "kırpıldı" : "ortalandı"}`}
                  </p>
                </button>
              </div>

              {it.supported && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground-2">
                  <label className="inline-flex items-center gap-x-1.5">
                    <input type="checkbox" checked={it.trim} onChange={(e) => void process(it, { trim: e.target.checked })} className="size-3.5 rounded-sm border-line-3 text-primary focus:ring-primary" />
                    Kenar boşluklarını kırp
                  </label>
                  <label className="inline-flex items-center gap-x-1.5">
                    Yerleşim
                    <select value={it.fit} onChange={(e) => void process(it, { fit: e.target.value as FitMode })} className="py-1 ps-2 pe-7 rounded-md border-layer-line bg-layer text-xs text-foreground focus:border-primary-focus focus:ring-primary-focus">
                      <option value="auto">Otomatik</option>
                      <option value="contain">Ortala (tamamı görünsün)</option>
                      <option value="cover">4:3 kırp (alanı doldur)</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled={uploading || busy} onClick={uploadAll} className="py-2 px-3.5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
              {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} {items.length > 1 ? `${items.length} görseli yükle` : "Yükle"}
            </button>
            {multiple && (
              <button type="button" disabled={uploading} onClick={() => ref.current?.click()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-layer-line bg-layer text-layer-foreground hover:bg-layer-hover">
                <ImagePlus className="size-4" /> Dosya ekle
              </button>
            )}
            <button type="button" disabled={uploading} onClick={() => setItems([])} className="py-2 px-3 text-sm font-medium text-muted-foreground-1 hover:text-foreground">Vazgeç</button>
            <p className="text-xs text-muted-foreground-1">Her görsel için yüklenecek sürüme tıklayın.</p>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

export function Thumb({ src, onRemove }: { src: string; onRemove?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-card-line bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="aspect-[4/3] w-full object-contain" />
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Kaldır" className="absolute end-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
