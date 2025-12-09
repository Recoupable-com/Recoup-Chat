import { NextRequest } from "next/server";
import { getAccountWithDetails } from "@/lib/supabase/accounts/getAccountWithDetails";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!accountId) {
    return Response.json({ message: "accountId is required" }, { status: 400 });
  }

  try {
    // Reuses existing getAccountWithDetails function (DRY principle)
    const accountData = await getAccountWithDetails(accountId);
    return Response.json({ data: accountData }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    // getAccountWithDetails throws "Account not found" if not found
    const status = message === "Account not found" ? 404 : 400;
    return Response.json({ message }, { status });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

