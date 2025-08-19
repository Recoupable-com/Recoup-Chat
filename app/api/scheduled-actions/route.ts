import { NextRequest, NextResponse } from "next/server";
import { selectScheduledActions } from "@/lib/supabase/scheduled_actions/selectScheduledActions";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get("accountId") || undefined;
    const artistAccountIdsParam = searchParams.get("artistAccountIds");

    const artistAccountIds = artistAccountIdsParam
      ? artistAccountIdsParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : undefined;

    const actions = await selectScheduledActions({
      account_id: accountId,
      artist_account_ids: artistAccountIds,
    });

    return NextResponse.json({ actions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching scheduled actions:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch scheduled actions";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";