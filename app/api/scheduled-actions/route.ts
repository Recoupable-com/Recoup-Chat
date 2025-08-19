import { NextRequest, NextResponse } from "next/server";
import { selectScheduledActions } from "@/lib/supabase/scheduled_actions/selectScheduledActions";
import { updateScheduledActions } from "@/lib/supabase/scheduled_actions/updateScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledActionUpdate = Partial<Omit<Tables<"scheduled_actions">, "id" | "created_at">>;

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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateFields }: { id: string } & ScheduledActionUpdate = body;

    if (!id) {
      return NextResponse.json(
        { message: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    const fieldsToUpdate = {
      ...updateFields,
      updated_at: new Date().toISOString(),
    };

    // Update the scheduled action using the existing function
    const updatedActions = await updateScheduledActions({
      ids: [id],
      updates: fieldsToUpdate,
    });

    return NextResponse.json(
      { message: "Scheduled action updated successfully", data: updatedActions[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/scheduled-actions:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";