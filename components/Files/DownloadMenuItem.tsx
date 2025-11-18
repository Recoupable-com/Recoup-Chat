"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUserProvider } from "@/providers/UserProvder";

type DownloadMenuItemProps = {
  storageKey: string;
  fileName: string;
};

export default function DownloadMenuItem({
  storageKey,
  fileName,
}: DownloadMenuItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUserProvider();

  const handleDownload = async () => {
    if (!storageKey || isLoading) return;
    try {
      setIsLoading(true);
      toast.info("Preparing download...", {
        description: `Starting download of ${fileName}`,
      });
      
      const res = await fetch(
        `/api/files/get-signed-url?key=${encodeURIComponent(storageKey)}&accountId=${encodeURIComponent(userData?.account_id || "")}`
      );
      if (!res.ok) throw new Error("Failed to get signed URL");
      const { signedUrl } = (await res.json()) as { signedUrl: string };

      // Fetch as Blob to force OS save dialog
      const fileRes = await fetch(signedUrl);
      if (!fileRes.ok) throw new Error("Failed to fetch file");
      const blob = await fileRes.blob();

      // Create blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      
      toast.success("Download started", {
        description: `Your browser should now prompt you to save ${fileName}`,
      });
    } catch (error) {
      console.error("Error downloading file", error);
      toast.error("Download failed", {
        description: "Unable to download the file. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenuItem onClick={handleDownload} disabled={isLoading} aria-disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Preparing..." : "Download"}
    </DropdownMenuItem>
  );
}
