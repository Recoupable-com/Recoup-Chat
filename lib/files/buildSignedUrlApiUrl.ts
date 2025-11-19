/**
 * Builds the API URL for getting signed file URLs
 * Centralizes URL construction to maintain consistency across the app
 * 
 * @param storageKey - The storage key of the file
 * @param accountId - The account ID of the user requesting access
 * @param expiresSeconds - Optional expiration time in seconds
 * @returns Formatted API URL with encoded parameters
 */
export function buildSignedUrlApiUrl(
  storageKey: string,
  accountId: string,
  expiresSeconds?: number
): string {
  const params = new URLSearchParams({
    key: storageKey,
    accountId: accountId,
  });

  if (expiresSeconds !== undefined) {
    params.append("expires", expiresSeconds.toString());
  }

  return `/api/files/get-signed-url?${params.toString()}`;
}
