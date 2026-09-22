import { DROP_PATH, RING_PATH, WORDMARK } from "./logo-paths";

type Props = {
  className?: string;
  /** "auto" follows the site theme (navy on light, white on dark). */
  tone?: "auto" | "light" | "dark" | "mono";
  variant?: "horizontal" | "icon";
  title?: string;
};

const TONES = {
  auto: { ring: "fill-[#0B1F3F] dark:fill-white", drop: "fill-[#1D5FD1] dark:fill-[#5B97F7]", karsu: "fill-[#0B1F3F] dark:fill-white", seal: "fill-[#1D5FD1] dark:fill-[#5B97F7]" },
  light: { ring: "fill-[#0B1F3F]", drop: "fill-[#1D5FD1]", karsu: "fill-[#0B1F3F]", seal: "fill-[#1D5FD1]" },
  dark: { ring: "fill-white", drop: "fill-[#5B97F7]", karsu: "fill-white", seal: "fill-[#5B97F7]" },
  mono: { ring: "fill-current", drop: "fill-current", karsu: "fill-current", seal: "fill-current" },
};

/** Karsu Seal logo, drawn from the same outlines as the files in /public/brand. */
export function Logo({ className, tone = "auto", variant = "horizontal", title = "Karsu Seal" }: Props) {
  const t = TONES[tone];
  const icon = (
    <>
      <path className={t.ring} fillRule="evenodd" d={RING_PATH} />
      <path className={t.drop} d={DROP_PATH} />
    </>
  );
  if (variant === "icon") {
    return (
      <svg viewBox="0 0 48 48" className={className} role="img" aria-label={title}>
        {icon}
      </svg>
    );
  }
  // Horizontal lockup: 48px icon, 11px gap, wordmark optically centred.
  const scale = 1;
  const x = 59;
  const y = 24 - WORDMARK.height / 2;
  return (
    <svg viewBox={`0 0 ${x + WORDMARK.width * scale} 48`} className={className} role="img" aria-label={title}>
      {icon}
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <path className={t.karsu} d={WORDMARK.karsu} />
        <path className={t.seal} d={WORDMARK.seal} />
      </g>
    </svg>
  );
}
