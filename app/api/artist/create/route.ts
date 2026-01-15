import { NextRequest } from "next/server";
import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * POST /api/artist/create
 *
 * Forwards request to recoup-api POST /api/artists endpoint.
 * Requires Authorization header with Privy access token.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return Response.json(
      { status: "error", error: "Authorization header required" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch(`${NEW_API_BASE_URL}/api/artists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create artist";
    return Response.json({ status: "error", error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
