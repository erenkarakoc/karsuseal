/**
 * Minimal, safe text formatting for admin-edited content (no HTML is rendered):
 * blank line = new paragraph, "## " = heading, "- " lines = bullet list.
 */
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`prose-karsu ${className}`}>
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i} className="mt-8 mb-3 text-xl font-semibold text-foreground first:mt-0">{b.slice(3)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="mb-4 list-disc space-y-1 ps-5 text-muted-foreground-2">
              {lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}
            </ul>
          );
        }
        return <p key={i}>{lines.map((l, j) => (j ? [<br key={j} />, l] : l))}</p>;
      })}
    </div>
  );
}
