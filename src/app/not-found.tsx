import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo variant="icon" className="size-16" />
      <div>
        <p className="font-mono text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">Sayfa bulunamadı</h1>
        <p className="mt-2 text-muted-foreground-2">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className="py-2.5 px-4 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover">Ana sayfa</Link>
        <Link href="/urunler" className="py-2.5 px-4 rounded-lg border border-layer-line bg-layer text-sm font-semibold text-layer-foreground hover:bg-layer-hover">Ürün kataloğu</Link>
      </div>
    </main>
  );
}
