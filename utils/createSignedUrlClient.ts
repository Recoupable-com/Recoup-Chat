"use client";

export async function createSignedUrlClient(storageKey: string): Promise<string> {
  try {
    const res = await fetch("/api/storage/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storageKey }),
    });

    if (!res.ok) {
      console.error("Failed to fetch signed URL status:", res.status);
      return "";
    }

    const data = await res.json();
    return data.signedUrl || "";
  } catch (err) {
    console.error("Error fetching signed URL:", err);
    return "";
  }
}

export async function createBatchSignedUrlsClient(storageKeys: string[]): Promise<Record<string, string>> {
  if (storageKeys.length === 0) return {};
  
  try {
    const res = await fetch("/api/storage/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storageKeys }),
    });

    if (!res.ok) {
      console.error("Failed to fetch batch signed URLs status:", res.status);
      return {};
    }

    const data = await res.json();
    return data.signedUrls || {};
  } catch (err) {
    console.error("Error fetching batch signed URLs:", err);
    return {};
  }
}

