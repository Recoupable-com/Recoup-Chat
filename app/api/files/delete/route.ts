import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/consts";
import { checkFileAccess } from "@/lib/files/checkFileAccess";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const storageKey = String(body.storageKey || "");
    const ownerAccountId = String(body.ownerAccountId || "");

    if (!id || !storageKey || !ownerAccountId) {
      return NextResponse.json({ error: "Missing id, storageKey or ownerAccountId" }, { status: 400 });
    }

    const { data: row, error: rowError } = await supabase
      .from("files")
      .select("id, owner_account_id, artist_account_id, is_directory, storage_key")
      .eq("id", id)
      .single();
    if (rowError || !row) {
      return NextResponse.json({ error: rowError?.message || "File not found" }, { status: 404 });
    }

    const hasAccess = await checkFileAccess(ownerAccountId, row);
    if (!hasAccess) {
      return NextResponse.json({ error: "You don't have access to this file" }, { status: 403 });
    }

    if (row.is_directory) {
      const { data: childFiles, error: childError } = await supabase
        .from("files")
        .select("storage_key")
        .like("storage_key", `${storageKey}%`)
        .neq("id", id);
      
      if (childError) {
        return NextResponse.json({ error: childError.message }, { status: 500 });
      }

      if (childFiles && childFiles.length > 0) {
        const childStorageKeys = childFiles.map(f => f.storage_key);
        const { error: removeChildError } = await supabase.storage
          .from(SUPABASE_STORAGE_BUCKET)
          .remove(childStorageKeys);
        if (removeChildError) {
          return NextResponse.json({ error: removeChildError.message }, { status: 500 });
        }
      }

      const { error: deleteChildError } = await supabase
        .from("files")
        .delete()
        .like("storage_key", `${storageKey}%`)
        .neq("id", id);
      
      if (deleteChildError) {
        return NextResponse.json({ error: deleteChildError.message }, { status: 500 });
      }
    } else {
      const { error: removeError } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove([storageKey]);
      if (removeError) {
        return NextResponse.json({ error: removeError.message }, { status: 500 });
      }
    }

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


