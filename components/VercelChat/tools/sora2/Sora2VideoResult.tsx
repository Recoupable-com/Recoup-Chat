import { RetrieveVideoContentResult } from "@/lib/tools/sora2/retrieveVideoContent";
import { Download, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Sora2VideoResultProps {
  result: RetrieveVideoContentResult;
}

export function Sora2VideoResult({ result }: Sora2VideoResultProps) {
  if (!result.success) {
    return (
      <div className="flex flex-col gap-2 py-2 text-sm text-destructive">
        <p>{result.error || "Failed to retrieve video"}</p>
      </div>
    );
  }

  const handleDownload = () => {
    if (!result.videoUrl) return;

    const link = document.createElement("a");
    link.href = result.videoUrl;
    link.download = `sora-video-${result.video_id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2 text-sm">
        <Video className="h-4 w-4 text-primary" />
        <span className="font-medium">Video Generated</span>
        <span className="text-muted-foreground">• {result.sizeInMB}</span>
      </div>

      {result.videoUrl ? (
        <>
          <video
            controls
            className="w-full max-w-2xl rounded-lg border shadow-sm"
            src={result.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="w-fit"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Video
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{result.message}</p>
      )}
    </div>
  );
}

