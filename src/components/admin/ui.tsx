import type { InquiryKind, InquiryStatus } from "@/lib/types";

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "Yeni",
  in_progress: "İşlemde",
  answered: "Yanıtlandı",
  closed: "Kapandı",
  spam: "Spam",
};

const STATUS_CLS: Record<InquiryStatus, string> = {
  new: "bg-primary-100 text-primary-800 dark:bg-primary-900/60 dark:text-primary-200",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  answered: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200",
  closed: "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300",
  spam: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLS[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function KindBadge({ kind }: { kind: InquiryKind }) {
  return kind === "quote" ? (
    <span className="inline-flex items-center rounded-md border border-primary-200 px-2 py-0.5 text-xs font-medium text-primary-700 dark:border-primary-800 dark:text-primary-300">Teklif</span>
  ) : (
    <span className="inline-flex items-center rounded-md border border-line-3 px-2 py-0.5 text-xs font-medium text-muted-foreground-2">İletişim</span>
  );
}

const dtf = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" });
export const formatDate = (iso: string) => dtf.format(new Date(iso));

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-card-line bg-card shadow-2xs ${className}`}>{children}</div>;
}

export const adminBtn = {
  primary: "py-2 px-3.5 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-50 disabled:pointer-events-none",
  secondary: "py-2 px-3.5 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-layer-line bg-layer text-layer-foreground shadow-2xs hover:bg-layer-hover focus:outline-hidden focus:bg-layer-focus disabled:opacity-50 disabled:pointer-events-none",
  danger: "py-2 px-3.5 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus:outline-hidden disabled:opacity-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
};

export const selectCls =
  "py-2 ps-3 pe-9 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground focus:border-primary-focus focus:ring-primary-focus";

export function ResultNote({ result }: { result: { ok: boolean; message?: string } | null }) {
  if (!result?.message) return null;
  return <p className={`text-sm ${result.ok ? "text-teal-700 dark:text-teal-300" : "text-red-600"}`} role="status">{result.message}</p>;
}
