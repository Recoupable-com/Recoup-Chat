import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/consts";
import { checkFileAccess, getFileByStorageKey } from "@/lib/files/checkFileAccess";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

    const clientSupabase = createClient();
    const { data: { user } } = await clientSupabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = await getFileByStorageKey(key);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const hasAccess = await checkFileAccess(user.id, file);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).createSignedUrl(key, 300);
    if (error || !data?.signedUrl) return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });

    return NextResponse.redirect(data.signedUrl, 307);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


