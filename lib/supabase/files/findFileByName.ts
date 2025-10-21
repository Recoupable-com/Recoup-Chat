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
