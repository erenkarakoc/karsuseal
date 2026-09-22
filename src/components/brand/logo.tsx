import { DISC_PATH, DROP_PATH, MONO_PATH, RING_PATH, SQUARE_PATH, WORDMARK } from "./logo-paths";

type Props = {
  className?: string;
  /** "auto" follows the site theme (navy on light, white on dark). */
  tone?: "auto" | "light" | "dark" | "mono";
  variant?: "horizontal" | "icon";
  title?: string;
};

const TONES = {
  auto: { square: "fill-[#0B1F3F] dark:fill-[#1D5FD1]", disc: "fill-[#5B97F7] dark:fill-[#0B1F3F]", karsu: "fill-[#0B1F3F] dark:fill-white", seal: "fill-[#1D5FD1] dark:fill-[#5B97F7]" },
  light: { square: "fill-[#0B1F3F]", disc: "fill-[#5B97F7]", karsu: "fill-[#0B1F3F]", seal: "fill-[#1D5FD1]" },
  dark: { square: "fill-[#1D5FD1]", disc: "fill-[#0B1F3F]", karsu: "fill-white", seal: "fill-[#5B97F7]" },
  mono: null,
};

/** Karsu Seal logo, drawn from the same outlines as the files in /public/brand. */
export function Logo({ className, tone = "auto", variant = "horizontal", title = "Karsu Seal" }: Props) {
  const t = TONES[tone] ?? { karsu: "fill-current", seal: "fill-current" };
  const icon = TONES[tone] ? (
    <>
      <path className={TONES[tone].square} d={SQUARE_PATH} />
      <path className="fill-white" fillRule="evenodd" d={RING_PATH} />
      <path className={TONES[tone].disc} d={DISC_PATH} />
      <path className="fill-white" d={DROP_PATH} />
    </>
  ) : (
    <path className="fill-current" fillRule="evenodd" d={MONO_PATH} />
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
