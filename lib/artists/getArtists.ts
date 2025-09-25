import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import isEnterpriseAccount from "@/lib/recoup/isEnterpriseAccount";
import type { ArtistRecord } from "@/types/Artist";
import { ROSTRUM_ORG_ARTIST_IDS } from "../consts";

const getArtists = async (accountId: string): Promise<ArtistRecord[]> => {
  // Run parallel queries for better performance
  const [userArtists, enterprise] = await Promise.all([
    getAccountArtistIds({ accountIds: [accountId] }),
    isEnterpriseAccount(accountId)
  ]);

  // Optionally fetch org artists if enterprise and list provided
  const orgArtists =
    enterprise && ROSTRUM_ORG_ARTIST_IDS.length
      ? await getAccountArtistIds({ artistIds: ROSTRUM_ORG_ARTIST_IDS })
      : [];

  // Deduplicate by account_id to avoid duplicate entries
  const uniqueByAccountId = new Map<string, ArtistRecord>();
  [...userArtists, ...orgArtists].forEach((artist) => {
    if (artist?.account_id && !uniqueByAccountId.has(artist.account_id)) {
      uniqueByAccountId.set(artist.account_id, artist);
    }
  });

  return Array.from(uniqueByAccountId.values());
};

export default getArtists;
