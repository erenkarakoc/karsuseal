"use client";

import { useActionState, useTransition } from "react";
import { LoaderCircle, Trash } from "lucide-react";
import { deleteInquiry, updateInquiry } from "@/app/admin/actions";
import { adminBtn, Card, ResultNote, selectCls, STATUS_LABEL } from "@/components/admin/ui";
import { inputCls } from "@/components/site/forms";
import type { InquiryStatus } from "@/lib/types";

export function InquiryEditor({ id, status, notes }: { id: string; status: InquiryStatus; notes: string | null }) {
  const [result, action, pending] = useActionState(updateInquiry.bind(null, id), null);
  const [deleting, startDelete] = useTransition();

  return (
    <Card className="p-5">
      <h2 className="font-display font-semibold text-foreground">Takip</h2>
      <form action={action} className="mt-4 space-y-4">
        <div className="max-w-xs">
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-foreground">Durum</label>
          <select id="status" name="status" defaultValue={status} className={selectCls}>
            {(Object.keys(STATUS_LABEL) as InquiryStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="admin_notes" className="mb-2 block text-sm font-medium text-foreground">İç notlar</label>
          <textarea id="admin_notes" name="admin_notes" rows={4} defaultValue={notes ?? ""} className={inputCls} placeholder="Verilen teklif, görüşme notları…" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={pending} className={adminBtn.primary}>{pending && <LoaderCircle className="size-4 animate-spin" />} Kaydet</button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => confirm("Bu talep kalıcı olarak silinsin mi?") && startDelete(() => deleteInquiry(id))}
            className={adminBtn.danger}
          >
            <Trash className="size-4" /> Sil
          </button>
          <ResultNote result={result} />
        </div>
      </form>
    </Card>
  );
}
