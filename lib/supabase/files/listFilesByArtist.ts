import supabase from "@/lib/supabase/serverClient";
import { Tables } from "@/types/database.types";

type FileRecord = Tables<"files">;

/**
 * List files for an artist, optionally filtered by path
 */
export async function listFilesByArtist(
  ownerAccountId: string,
  artistAccountId: string,
  path?: string
): Promise<FileRecord[]> {
  // Construct the full storage path
  // If path is provided (e.g., "Albums"), construct: files/{owner}/{artist}/Albums/
  // If no path, use: files/{owner}/{artist}/
  const baseStoragePath = `files/${ownerAccountId}/${artistAccountId}/`;
  const fullPath = path
    ? `${baseStoragePath}${path.endsWith("/") ? path : path + "/"}`
    : baseStoragePath;

  console.log('[listFilesByArtist] Listing files:', {
    ownerAccountId,
    artistAccountId,
    path,
    fullPath,
    pattern: `${fullPath}%`
  });

  // Query files owned by the artist with the full storage path
  const { data: ownedFiles, error: ownedError } = await supabase
    .from("files")
    .select()
    .eq("owner_account_id", ownerAccountId)
    .eq("artist_account_id", artistAccountId)
    .ilike("storage_key", `${fullPath}%`)
    .order("created_at", { ascending: false });

  if (ownedError) {
    console.log('[listFilesByArtist] Error:', ownedError);
    throw new Error(ownedError.message);
  }

  console.log(`[listFilesByArtist] Found ${ownedFiles?.length || 0} total files before filtering`);
  if (ownedFiles && ownedFiles.length > 0) {
    console.log('[listFilesByArtist] Sample storage keys:', 
      ownedFiles.slice(0, 3).map(f => ({ name: f.file_name, key: f.storage_key }))
    );
  }

  // Filter to immediate children only (single level directory listing)
  const files = (ownedFiles || []).filter((row) => {
    // Get relative path from the full path
    const rel = row.storage_key.replace(fullPath, "");
    const trimmed = rel.endsWith("/") ? rel.slice(0, -1) : rel;

    // Only include immediate children (no slashes in relative path)
    return trimmed.length > 0 && !trimmed.includes("/");
  });

  console.log(`[listFilesByArtist] Returning ${files.length} files after filtering to immediate children`);

  return files;
}
