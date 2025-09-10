import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/consts";

function isValidKey(key: string): boolean {
  if (!key || key.length > 1024) return false;
  if (key.startsWith("/")) return false;
  if (key.includes("..")) return false;
  if (key.includes("\\")) return false;
  return true;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const key = formData.get("key");
    const file = formData.get("file");

    if (typeof key !== "string" || !isValidKey(key)) {
      return NextResponse.json({ error: "Invalid or missing key" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const { error: uploadError } = await supabase
      .storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(key, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    return NextResponse.json({ path: key }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


