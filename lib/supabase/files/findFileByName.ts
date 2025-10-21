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
  const pathPattern = path
    ? `files/${ownerAccountId}/${artistAccountId}/${path}/${fileName}`
    : `files/${ownerAccountId}/${artistAccountId}%`;

  console.log('[findFileByName] Searching for file:', {
    fileName,
    ownerAccountId,
    artistAccountId,
    path,
    pathPattern
  });

  // Try to find by file_name first
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
    // No rows found - try matching by storage_key pattern instead
    // This handles cases where file_name has spaces but storage_key has underscores
    console.log('[findFileByName] No match by file_name, trying storage_key pattern...');
    
    const storageKeyPattern = path
      ? `files/${ownerAccountId}/${artistAccountId}/${path}/${fileName}`
      : `files/${ownerAccountId}/${artistAccountId}/${fileName}`;

    const { data: dataByKey, error: errorByKey } = await supabase
      .from("files")
      .select()
      .eq("owner_account_id", ownerAccountId)
      .eq("artist_account_id", artistAccountId)
      .ilike("storage_key", storageKeyPattern)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (errorByKey) {
      console.log('[findFileByName] Error finding file by storage_key:', errorByKey);
      return null;
    }

    if (dataByKey) {
      console.log('[findFileByName] File found by storage_key:', {
        fileName: dataByKey.file_name,
        storageKey: dataByKey.storage_key,
        id: dataByKey.id
      });
      return dataByKey;
    }

    return null;
  }

  if (error) {
    console.log('[findFileByName] Error finding file:', error);
    return null;
  }

  if (!data) {
    console.log('[findFileByName] No file found matching criteria');
    return null;
  }

  console.log('[findFileByName] File found:', {
    fileName: data.file_name,
    storageKey: data.storage_key,
    id: data.id
  });

  return data;
}
