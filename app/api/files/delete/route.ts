import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/consts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const storageKey = String(body.storageKey || "");
    const ownerAccountId = String(body.ownerAccountId || "");

    if (!id || !storageKey || !ownerAccountId) {
      return NextResponse.json({ error: "Missing id, storageKey or ownerAccountId" }, { status: 400 });
    }

    // Load file row to check ownership and type
    const { data: row, error: rowError } = await supabase
      .from("files")
      .select("id, owner_account_id, is_directory, storage_key")
      .eq("id", id)
      .single();
    if (rowError || !row) {
      return NextResponse.json({ error: rowError?.message || "File not found" }, { status: 404 });
    }

    if (row.owner_account_id !== ownerAccountId) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    if (row.is_directory) {
      return NextResponse.json({ error: "Cannot delete a folder here" }, { status: 400 });
    }

    // Delete from storage first
    const { error: removeError } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove([storageKey]);
    if (removeError) {
      return NextResponse.json({ error: removeError.message }, { status: 500 });
    }

    // Then delete DB row
    const { error: dbError } = await supabase.from("files").delete().eq("id", id);
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


