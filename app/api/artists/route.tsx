import { NextRequest } from "next/server";
import getArtists from "@/lib/artists/getArtists";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  try {
    if (!accountId) {
      return Response.json(
        { message: "Missing accountId param" },
        { status: 400 }
      );
    }

    const artists = await getArtists(accountId);
    return Response.json({ artists }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
