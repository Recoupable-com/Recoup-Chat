import supabase from "@/lib/supabase/serverClient";

/**
 * Delete a file record from the database
 * @param fileId UUID of the file record to delete
 * @throws Error if deletion fails
 */
export async function deleteFileRecord(fileId: string): Promise<void> {
  const { error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId);

  if (error) {
    throw new Error(`Failed to delete file record: ${error.message}`);
  }
}

