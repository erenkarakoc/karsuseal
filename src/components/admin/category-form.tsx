"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { ExternalLink, LoaderCircle, Save, Trash } from "lucide-react";
import { deleteCategory, saveCategory, type ActionResult } from "@/app/admin/actions";
import { adminBtn, Card, ResultNote, selectCls } from "@/components/admin/ui";
import { ImageUploader, Thumb } from "@/components/admin/upload";
import { inputCls } from "@/components/site/forms";
import { ILLUSTRATIONS } from "@/lib/images";
import type { Category } from "@/lib/types";

export function CategoryForm({ category, parents }: { category?: Category; parents: Category[] }) {
  const [result, action, pending] = useActionState(saveCategory, null);
  const [deleteResult, setDeleteResult] = useState<ActionResult | null>(null);
  const [deleting, startDelete] = useTransition();
  const [image, setImage] = useState(category?.image_url ?? "");
  const [illustration, setIllustration] = useState(category?.illustration ?? "seal-multispring");

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <input type="hidden" name="image_url" value={image} />
      <Card className="space-y-4 p-5 sm:p-6 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">Kategori adı *</label>
            <input id="name" name="name" required defaultValue={category?.name} className={inputCls} />
          </div>
          <div>
            <label htmlFor="slug" className="mb-2 block text-sm font-medium text-foreground">URL</label>
            <input id="slug" name="slug" defaultValue={category?.slug} placeholder="otomatik" className={inputCls} />
          </div>
          <div>
            <label htmlFor="parent_id" className="mb-2 block text-sm font-medium text-foreground">Üst kategori</label>
            <select id="parent_id" name="parent_id" defaultValue={category?.parent_id ?? ""} className={selectCls}>
              <option value="">— Ana kategori —</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="summary" className="mb-2 block text-sm font-medium text-foreground">Kısa açıklama</label>
          <textarea id="summary" name="summary" rows={2} defaultValue={category?.summary ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">Detaylı açıklama</label>
          <textarea id="description" name="description" rows={5} defaultValue={category?.description ?? ""} className={inputCls} />
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-4 p-5">
          <label className="flex items-center justify-between text-sm text-foreground">Sitede yayında
            <input type="checkbox" name="is_published" defaultChecked={category?.is_published ?? true} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
          </label>
          <div>
            <label htmlFor="sort_order" className="mb-2 block text-sm font-medium text-foreground">Sıra</label>
            <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={category?.sort_order ?? 100} className={inputCls} />
          </div>
        </Card>
        <Card className="space-y-4 p-5">
          <p className="text-sm font-medium text-foreground">Kapak görseli</p>
          {image ? <Thumb src={image} onRemove={() => setImage("")} /> : <ImageUploader folder="categories" multiple={false} label="Kapak görseli yükle" onUploaded={([u]) => setImage(u)} />}
          <div>
            <label htmlFor="illustration" className="mb-2 block text-sm font-medium text-foreground">Standart çizim</label>
            <select id="illustration" name="illustration" value={illustration} onChange={(e) => setIllustration(e.target.value)} className={selectCls}>
              {ILLUSTRATIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            {!image && <div className="mt-2"><Thumb src={`/illustrations/${illustration}.svg`} /></div>}
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:col-span-3">
        <button disabled={pending} className={adminBtn.primary}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Kaydet</button>
        {category && (
          <>
            <Link href={`/urunler/${category.slug}`} target="_blank" className={adminBtn.secondary}><ExternalLink className="size-4" /> Sitede gör</Link>
            <button type="button" disabled={deleting} onClick={() => confirm("Kategori silinsin mi?") && startDelete(async () => setDeleteResult(await deleteCategory(category.id)))} className={adminBtn.danger}>
              <Trash className="size-4" /> Sil
            </button>
          </>
        )}
        <ResultNote result={deleteResult ?? result} />
      </div>
    </form>
  );
}
