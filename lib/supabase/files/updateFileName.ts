import supabase from "@/lib/supabase/serverClient";

/**
 * Update the file_name and storage_key of a file record (used for rename operations)
 * @param fileId UUID of the file record to update
 * @param newFileName New display name for the file
 * @param newStorageKey New storage key path
 * @throws Error if update fails
 */
export async function updateFileName(
  fileId: string,
  newFileName: string,
  newStorageKey: string
): Promise<void> {
  const { error } = await supabase
    .from("files")
    .update({
      file_name: newFileName,
      storage_key: newStorageKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fileId);

  if (error) {
    throw new Error(`Failed to update file name: ${error.message}`);
  }
}

