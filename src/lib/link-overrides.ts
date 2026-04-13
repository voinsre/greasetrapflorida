import data from "../../link-overrides.json";

type LinkEntry = { text: string; href: string };

const overrides = data as Record<string, LinkEntry[]>;

export function getLinkOverrides(key: string): LinkEntry[] {
  return overrides[key] ?? [];
}
