import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    const client = getSupabaseServerAdminClient();
    const { data, error } = await client
      .from("funnel_reports")
      .select("*")
      .eq("id", id)
      .single();
    if (error)
      return Response.json({ id: null, success: false }, { status: 500 });
    return Response.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ id: null, success: false }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
