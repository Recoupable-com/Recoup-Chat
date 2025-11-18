import { NextRequest, NextResponse } from "next/server";
import getAccountEmails from "@/lib/supabase/accountEmails/getAccountEmails";

export async function GET(req: NextRequest) {
  const accountIds = req.nextUrl.searchParams.getAll("accountIds");

  if (!accountIds || accountIds.length === 0) {
    return NextResponse.json([]);
  }

  try {
    const emails = await getAccountEmails(accountIds);
    return NextResponse.json(emails);
  } catch (error) {
    console.error("Error fetching account emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch account emails" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

