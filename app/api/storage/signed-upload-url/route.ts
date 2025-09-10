import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/consts";
import isValidStorageKey from "@/utils/isValidStorageKey";


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = String(body.key || "");
    if (!key || !isValidStorageKey(key)) return NextResponse.json({ error: "Invalid or missing key" }, { status: 400 });

    const { data, error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).createSignedUploadUrl(key);
    if (error || !data) return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });

    // Return only what's necessary for the client upload; token is already embedded in the signedUrl
    return NextResponse.json({ signedUrl: data.signedUrl, path: data.path }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";


