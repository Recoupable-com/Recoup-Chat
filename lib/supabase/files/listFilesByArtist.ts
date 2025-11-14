import { Tables } from "@/types/database.types";
import { getFilesByArtistId } from "./getFilesByArtistId";
import { filterFilesByPath } from "@/lib/files/filterFilesByPath";

type FileRecord = Tables<"files">;

/**
 * List files for an artist, optionally filtered by path
 * 
 * This is a convenience function that combines:
 * 1. Database query (getFilesByArtistId)
 * 2. Path filtering logic (filterFilesByPath)
 * 
 * Note: With file sharing enabled, this returns files from ALL team members
 * who have access to the artist, not just the specified owner.
 * 
 * @param ownerAccountId - Currently unused, kept for backward compatibility
 * @param artistAccountId - The artist account to get files for
 * @param path - Optional path filter for immediate children only
 */
export async function listFilesByArtist(
  ownerAccountId: string,
  artistAccountId: string,
  path?: string
): Promise<FileRecord[]> {
  // Get all files for the artist from database
  const allFiles = await getFilesByArtistId(artistAccountId);

  // Apply path filtering logic
  return filterFilesByPath(allFiles, path);
}
