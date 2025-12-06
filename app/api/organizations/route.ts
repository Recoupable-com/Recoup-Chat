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
    const rawOrgs = await getAccountOrganizations(accountId);
    
    // Map nested organization data to flat structure expected by frontend
    // and deduplicate by organization_id
    const seen = new Set<string>();
    const organizations = rawOrgs
      .filter((org) => {
        if (!org.organization_id || seen.has(org.organization_id)) return false;
        seen.add(org.organization_id);
        return true;
      })
      .map((org) => ({
        id: org.id,
        organization_id: org.organization_id,
        organization_name: org.organization?.name || null,
        organization_image: org.organization?.account_info?.[0]?.image || null,
      }));
    
    return Response.json({ organizations }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

