import { NextRequest, NextResponse } from "next/server";
import { getArtistAgents } from "@/lib/supabase/getArtistAgents";
import { NEW_API_BASE_URL } from "@/lib/consts";

const SUNSET_DAYS = 90;

function getDeprecationHeaders(): Record<string, string> {
  const sunsetDate = new Date();
  sunsetDate.setDate(sunsetDate.getDate() + SUNSET_DAYS);

  return {
    Deprecation: "true",
    Sunset: sunsetDate.toUTCString(),
    Link: `<${NEW_API_BASE_URL}/api/artist-agents>; rel="deprecation"`,
  };
}

/**
 * @deprecated This endpoint is deprecated. Use recoup-api directly at recoup-api.vercel.app/api/artist-agents
 */
export async function GET(request: NextRequest) {
  const deprecationHeaders = getDeprecationHeaders();

  const { searchParams } = new URL(request.url);
  const socialIds = searchParams.getAll("socialId");

  if (!socialIds.length) {
    return NextResponse.json(
      { error: "At least one Social ID is required" },
      { status: 400, headers: deprecationHeaders },
    );
  }

  try {
    const agents = await getArtistAgents(socialIds);
    return NextResponse.json(agents, { headers: deprecationHeaders });
  } catch (error) {
    console.error("Error fetching segments:", error);
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500, headers: deprecationHeaders },
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
