import supabase from "@/lib/supabase/serverClient";
import { Tables } from "@/types/database.types";

type FileRecord = Tables<"files">;

/**
 * Find a file by name within artist context
 * Searches in the artist's file storage directory
 */
export async function findFileByName(
  fileName: string,
  ownerAccountId: string,
  artistAccountId: string,
  path?: string
): Promise<FileRecord | null> {
  // Build storage key pattern with exact filename
  const pathPattern = path
    ? `files/${ownerAccountId}/${artistAccountId}/${path}/${fileName}`
    : `files/${ownerAccountId}/${artistAccountId}/${fileName}`;

  // Try to find by file_name first (exact match)
  const { data, error} = await supabase
    .from("files")
    .select()
    .eq("owner_account_id", ownerAccountId)
    .eq("artist_account_id", artistAccountId)
    .eq("file_name", fileName)
    .ilike("storage_key", pathPattern)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows found - try bidirectional normalization (spaces ↔ underscores)
    const fileNameWithSpaces = fileName.replace(/_/g, ' ');
    const fileNameWithUnderscores = fileName.replace(/ /g, '_');
    
    const storageKeyPatternSpaces = path
      ? `files/${ownerAccountId}/${artistAccountId}/${path}/${fileNameWithSpaces}`
      : `files/${ownerAccountId}/${artistAccountId}/${fileNameWithSpaces}`;
    
    const storageKeyPatternUnderscores = path
      ? `files/${ownerAccountId}/${artistAccountId}/${path}/${fileNameWithUnderscores}`
      : `files/${ownerAccountId}/${artistAccountId}/${fileNameWithUnderscores}`;

    const { data: dataByKey, error: errorByKey } = await supabase
      .from("files")
      .select()
      .eq("owner_account_id", ownerAccountId)
      .eq("artist_account_id", artistAccountId)
      .or(`file_name.eq.${fileNameWithSpaces},file_name.eq.${fileNameWithUnderscores},storage_key.ilike.${storageKeyPatternSpaces},storage_key.ilike.${storageKeyPatternUnderscores}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (errorByKey || !dataByKey) {
      return null;
    }

    return dataByKey;
  }

  if (error || !data) {
    return null;
  }

  return data;
}
