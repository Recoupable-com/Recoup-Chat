import { NextRequest } from "next/server";
import { createArtistInDb } from "@/lib/supabase/createArtistInDb";

/**
 * Create a blank workspace (account) for a user
 * Uses the same underlying structure as artists
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account_id, name } = body;

    if (!account_id) {
      return Response.json(
        { message: "Missing required parameter: account_id" },
        { status: 400 }
      );
    }

    // Create workspace with provided name or default to "Untitled"
    const workspaceName = name?.trim() || "Untitled";

    // Create workspace account
    // This creates: account record + account_info + account_workspace_ids link
    const workspace = await createArtistInDb(workspaceName, account_id, true);

    if (!workspace) {
      return Response.json(
        { message: "Failed to create workspace" },
        { status: 500 }
      );
    }

    return Response.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    const message = error instanceof Error ? error.message : "Failed to create workspace";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
