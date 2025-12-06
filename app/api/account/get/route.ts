import { NextRequest } from "next/server";
import getAccountById from "@/lib/supabase/accounts/getAccountById";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!accountId) {
    return Response.json({ message: "accountId is required" }, { status: 400 });
  }

  try {
    const account = await getAccountById(accountId);
    if (!account) {
      return Response.json({ message: "Account not found" }, { status: 404 });
    }

    const accountInfo = account.account_info?.[0];

    const response = {
      data: {
        id: account.id,
        name: account.name,
        image: accountInfo?.image || "",
        instruction: accountInfo?.instruction || "",
      },
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

