"use client";

import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistConnectors } from "@/hooks/useArtistConnectors";
import { Skeleton } from "@/components/ui/skeleton";
import YouTubeCard from "./YouTubeCard";
import TikTokCard from "./TikTokCard";

const ConnectionsTab = () => {
  const { editableArtist } = useArtistProvider();
  const artistId = editableArtist?.account_id;

  const { connectors, isLoading, authorize, disconnect } = useArtistConnectors(artistId);

  const tiktokConnector = connectors.find((c) => c.slug === "tiktok");

  const handleTikTokConnect = async () => {
    const redirectUrl = await authorize("tiktok");
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleTikTokDisconnect = async (connectedAccountId: string) => {
    await disconnect(connectedAccountId);
  };

  if (!artistId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          No artist selected.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect external accounts to enable additional AI capabilities.
        </p>
        <div className="grid gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect external accounts to enable additional AI capabilities.
      </p>
      <div className="grid gap-4">
        <YouTubeCard artistId={artistId} />
        <TikTokCard
          connector={tiktokConnector}
          onConnect={handleTikTokConnect}
          onDisconnect={handleTikTokDisconnect}
        />
      </div>
    </div>
  );
};

export default ConnectionsTab;
