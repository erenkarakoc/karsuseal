"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { CircleCheck, LoaderCircle, Minus, Plus, Send, Trash, TriangleAlert } from "lucide-react";
import { submitContact, submitQuote, type FormState } from "@/app/actions/inquiry";
import { useQuoteCart } from "@/components/site/quote-cart";
import type { QuoteItem } from "@/lib/types";

export const inputCls =
  "py-2.5 sm:py-3 px-4 block w-full bg-layer border-layer-line rounded-lg sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none";

export function Field({ label, name, error, required, hint, children }: { label: string; name: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-xs text-red-600" id={`${name}-error`}>{error}</p>
      ) : hint ? (
        <p className="mt-2 text-xs text-muted-foreground-1">{hint}</p>
      ) : null}
    </div>
  );
}

function Input({ name, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; error?: string }) {
  return <input id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className={`${inputCls} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} {...rest} />;
}

/** Hidden honeypot field; bots tend to fill every input. */
function Honeypot() {
  return (
    <div className="hidden" aria-hidden>
      <label>Web sitesi <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

/** Wraps a form action so the submission carries the time the form was first shown. */
function useTimedAction(action: (fd: FormData) => void) {
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  return (fd: FormData) => {
    fd.set("t", String(shownAt.current));
    action(fd);
  };
}

function Consent({ error }: { error?: string }) {
  return (
    <div>
      <div className="flex gap-x-3">
        <input id="consent" name="consent" type="checkbox" className="mt-0.5 shrink-0 size-4 rounded-sm border-line-3 text-primary focus:ring-primary" />
        <label htmlFor="consent" className="text-sm text-muted-foreground-2">
          Kişisel verilerimin talebimin yanıtlanması amacıyla işlenmesine ilişkin <Link href="/kvkk" className="font-medium text-primary hover:underline">aydınlatma metnini</Link> okudum ve onaylıyorum.
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Alert({ state }: { state: FormState }) {
  if (!state?.message) return null;
  return state.ok ? (
    <div className="flex gap-x-3 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200" role="status">
      <CircleCheck className="size-5 shrink-0" /> {state.message}
    </div>
  ) : (
    <div className="flex gap-x-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">
      <TriangleAlert className="size-5 shrink-0" /> {state.message}
    </div>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button type="submit" disabled={pending} className="py-3 px-5 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-60 disabled:pointer-events-none">
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
      {pending ? "Gönderiliyor…" : label}
    </button>
  );
}

function ContactFields({ e, v }: { e: Record<string, string>; v: Record<string, string> }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Ad soyad" name="name" required error={e.name}><Input name="name" defaultValue={v.name} autoComplete="name" required error={e.name} /></Field>
      <Field label="Firma" name="company" error={e.company}><Input name="company" defaultValue={v.company} autoComplete="organization" error={e.company} /></Field>
      <Field label="E-posta" name="email" required error={e.email}><Input name="email" defaultValue={v.email} type="email" autoComplete="email" required error={e.email} /></Field>
      <Field label="Telefon" name="phone" error={e.phone}><Input name="phone" defaultValue={v.phone} type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" error={e.phone} /></Field>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, null);
  const action = useTimedAction(formAction);
  const e = state?.errors ?? {};
  const v = state?.values ?? {};
  if (state?.ok) return <Alert state={state} />;
  return (
    <form action={action} className="space-y-5" noValidate>
      <Honeypot />
      <Alert state={state} />
      <ContactFields e={e} v={v} />
      <Field label="Konu" name="subject" error={e.subject}><Input name="subject" defaultValue={v.subject} error={e.subject} /></Field>
      <Field label="Mesajınız" name="message" error={e.message}>
        <textarea id="message" name="message" rows={6} defaultValue={v.message} className={inputCls} />
      </Field>
      <Consent error={e.consent} />
      <SubmitButton pending={pending} label="Mesajı gönder" />
    </form>
  );
}

// ---------------------------------------------------------------------------
export function QuoteForm({ initialItem }: { initialItem?: Omit<QuoteItem, "quantity"> }) {
  const cart = useQuoteCart();
  const [state, formAction, pending] = useActionState(submitQuote, null);
  const action = useTimedAction(formAction);
  const e = state?.errors ?? {};
  const v = state?.values ?? {};

  // "Fiyat teklifi al" on a product page lands here with ?urun=…: put it in the list once.
  useEffect(() => {
    if (initialItem) cart.ensure(initialItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialItem?.code]);

  useEffect(() => {
    if (state?.ok) cart.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.ok]);

  if (state?.ok) {
    return (
      <div className="space-y-6">
        <Alert state={state} />
        <Link href="/urunler" className="inline-flex items-center gap-x-2 text-sm font-semibold text-primary hover:underline">Kataloğa dön</Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-8" noValidate>
      <Honeypot />
      <input type="hidden" name="items" value={JSON.stringify(cart.items)} />
      <Alert state={state} />

      <fieldset>
        <legend className="font-display text-lg font-semibold text-foreground">1. Ürünler</legend>
        {cart.items.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-line-3 p-6 text-sm text-muted-foreground-1">
            Teklif listeniz boş. <Link href="/urunler" className="font-semibold text-primary hover:underline">Katalogdan ürün ekleyin</Link> veya ihtiyacınızı aşağıdaki mesaj alanında açıklayın.
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-card-divider overflow-hidden rounded-xl border border-card-line bg-card">
            {cart.items.map((item) => (
              <li key={item.code} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image || "/illustrations/seal-multispring.svg"} alt="" className="size-14 shrink-0 rounded-lg border border-card-line object-cover bg-[#eef2f7]" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-primary">{item.code}</p>
                    <p className="truncate text-sm font-medium text-foreground">{item.name.replace(`${item.code} `, "")}</p>
                    <input
                      aria-label={`${item.code} için not`}
                      placeholder="Not: ölçü, malzeme, pompa modeli…"
                      defaultValue={item.note}
                      onBlur={(ev) => cart.update(item.code, { note: ev.target.value })}
                      className="mt-1.5 w-full border-0 border-b border-transparent bg-transparent p-0 text-xs text-muted-foreground-2 placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="inline-flex items-center rounded-lg border border-layer-line bg-layer">
                    <button type="button" aria-label="Azalt" onClick={() => cart.update(item.code, { quantity: Math.max(1, item.quantity - 1) })} className="size-9 inline-flex items-center justify-center text-layer-foreground hover:bg-layer-hover rounded-s-lg"><Minus className="size-3.5" /></button>
                    <input
                      aria-label="Adet"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(ev) => cart.update(item.code, { quantity: Math.max(1, Number(ev.target.value) || 1) })}
                      className="w-14 border-0 bg-transparent p-0 text-center text-sm text-foreground focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button type="button" aria-label="Artır" onClick={() => cart.update(item.code, { quantity: item.quantity + 1 })} className="size-9 inline-flex items-center justify-center text-layer-foreground hover:bg-layer-hover rounded-e-lg"><Plus className="size-3.5" /></button>
                  </div>
                  <button type="button" aria-label={`${item.code} ürününü kaldır`} onClick={() => cart.remove(item.code)} className="size-9 inline-flex items-center justify-center rounded-lg text-muted-foreground-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40">
                    <Trash className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-semibold text-foreground">2. Çalışma koşulları <span className="text-sm font-normal text-muted-foreground-1">(biliniyorsa)</span></legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Akışkan" name="medium"><Input name="medium" defaultValue={v.medium} placeholder="Örn. %30 NaOH, deniz suyu" /></Field>
          <Field label="Sıcaklık" name="temperature"><Input name="temperature" defaultValue={v.temperature} placeholder="Örn. 80 °C" /></Field>
          <Field label="Basınç" name="pressure"><Input name="pressure" defaultValue={v.pressure} placeholder="Örn. 6 bar" /></Field>
          <Field label="Devir" name="speed"><Input name="speed" defaultValue={v.speed} placeholder="Örn. 2900 d/d" /></Field>
          <Field label="Mil çapı" name="shaft"><Input name="shaft" defaultValue={v.shaft} placeholder="Örn. 35 mm" /></Field>
          <Field label="Pompa / ekipman" name="equipment"><Input name="equipment" defaultValue={v.equipment} placeholder="Marka ve model" /></Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-semibold text-foreground">3. İletişim bilgileri</legend>
        <div className="mt-4 space-y-5">
          <ContactFields e={e} v={v} />
          <Field label="Şehir" name="city"><Input name="city" defaultValue={v.city} autoComplete="address-level1" /></Field>
          <Field label="Ek açıklama" name="message" error={e.message}>
            <textarea id="message" name="message" rows={4} defaultValue={v.message} className={inputCls} placeholder="Adet, teslim süresi, eski salmastranın ölçüleri veya varsa etiket bilgileri…" />
          </Field>
        </div>
      </fieldset>

      <Consent error={e.consent} />
      <SubmitButton pending={pending} label="Teklif talebini gönder" />
    </form>
  );
}
