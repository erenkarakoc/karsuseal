"use client";

import { useEffect, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/env";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;
function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile yüklenemedi"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile bot check (free). Renders nothing when no site key is configured.
 * `resetKey` changes after every submission so a fresh single-use token is issued.
 */
export function Turnstile({ resetKey }: { resetKey?: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widget.current = window.turnstile.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          language: "tr",
          theme: "auto",
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey === undefined || !widget.current || !window.turnstile) return;
    window.turnstile.reset(widget.current);
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return (
    <div>
      <div ref={box} />
      <input type="hidden" name="cf-turnstile-response" value={token} />
    </div>
  );
}
