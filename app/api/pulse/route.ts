import { NextRequest } from "next/server";
import { NEW_API_BASE_URL } from "@/lib/consts";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { message: "Unauthorized - missing authorization header" },
      { status: 401 }
    );
  }

  const accessToken = authHeader.replace(/^Bearer\s+/i, "");
  const accountId = req.nextUrl.searchParams.get("account_id");

  try {
    const url = new URL(`${NEW_API_BASE_URL}/api/pulse`);
    if (accountId) {
      url.searchParams.set("account_id", accountId);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": accessToken,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get pulse";
    return Response.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { message: "Unauthorized - missing authorization header" },
      { status: 401 }
    );
  }

  const accessToken = authHeader.replace(/^Bearer\s+/i, "");
  const body = await req.json();
  const { active, accountId } = body;

  if (typeof active !== "boolean") {
    return Response.json(
      { message: "Missing required field: active (boolean)" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${NEW_API_BASE_URL}/api/pulse`, {
      method: "PATCH",
      headers: {
        "x-api-key": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active,
        ...(accountId && { account_id: accountId }),
      }),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update pulse";
    return Response.json({ message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
