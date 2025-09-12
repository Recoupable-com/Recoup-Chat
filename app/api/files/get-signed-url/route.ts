import { NextResponse } from "next/server";
import isValidStorageKey from "@/utils/isValidStorageKey";
import { createSignedUrlForKey } from "@/lib/supabase/storage/createSignedUrl";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || "";
    const expiresParam = searchParams.get("expires");
    const ONE_WEEK = 7 * 24 * 60 * 60; // 604800 seconds
    const expires = Math.min(
      ONE_WEEK,
      Math.max(60, Number.isFinite(Number(expiresParam)) ? Number(expiresParam) : ONE_WEEK)
    );
    if (!isValidStorageKey(key)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });

    const signedUrl = await createSignedUrlForKey(key, expires);
    return NextResponse.json({ signedUrl }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";


