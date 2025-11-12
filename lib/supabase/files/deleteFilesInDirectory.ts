import supabase from "@/lib/supabase/serverClient";

type FileRecord = {
  id: string;
  storage_key: string;
};

/**
 * Delete all file records in a directory (recursive)
 * Returns array of storage keys that need to be deleted from storage
 * @param directoryStorageKey Storage key of the directory (used as prefix match)
 * @param excludeId Optional file ID to exclude from deletion (e.g., the directory itself)
 * @returns Array of storage keys that were deleted from database
 * @throws Error if database operation fails
 */
export async function deleteFilesInDirectory(
  directoryStorageKey: string,
  excludeId?: string
): Promise<string[]> {
  // Find all files whose storage_key starts with the directory path
  let query = supabase
    .from("files")
    .select("id, storage_key")
    .like("storage_key", `${directoryStorageKey}%`);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data: childFiles, error: selectError } = await query;

  if (selectError) {
    throw new Error(`Failed to find files in directory: ${selectError.message}`);
  }

  if (!childFiles || childFiles.length === 0) {
    return [];
  }

  const storageKeys = childFiles.map((f: FileRecord) => f.storage_key);

  // Delete all child file records
  let deleteQuery = supabase
    .from("files")
    .delete()
    .like("storage_key", `${directoryStorageKey}%`);

  if (excludeId) {
    deleteQuery = deleteQuery.neq("id", excludeId);
  }

  const { error: deleteError } = await deleteQuery;

  if (deleteError) {
    throw new Error(`Failed to delete file records: ${deleteError.message}`);
  }

  return storageKeys;
}

