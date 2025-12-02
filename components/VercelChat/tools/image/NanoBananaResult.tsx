import Image from "next/image";
import { NanoBananaEditResult } from "@/lib/tools/nanoBanana/nanoBananaEdit";
import { useImageDownloader } from "@/hooks/useImageDownloader";
import MessageMediaDownloadButton from "../../MessageMediaDownloadButton";

interface NanoBananaResultProps {
  result: NanoBananaEditResult;
}

export function NanoBananaResult({ result }: NanoBananaResultProps) {
  const { isDownloading, isReady, handleDownload } = useImageDownloader({
    imageUrl: result.imageUrl,
    enabled: result.success,
  });

  if (!result.success) {
    return (
      <div className="w-full max-w-md mx-auto p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-sm font-medium text-red-600">🍌 Nano Banana Error</p>
        <p className="text-sm text-red-500">
          {result.error || "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-3">
      {result.imageUrl ? (
        <div className="border border-border rounded-2xl group cursor-pointer relative overflow-hidden max-w-md max-h-md">
          <div className="relative w-full h-full max-h-[28rem]">
            {/* Top gradient overlay */}
            <div className="absolute z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus-within:opacity-100 end-0 top-0 w-full">
              <div className="bg-gradient-to-t from-transparent to-black/30 h-20 w-full md:rounded-t-2xl" />
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus-within:opacity-100 end-0 bottom-0 w-full">
              <div className="bg-gradient-to-b from-transparent to-black/30 h-20 w-full md:rounded-b-2xl" />
            </div>

            {/* Download Image Button */}
            <MessageMediaDownloadButton
              onClick={handleDownload}
              overrideButtonClassName="hover:bg-muted/10"
              overrideIconClassName="text-white"
              isReady={isReady}
              isDownloading={isDownloading}
            />

            <div className="w-full h-auto max-w-md max-h-md">
              <Image
                src={result.imageUrl}
                alt="Nano Banana generated/edited image"
                width={448}
                height={448}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "28rem",
                  maxHeight: "28rem",
                  objectFit: "contain",
                }}
                priority
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-border rounded-md bg-muted max-w-md">
          <p className="text-sm text-muted-foreground">
            🍌 {result.message || "Image generated but URL not available."}
          </p>
        </div>
      )}
    </div>
  );
}
