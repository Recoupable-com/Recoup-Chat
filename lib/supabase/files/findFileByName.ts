import supabase from "@/lib/supabase/serverClient";
import { Tables } from "@/types/database.types";
import { escapePostgrestValue } from "./escapePostgrestValue";
import { isValidPath } from "@/utils/isValidPath";

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
  // Validate path to prevent directory traversal attacks
  if (path && !isValidPath(path)) {
    throw new Error(
      'Invalid path: paths cannot contain directory traversal sequences (.., ./), ' +
      'backslashes, control characters, or be absolute paths'
    );
  }

  // Normalize path: remove leading/trailing slashes
  const normalizedPath = path?.replace(/^\/+|\/+$/g, '');
  
  const pathPattern = normalizedPath
    ? `files/${ownerAccountId}/${artistAccountId}/${normalizedPath}/${fileName}`
    : `files/${ownerAccountId}/${artistAccountId}/${fileName}`;

  // Try to find by file_name first (exact match)
  const { data, error} = await supabase
    .from("files")
    .select()
    .eq("owner_account_id", ownerAccountId)
    .eq("artist_account_id", artistAccountId)
    .eq("file_name", fileName)
    .eq("storage_key", pathPattern)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows found - try bidirectional normalization (spaces ↔ underscores)
    const fileNameWithSpaces = fileName.replace(/_/g, ' ');
    const fileNameWithUnderscores = fileName.replace(/ /g, '_');
    
    const storageKeyPatternSpaces = normalizedPath
      ? `files/${ownerAccountId}/${artistAccountId}/${normalizedPath}/${fileNameWithSpaces}`
      : `files/${ownerAccountId}/${artistAccountId}/${fileNameWithSpaces}`;
    
    const storageKeyPatternUnderscores = normalizedPath
      ? `files/${ownerAccountId}/${artistAccountId}/${normalizedPath}/${fileNameWithUnderscores}`
      : `files/${ownerAccountId}/${artistAccountId}/${fileNameWithUnderscores}`;

    // Escape values for PostgREST (handles filenames with commas, periods, etc.)
    const escapedPatternSpaces = escapePostgrestValue(storageKeyPatternSpaces);
    const escapedPatternUnderscores = escapePostgrestValue(storageKeyPatternUnderscores);

    const { data: dataByKey, error: errorByKey } = await supabase
      .from("files")
      .select()
      .eq("owner_account_id", ownerAccountId)
      .eq("artist_account_id", artistAccountId)
      .or(`storage_key.eq.${escapedPatternSpaces},storage_key.eq.${escapedPatternUnderscores}`)
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
