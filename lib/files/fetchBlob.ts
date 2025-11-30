/**
 * Fetches a blob from a URL or data URL
 * Works with both HTTP/HTTPS URLs and data URLs (e.g., "data:image/png;base64,...")
 *
 * @param url - URL or data URL to fetch the blob from
 * @returns Promise that resolves to a Blob
 */
export async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return response.blob();
}
