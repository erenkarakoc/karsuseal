"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Product image swiper: arrows, touch/drag swipe, keyboard and thumbnails. */
export function ProductGallery({ images, alt, isIllustration }: { images: string[]; alt: string; isIllustration: boolean }) {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);
  const count = images.length;
  const go = (i: number) => setActive((i + count) % count);

  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || (e.target as HTMLElement).closest("button")) return;
    start.current = e.clientX;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (start.current !== null) setDrag(e.clientX - start.current);
  };
  const onPointerUp = () => {
    if (start.current === null) return;
    if (drag < -50) go(active + 1);
    else if (drag > 50) go(active - 1);
    start.current = null;
    setDragging(false);
    setDrag(0);
  };

  return (
    <div>
      <div
        className="group relative overflow-hidden rounded-2xl border border-card-line bg-white select-none touch-pan-y focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        tabIndex={count > 1 ? 0 : -1}
        role={count > 1 ? "region" : undefined}
        aria-roledescription={count > 1 ? "galeri" : undefined}
        aria-label={count > 1 ? `${alt} görselleri` : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={`flex ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
          style={{ transform: `translateX(calc(${-active * 100}% + ${drag}px))` }}
        >
          {images.map((src, i) => (
            <div key={src} className="w-full shrink-0" aria-hidden={i !== active}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={i === 0 ? alt : `${alt} — görsel ${i + 1}`} draggable={false} loading={i === 0 ? "eager" : "lazy"} className="aspect-[4/3] w-full object-contain" />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(active - 1)} aria-label="Önceki görsel" className="absolute start-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-card-line bg-white/90 text-[#0B1F3F] shadow-sm backdrop-blur opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 transition">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Sonraki görsel" className="absolute end-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-card-line bg-white/90 text-[#0B1F3F] shadow-sm backdrop-blur opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 transition">
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 end-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>

      {isIllustration && (
        <p className="mt-3 text-xs text-muted-foreground-1">Standart ürün çizimi; ölçü ve malzemeye göre ürün görünümü farklılık gösterebilir.</p>
      )}

      {count > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Görsel ${i + 1}`}
              aria-current={i === active}
              className={`overflow-hidden rounded-lg border-2 bg-white focus:outline-hidden ${i === active ? "border-primary" : "border-card-line hover:border-primary-300"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" loading="lazy" className="aspect-[4/3] w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
