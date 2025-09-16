import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import { FileAccessResult, CombinedFileRow } from "@/types/files";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerAccountId = searchParams.get("ownerAccountId");
    const artistAccountId = searchParams.get("artistAccountId");
    const path = searchParams.get("path") || "";

    if (!ownerAccountId || !artistAccountId) {
      return NextResponse.json({ error: "Missing ownerAccountId or artistAccountId" }, { status: 400 });
    }

    // Query 1: Files directly owned by the artist
    const { data: ownedFiles, error: ownedError } = await supabase
      .from("files")
      .select("id,file_name,storage_key,mime_type,is_directory,created_at")
      .eq("owner_account_id", ownerAccountId)
      .eq("artist_account_id", artistAccountId)
      .ilike("storage_key", path ? `${path}%` : "%")
      .order("created_at", { ascending: false });

    if (ownedError) {
      return NextResponse.json({ error: ownedError.message }, { status: 500 });
    }

    // Query 2: Files granted access to the artist
    const { data: accessData, error: accessError } = await supabase
      .from("file_access")
      .select(`
        file_id,
        artist_account_id,
        scope,
        created_at,
        files!inner (
          id,
          file_name,
          storage_key,
          mime_type,
          is_directory,
          created_at
        )
      `)
      .eq("artist_account_id", artistAccountId)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });

    if (accessError) {
      return NextResponse.json({ error: accessError.message }, { status: 500 });
    }

    // Process granted access files - show when browsing artist's root directory
    const grantedFiles = (accessData as unknown as FileAccessResult[] || [])
      .filter(() => {
        // Shared files appear when browsing the artist's root directory
        // This includes when no path is specified or when path is the artist's base path
        const expectedBasePath = `files/${ownerAccountId}/${artistAccountId}/`;
        const expectedBasePathNoSlash = `files/${ownerAccountId}/${artistAccountId}`;

        const isAtRoot = !path || path === "" || path === expectedBasePath || path === expectedBasePathNoSlash;

        return isAtRoot;
      })
      .map((access) => ({
        ...access.files,
        access_granted_at: access.created_at,
        scope: access.scope,
        is_shared: true,
      }));

    // Combine owned and granted files
    const allFiles = [
      ...(ownedFiles || []).map(file => ({ ...file, is_shared: false })),
      ...grantedFiles
    ];

    // Remove duplicates (prefer owned files over shared ones)
    const fileMap = new Map<string, CombinedFileRow>();
    allFiles.forEach((file) => {
      const existing = fileMap.get(file.id);
      if (!existing || !existing.is_shared) {
        fileMap.set(file.id, file);
      }
    });

    const combinedFiles = Array.from(fileMap.values());

    // Filter to immediate children client-side (single level)
    const base = path && path.endsWith("/") ? path : path ? path + "/" : "";
    const files = combinedFiles.filter((row) => {
      // For shared files, they appear at the current level regardless of their storage_key
      if (row.is_shared) {
        return true; // Always include shared files at current browsing level
      }

      // For owned files, use normal path filtering
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


