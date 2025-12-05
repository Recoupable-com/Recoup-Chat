import { NextRequest } from "next/server";
import { addArtistToOrganization } from "@/lib/supabase/artist_organization_ids/addArtistToOrganization";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { artistId, organizationId } = body;

  if (!artistId || !organizationId) {
    return Response.json(
      { message: "artistId and organizationId are required" },
      { status: 400 }
    );
  }

  try {
    const result = await addArtistToOrganization(artistId, organizationId);

    if (!result) {
      return Response.json(
        { message: "Failed to add artist to organization" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, id: result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

