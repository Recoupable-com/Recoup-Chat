import React from "react";
import { Youtube } from "lucide-react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useYouTubeLoginSuccess } from "@/hooks/useYouTubeLoginSuccess";
import { ConnectYouTubeButton } from "@/components/common/ConnectYouTubeButton";

export interface YouTubeErrorDisplayProps {
  errorMessage: string;
}

export function YouTubeErrorDisplay({
  errorMessage,
}: YouTubeErrorDisplayProps) {
  const { selectedArtist } = useArtistProvider();
  
  // Hook that automatically continues conversation after successful YouTube OAuth
  useYouTubeLoginSuccess();

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-muted border border-border my-2 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">
          YouTube Access Required
        </span>

        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
          Live
        </span>
      </div>

      {/* Artist Context */}
      <div className="text-xs text-muted-foreground">
        Artist: <span className="font-medium">{selectedArtist?.account_id}</span>
      </div>

      {/* Message */}
      <p className="text-sm text-muted-foreground">{errorMessage}</p>

      {/* Login Button */}
      <ConnectYouTubeButton
        accountId={selectedArtist?.account_id}
        className="w-full"
        size="sm"
        disabled={!selectedArtist?.account_id}
      />

      <p className="text-xs text-muted-foreground text-center">
        You&apos;ll be redirected to Google to authorize access to your YouTube
        channel for this artist.
      </p>
    </div>
  );
}
