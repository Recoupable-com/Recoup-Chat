import { NextRequest } from "next/server";
import createAccount from "@/lib/supabase/accounts/createAccount";
import { addAccountToOrganization } from "@/lib/supabase/accountOrganizationIds/addAccountToOrganization";
import insertAccountInfo from "@/lib/supabase/accountInfo/insertAccountInfo";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, userId } = body;

  if (!name || !userId) {
    return Response.json(
      { message: "name and userId are required" },
      { status: 400 }
    );
  }

  try {
    // Create the organization account
    // Note: Organization type is determined by usage (being in organization tables), not account_type
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
    await addAccountToOrganization(userId, org.id);

    return Response.json(
      {
        organization: {
          id: org.id,
          name: org.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

