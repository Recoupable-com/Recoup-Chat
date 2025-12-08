import { NextRequest } from "next/server";
import getAccountOrganizations from "@/lib/supabase/account_organization_ids/getAccountOrganizations";
import { formatAccountOrganizations } from "@/lib/organizations/formatAccountOrganizations";
import createAccount from "@/lib/supabase/accounts/createAccount";
import { addAccountToOrganization } from "@/lib/supabase/account_organization_ids/addAccountToOrganization";
import insertAccountInfo from "@/lib/supabase/account_info/insertAccountInfo";

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
    const organizations = formatAccountOrganizations(rawOrgs);
    
    return Response.json({ organizations }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

/**
 * POST /api/organizations
 * Creates a new organization and adds the creator as a member
 */
export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const { name, accountId } = body;

  if (!name || !accountId) {
    return Response.json(
      { message: "name and accountId are required" },
      { status: 400 }
    );
  }

  try {
    // Create the organization account
    const org = await createAccount(name);
    if (!org) {
      return Response.json(
        { message: "Failed to create organization" },
        { status: 500 }
      );
    }

    // Create account_info for the org
    await insertAccountInfo({ account_id: org.id });

    // Add the creator as a member of the org
    await addAccountToOrganization(accountId, org.id);

    return Response.json({ organization: org }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

