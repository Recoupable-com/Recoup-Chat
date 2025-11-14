/**
 * Generate storage path for files in the format:
 * files/{account_id}/{artist_id}/{optional_path}/
 * 
 * Normalizes path by removing leading/trailing slashes
 */
export function generateStoragePath(
  accountId: string,
  artistId: string,
  path?: string
): string {
  const baseStoragePath = `files/${accountId}/${artistId}`;
  
  if (!path) {
    return `${baseStoragePath}/`;
  }
  
  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  return `${baseStoragePath}/${normalizedPath}/`;
}

/**
 * Generate full storage key including filename
 */
export function generateStorageKey(
  accountId: string,
  artistId: string,
  fileName: string,
  path?: string
): string {
  const storagePath = generateStoragePath(accountId, artistId, path);
  return `${storagePath}${fileName}`;
}

