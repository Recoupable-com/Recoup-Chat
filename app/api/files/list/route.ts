import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerAccountId = searchParams.get("ownerAccountId");
    const artistAccountId = searchParams.get("artistAccountId");

    if (!ownerAccountId || !artistAccountId) {
      return NextResponse.json({ error: "Missing ownerAccountId or artistAccountId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("owner_account_id", ownerAccountId)
      .eq("artist_account_id", artistAccountId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ files: data ?? [] }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


