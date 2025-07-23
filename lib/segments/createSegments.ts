import getAccountSocials from "../supabase/accountSocials/getAccountSocials";
import { selectSocialFans } from "../supabase/social_fans/selectSocialFans";
import { generateSegments } from "./generateSegments";
import { insertSegments } from "../supabase/segments/insertSegments";
import { deleteSegments } from "../supabase/segments/deleteSegments";
import { insertArtistSegments } from "../supabase/artist_segments/insertArtistSegments";
import { insertFanSegments } from "../supabase/fan_segments/insertFanSegments";
import { Tables } from "@/types/database.types";
import { successResponse, errorResponse } from "./createSegmentResponses";
import { GenerateArrayResult } from "../ai/generateArray";
import { getFanSegmentsToInsert } from "./getFanSegmentsToInsert";
import { getArtistById } from "../supabase/artist/getArtistById";

interface CreateArtistSegmentsParams {
  artist_account_id: string;
  prompt: string;
}

export const createSegments = async ({
  artist_account_id,
  prompt,
}: CreateArtistSegmentsParams) => {
  try {
    // Get artist info for better error messages
    const artistInfo = await getArtistById(artist_account_id);
    const artistName = artistInfo?.name || "this artist";

    // Step 1: Get all social IDs for the artist
    const accountSocials = await getAccountSocials({
      accountId: artist_account_id,
    });
    const socialIds = accountSocials.map(
      (as: { social_id: string }) => as.social_id
    );

    if (socialIds.length === 0) {
      return {
        ...errorResponse("No social accounts found for this artist"),
        feedback: `No social accounts found for ${artistName}. To automatically set up social accounts, please follow these steps:\n` +
        `1. Call 'get_spotify_search' with "${artistName}" to find their Spotify profile\n` +
        `2. Call 'search_web' to search for "${artistName} social media handles" (Instagram, Twitter, TikTok)\n` +
        "3. Call 'update_artist_socials' with any discovered social profile URLs\n" +
        "4. Call 'create_segments' again to retry segment creation\n" +
        "This will establish the social connections needed for fan segmentation."
      }
    }

    // Step 2: Get all fans for the artist
    const fans = await selectSocialFans({
      social_ids: socialIds,
      orderBy: "latest_engagement",
      orderDirection: "desc",
    });

    if (fans.length === 0) {
      return {
        ...errorResponse("No fans found for this artist"),
        feedback: `No fan engagement data found for ${artistName}'s social accounts. To populate fan data, please follow these steps:\n` +
        "1. Call 'scrape_instagram_profile' with the artist's Instagram handles to gather fan engagement\n" +
        "2. Call 'search_twitter' to find Twitter engagement and followers\n" +
        "3. Call 'get_social_posts' to retrieve social media posts for each connected platform\n" +
        "4. Wait for the scraping operations to complete and populate the fan database\n" +
        "5. Call 'create_segments' again to retry segment creation\n" +
        "Note: Fan data collection may take some time as it involves scraping social platforms."
      }
    }

    // Step 3: Generate segment names using AI
    const segments = await generateSegments({ fans, prompt });

    if (segments.length === 0) {
      return errorResponse("Failed to generate segment names");
    }

    // Step 4: Delete existing segments for the artist
    await deleteSegments(artist_account_id);

    // Step 5: Insert segments into the database
    const segmentsToInsert = segments.map((segment: GenerateArrayResult) => ({
      name: segment.segmentName,
      updated_at: new Date().toISOString(),
    }));

    const insertedSegments = await insertSegments(segmentsToInsert);

    // Step 6: Associate segments with the artist
    const artistSegmentsToInsert = insertedSegments.map(
      (segment: Tables<"segments">) => ({
        artist_account_id,
        segment_id: segment.id,
        updated_at: new Date().toISOString(),
      })
    );

    const insertedArtistSegments = await insertArtistSegments(
      artistSegmentsToInsert
    );

    // Step 7: Associate fans with the new segments
    const fanSegmentsToInsert = getFanSegmentsToInsert(
      segments,
      insertedSegments
    );
    const insertedFanSegments = await insertFanSegments(fanSegmentsToInsert);

    return successResponse(
      `Successfully created ${segments.length} segments for artist`,
      {
        supabase_segments: insertedSegments,
        supabase_artist_segments: insertedArtistSegments,
        supabase_fan_segments: insertedFanSegments,
        segments,
      },
      segments.length
    );
  } catch (error) {
    console.error("Error creating artist segments:", error);
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to create artist segments"
    );
  }
};
