import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const account_id = req.nextUrl.searchParams.get("account_id");

  try {
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("*, memories(artist_id), rooms_report(report_id)")
      .eq("account_id", account_id);

    return Response.json({ rooms, error }, { status: 400 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
