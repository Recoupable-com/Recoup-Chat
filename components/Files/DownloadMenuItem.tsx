"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

type DownloadMenuItemProps = {
  storageKey: string;
  fileName: string;
};

export default function DownloadMenuItem({
  storageKey,
  fileName,
}: DownloadMenuItemProps) {
  const handleDownload = async () => {
    if (!storageKey) return;
    try {
      const res = await fetch(
        `/api/files/get-signed-url?key=${encodeURIComponent(storageKey)}`
      );
      if (!res.ok) throw new Error("Failed to get signed URL");
      const { signedUrl } = (await res.json()) as { signedUrl: string };

      // Fetch file as Blob to force OS save dialog
      const fileRes = await fetch(signedUrl);
      if (!fileRes.ok) throw new Error("Failed to fetch file");
      const blob = await fileRes.blob();

      // Attempt to derive filename from headers
      const disposition = fileRes.headers.get("content-disposition") || "";
      let name = fileName || "download";
      const cdMatch = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
      if (cdMatch) {
        const candidate = decodeURIComponent(cdMatch[1] ?? cdMatch[2]);
        if (candidate) name = candidate;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
        console.error("Error downloading file", error);
    }
  };

  return (
    <DropdownMenuItem onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download
    </DropdownMenuItem>
  );
}
