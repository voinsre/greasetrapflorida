import data from "../../seo-overrides.json";

type OverrideEntry = { title?: string; description?: string };

const overrides = data as Record<string, OverrideEntry>;

/**
 * If an override exists for `key`, replace meta.title and/or meta.description.
 * Otherwise return meta unchanged. Used inside generateMetadata() functions to
 * let the SEO automation agent override per-slug metadata via seo-overrides.json
 * without having to edit route files.
 */
export function applyOverrides<T extends { title?: unknown; description?: unknown }>(
  key: string,
  meta: T
): T {
  const o = overrides[key];
  if (!o) return meta;
  if (o.title !== undefined) (meta as { title?: unknown }).title = o.title;
  if (o.description !== undefined) (meta as { description?: unknown }).description = o.description;
  return meta;
}
