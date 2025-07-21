import { NextRequest, NextResponse } from "next/server";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";

interface ArtistInfo {
  account_id: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get parameters from query
    const { searchParams } = new URL(request.url);
    const artistAccountId = searchParams.get('artist_account_id');
    const accountId = searchParams.get('account_id');

    if (!artistAccountId) {
      return NextResponse.json(
        { error: "Missing artist_account_id parameter" },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { error: "Missing account_id parameter" },
        { status: 400 }
      );
    }

    // Security: Verify the accountId has access to this artistAccountId
    const accountArtists = await getAccountArtistIds({ accountIds: [accountId] });
    
    // Check if the artistAccountId is in the list of artists this account has access to
    const hasAccess = accountArtists.some((artist: ArtistInfo) => artist.account_id === artistAccountId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized: Account does not have access to this artist" },
        { status: 400 }
      );
    }

    // Call the server-side function
    const tokens = await getYouTubeTokens(artistAccountId);

    // Return the tokens (they will be null if not found)
    return NextResponse.json({
      success: true,
      hasValidTokens: !!(tokens && tokens.access_token)
    });

  } catch (error) {
    console.error('❌ Error in YouTube tokens API:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch YouTube tokens",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}