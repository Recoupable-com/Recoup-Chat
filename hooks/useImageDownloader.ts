import { useState, useEffect } from "react";
import { fetchBlob } from "@/lib/files/fetchBlob";

interface UseImageDownloaderOptions {
  imageSrc: string | null;
  enabled?: boolean;
}

export function useImageDownloader({
  imageSrc,
  enabled = true,
}: UseImageDownloaderOptions) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);

  useEffect(() => {
    if (!imageSrc || !enabled) return;

    const prefetchImage = async () => {
      setIsPrefetching(true);
      try {
        const blob = await fetchBlob(imageSrc);
        setImageBlob(blob);
      } catch (error) {
        console.error("Error prefetching image:", error);
      } finally {
        setIsPrefetching(false);
      }
    };

    prefetchImage();
  }, [imageSrc, enabled]);

  const handleDownload = async () => {
    if (!imageSrc) return;

    setIsDownloading(true);

    try {
      // Use prefetched blob if available, otherwise fetch it
      const blob = imageBlob || (await fetchBlob(imageSrc));

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Format: "Recoup Image May 15, 2025, 09_59_47 PM"
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedTime = now
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        .replace(/:/g, "_");
      link.download = `Recoup Image ${formattedDate}, ${formattedTime}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    imageBlob,
    isDownloading,
    isPrefetching,
    isReady: !!imageBlob,
    handleDownload,
  };
}
