import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerAccountId = searchParams.get("ownerAccountId");
    const artistAccountId = searchParams.get("artistAccountId");
    const path = searchParams.get("path") || "";

    if (!ownerAccountId || !artistAccountId) {
      return NextResponse.json({ error: "Missing ownerAccountId or artistAccountId" }, { status: 400 });
    }

    // List immediate children under "path". If no path provided, return all (fallback)
    const { data, error } = await supabase
      .from("files")
      .select("id,file_name,storage_key,mime_type,is_directory,created_at")
      .eq("owner_account_id", ownerAccountId)
      .eq("artist_account_id", artistAccountId)
      .ilike("storage_key", path ? `${path}%` : "%")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter to immediate children client-side (single level)
    const base = path && path.endsWith("/") ? path : path ? path + "/" : "";
    const files = (data || []).filter((row) => {
      if (!base) return true;
      const rel = row.storage_key.replace(base, "");
      const trimmed = rel.endsWith("/") ? rel.slice(0, -1) : rel;
      return trimmed.length > 0 && !trimmed.includes("/");
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


