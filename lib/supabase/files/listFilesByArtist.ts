import supabase from "@/lib/supabase/serverClient";
import { Tables } from "@/types/database.types";

type FileRecord = Tables<"files">;

/**
 * List files for an artist, optionally filtered by path
 * 
 * Note: With file sharing enabled, this returns files from ALL team members
 * who have access to the artist, not just the specified owner.
 */
export async function listFilesByArtist(
  ownerAccountId: string,
  artistAccountId: string,
  path?: string
): Promise<FileRecord[]> {
  const { data: allFiles, error: filesError } = await supabase
    .from("files")
    .select()
    .eq("artist_account_id", artistAccountId)
    .order("created_at", { ascending: false });

  if (filesError) {
    throw new Error(filesError.message);
  }

  const files = (allFiles || []).filter((row) => {
    const match = row.storage_key.match(/^files\/[^\/]+\/[^\/]+\/(.+)$/);
    if (!match) return false;
    
    const relativePath = match[1];
    
    if (path) {
      const pathPrefix = path.endsWith('/') ? path : path + '/';
      if (!relativePath.startsWith(pathPrefix)) return false;
      
      const relativeToFilter = relativePath.slice(pathPrefix.length);
      const trimmed = relativeToFilter.endsWith("/") ? relativeToFilter.slice(0, -1) : relativeToFilter;
      
      return trimmed.length > 0 && !trimmed.includes("/");
    }
    
    const trimmed = relativePath.endsWith("/") ? relativePath.slice(0, -1) : relativePath;
    return trimmed.length > 0 && !trimmed.includes("/");
  });

  return files;
}
