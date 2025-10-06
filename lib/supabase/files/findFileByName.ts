import supabase from "@/lib/supabase/serverClient";

type FileRecord = {
  id: string;
  file_name: string;
  storage_key: string;
  mime_type: string | null;
  size_bytes: number | null;
  is_directory: boolean | null;
  created_at: string;
};

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
    : `files/${ownerAccountId}/${artistAccountId}%${fileName}`;

  const { data, error } = await supabase
    .from("files")
    .select("id,file_name,storage_key,mime_type,size_bytes,is_directory,created_at")
    .eq("owner_account_id", ownerAccountId)
    .eq("artist_account_id", artistAccountId)
    .eq("file_name", fileName)
    .ilike("storage_key", pathPattern)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
