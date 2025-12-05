import { NextRequest } from "next/server";
import getAccountOrganizations from "@/lib/supabase/account_organization_ids/getAccountOrganizations";

/**
 * GET /api/organizations?accountId=xxx
 * Returns all organizations the user belongs to
 */
export async function GET(req: NextRequest): Promise<Response> {
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!accountId) {
    return Response.json({ message: "accountId is required" }, { status: 400 });
  }

  try {
    const organizations = await getAccountOrganizations(accountId);
    return Response.json({ organizations }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

