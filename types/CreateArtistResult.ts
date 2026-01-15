/**
 * Result type returned by the create_new_artist MCP tool from recoup-api.
 * Used by UI components to display tool results.
 */
export interface CreateArtistResult {
  artist?: {
    account_id: string;
    name: string;
    image?: string | null;
  };
  artistAccountId?: string;
  message: string;
  error?: string;
  newRoomId?: string | null;
}
