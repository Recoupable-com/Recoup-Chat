import type { SuggestionDataItem } from "react-mentions";

export const parseMentionedIds = (value: string | undefined): Set<string> => {
  const ids = new Set<string>();
  const text = value || "";
  const regex = /@\[[^\]]+\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((m = regex.exec(text))) {
    if (m[1]) ids.add(m[1]);
  }
  return ids;
};

export const mapKnowledgeToOptions = (
  files: Array<{ url: string; name: string }>
): SuggestionDataItem[] =>
  (files || [])
    .filter((f) => typeof f?.url === "string" && !!f.url)
    .map((f) => ({ id: String(f.url), display: String(f.name || f.url) }));