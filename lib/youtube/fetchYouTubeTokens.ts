import { YouTubeTokensRow } from "@/types/youtube";

interface YouTubeTokensResponse {
  success: boolean;
  hasValidTokens: boolean;
  tokens?: YouTubeTokensRow | null;
  error?: string;
}

/**
 * Fetches YouTube tokens for a specific artist account
 * @param artistAccountId - The artist account ID
 * @returns Promise with token validation result
 */
export async function fetchYouTubeTokens(
  artistAccountId: string
): Promise<YouTubeTokensResponse> {
  const apiUrl = `/api/youtube/channel-info?artist_account_id=${encodeURIComponent(artistAccountId)}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  // Map the channel-info response to the expected tokens response format
  return {
    success: data.success,
    hasValidTokens: data.tokenStatus === 'valid',
    tokens: null, // Not needed for current usage
    error: data.error
  };
}