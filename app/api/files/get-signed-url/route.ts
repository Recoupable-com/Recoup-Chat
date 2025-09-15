import { NextResponse } from "next/server";
import isValidStorageKey from "@/utils/isValidStorageKey";
import { createSignedUrlForKey } from "@/lib/supabase/storage/createSignedUrl";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || "";
    const expiresParam = searchParams.get("expires");
    const DEFAULT_EXPIRES_SEC = 300; // 5 minutes
    let expires = DEFAULT_EXPIRES_SEC;
    if (expiresParam !== null && expiresParam !== "") {
      const parsed = Number(expiresParam);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return NextResponse.json({ error: "Invalid expires value" }, { status: 400 });
      }
      expires = parsed;
    }
    if (!isValidStorageKey(key)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });

    const signedUrl = await createSignedUrlForKey(key, expires);
    return NextResponse.json({ signedUrl }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";


