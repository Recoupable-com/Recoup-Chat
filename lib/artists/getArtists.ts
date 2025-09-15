import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getAccountEmails from "@/lib/supabase/accountEmails/getAccountEmails";
import isEnterprise from "@/lib/recoup/isEnterprise";
import type { ArtistRecord } from "@/types/Artist";
import { ROSTRUM_ORG_ARTIST_IDS } from "../consts";

const getArtists = async (accountId: string): Promise<ArtistRecord[]> => {
  // Fetch user-linked artists
  const userArtists = await getAccountArtistIds({ accountIds: [accountId] });

  // Determine if the account email belongs to an enterprise domain
  const emails = await getAccountEmails([accountId]);
  const email = emails[0]?.email || "";
  const enterprise = isEnterprise(email);

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
