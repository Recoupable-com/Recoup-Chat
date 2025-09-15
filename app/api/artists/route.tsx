import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import { NextRequest } from "next/server";
import getAccountEmails from "@/lib/supabase/accountEmails/getAccountEmails";
import isEnterprise from "@/lib/recoup/isEnterprise";
import type { ArtistRecord } from "@/types/Artist";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  try {
    if (!accountId) {
      return Response.json(
        { message: "Missing accountId param" },
        { status: 400 }
      );
    }
    // Fetch user-linked artists
    const userArtists = await getAccountArtistIds({ accountIds: [accountId] });

    // Determine if the account email belongs to an enterprise domain
    const emails = await getAccountEmails([accountId]);
    const email = emails[0]?.email || "";
    const enterprise = isEnterprise(email);

    // Hard-coded org-level artist IDs to include for enterprise users
    // TODO: populate with actual artist IDs
    const ROSTRUM_ORG_ARTIST_IDS: string[] = [
      "1873859c-dd37-4e9a-9bac-80d3558527a9",
      "3f9dd138-f5f2-442b-b009-222f37cd2972",
      "c182c7b4-5956-4f72-a375-df4240caab97",
      "2e8e643e-ab6e-49e0-bd58-f06dc39a4ee9",
      "a92841a7-edab-43b2-b0c4-1ea1d90b2d32",
      "32e83747-de64-4154-93c5-c001ec02b4a8",
      "b67e1902-12d8-42f2-9930-b1d40ea8ec4a",
      "becf071a-a834-47b6-8510-4573d205c3eb",
      "06c7682c-bcc1-465a-a51d-f640d7edaa84",
      "496027b3-e60d-4a6f-9eca-4cffd39e911d",
      "ce53c5cb-97f1-40b3-90b1-3e1bd3ba012a",
      "8dde6db5-5c6b-4cc4-a6a3-b647c5dbd3a8",
      "cf7ebe4a-cbbf-4d41-adfa-217da5e6267e",
      "a61cf649-d323-4bec-a772-cc1331842262",
      "9b6a7524-af66-4a55-b88f-95241c4ae58a",
      "f95b0f73-4ac6-4063-9633-e8b17c5c31e4",
      "4f07f136-b30b-4bf5-bcf9-5ff40989ca8e",
      "7c351892-2649-4946-8532-56e0314af0cf",
      "2edaec49-6cef-4846-ac6c-0f44d9c2a92f",
      "8d61f25a-ca47-4a7e-89c5-1ce643b2f666",
      "be17e29b-5208-455d-a701-cc8b29c05a54",
      "94c884f9-34e8-46a4-9240-cf33ebf67390",
      "8f94490f-5141-4626-a955-e22043d3e3ca",
      "d21d6bf6-900d-4e77-b15e-6830c03d3936",
    ];

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

    return Response.json(
      {
        artists: Array.from(uniqueByAccountId.values()),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
