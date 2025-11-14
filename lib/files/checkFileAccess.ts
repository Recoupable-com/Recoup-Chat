import supabase from "@/lib/supabase/serverClient";

/**
 * Check if a user has access to a file
 * 
 * Access is granted if:
 * - User is the file owner, OR
 * - User has access to the artist that owns the file
 * 
 * @param userId - The user's account ID
 * @param file - File record with owner_account_id and artist_account_id
 * @returns true if user has access, false otherwise
 */
export async function checkFileAccess(
  userId: string,
  file: { owner_account_id: string; artist_account_id: string }
): Promise<boolean> {
  if (file.owner_account_id === userId) {
    return true;
  }

  const { data: artistAccess } = await supabase
    .from("account_artist_ids")
    .select("artist_id")
    .eq("account_id", userId)
    .eq("artist_id", file.artist_account_id)
    .maybeSingle();

  return !!artistAccess;
}

/**
 * Get file record by storage key with owner and artist info
 * 
 * @param storageKey - The file's storage key
 * @returns File record or null if not found
 */
export async function getFileByStorageKey(
  storageKey: string
): Promise<{ owner_account_id: string; artist_account_id: string } | null> {
  const { data: file } = await supabase
    .from("files")
    .select("owner_account_id, artist_account_id")
    .eq("storage_key", storageKey)
    .maybeSingle();

  return file;
}

