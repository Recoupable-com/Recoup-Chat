import { NEW_API_BASE_URL } from "@/lib/consts";
import type { ArtistRecord } from "@/types/Artist";

interface FetchArtistsResponse {
  status: "success" | "error";
  artists?: ArtistRecord[];
  error?: string;
}

/**
 * Fetches artists from the Recoup API.
 *
 * Authentication is via Bearer token (Privy access token).
 * The account is automatically inferred from the authentication token.
 * When orgId is omitted, the API returns only personal (non-org) artists.
 *
 * @param accessToken - Privy access token for Bearer auth
 * @param orgId - Optional organization ID to filter artists by
 * @returns Array of artist records
 */
export async function fetchArtists(
  accessToken: string,
  orgId?: string | null,
): Promise<ArtistRecord[]> {
  const params = new URLSearchParams();

  if (orgId) {
    params.set("org_id", orgId);
  }

  const response = await fetch(`${NEW_API_BASE_URL}/api/artists?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: FetchArtistsResponse = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.error || "Failed to fetch artists");
  }

  return data.artists || [];
}
