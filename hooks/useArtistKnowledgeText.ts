import { useQuery } from "@tanstack/react-query";
import type { KnowledgeBaseEntry } from "@/lib/supabase/getArtistKnowledge";

export function useArtistKnowledgeText(
  artistId?: string,
  knowledgeFiles?: KnowledgeBaseEntry[]
) {
  return useQuery<string>({
    queryKey: ["artist-knowledge-text", artistId, knowledgeFiles?.length],
    enabled: Boolean(artistId) && Array.isArray(knowledgeFiles),
    queryFn: async () => {
      if (!knowledgeFiles || knowledgeFiles.length === 0) return "";
      const textTypes = new Set([
        "text/plain",
        "text/markdown",
        "application/json",
        "text/csv",
      ]);
      const texts = await Promise.all(
        knowledgeFiles
          .filter((f) => textTypes.has(f.type))
          .map(async (f) => {
            try {
              const res = await fetch(f.url);
              if (!res.ok) return "";
              const content = await res.text();
              return `--- ${f.name} ---\n${content}`;
            } catch {
              return "";
            }
          })
      );
      return texts.filter(Boolean).join("\n\n");
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default useArtistKnowledgeText;


