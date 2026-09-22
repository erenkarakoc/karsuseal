// Pure helper shared by the site (server) and the admin editor.
const isPlainObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Stored values win; objects merge recursively; arrays and scalars replace the default. */
export function mergeContent<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(override)) out[k] = k in base ? mergeContent((base as Record<string, unknown>)[k], v) : v;
    return out as T;
  }
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  return (typeof override === typeof base ? override : base) as T;
}
