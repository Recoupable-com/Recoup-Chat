import getAccountById from "@/lib/supabase/accounts/getAccountById";
import { ADMIN_EMAILS } from "@/lib/admin";
import { NextRequest, NextResponse } from "next/server";
import { NEW_API_BASE_URL } from "@/lib/consts";

export const runtime = "edge";

const SUNSET_DAYS = 90;

function getDeprecationHeaders(): Record<string, string> {
  const sunsetDate = new Date();
  sunsetDate.setDate(sunsetDate.getDate() + SUNSET_DAYS);

  return {
    Deprecation: "true",
    Sunset: sunsetDate.toUTCString(),
    Link: `<${NEW_API_BASE_URL}/api/agent-creator>; rel="deprecation"`,
  };
}

/**
 * @deprecated This endpoint is deprecated. Use recoup-api directly at recoup-api.vercel.app/api/agent-creator
 */
export async function GET(req: NextRequest) {
  const deprecationHeaders = getDeprecationHeaders();
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  if (!creatorId) {
    return NextResponse.json(
      { message: "Missing creatorId" },
      { status: 400, headers: deprecationHeaders },
    );
  }

  try {
    const account = await getAccountById(creatorId);

    if (!account) {
      return NextResponse.json(
        { message: "Creator not found" },
        { status: 404, headers: deprecationHeaders },
      );
    }

    const info = Array.isArray(account.account_info)
      ? account.account_info[0] || null
      : null;
    const email = Array.isArray(account.account_emails)
      ? account.account_emails[0]?.email || null
      : null;
    const isAdmin = !!email && ADMIN_EMAILS.includes(email);

    return NextResponse.json(
      {
        creator: {
          name: account.name || null,
          image: info?.image || null,
          is_admin: isAdmin,
        },
      },
      { status: 200, headers: deprecationHeaders },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json(
      { message },
      { status: 400, headers: deprecationHeaders },
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
