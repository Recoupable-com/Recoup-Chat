"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArtistConnectorInfo } from "@/hooks/useArtistConnectors";
import { cn } from "@/lib/utils";

interface TikTokCardProps {
  connector: ArtistConnectorInfo | undefined;
  onConnect: () => void;
  onDisconnect: (connectedAccountId: string) => void;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("h-5 w-5", className)}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const TikTokCard = ({ connector, onConnect, onDisconnect }: TikTokCardProps) => {
  const isConnected = connector?.isConnected ?? false;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TikTokIcon className="text-black dark:text-white" />
          <CardTitle className="text-base">TikTok</CardTitle>
        </div>
        <CardDescription>
          Connect your TikTok account to enable AI access to your TikTok stats, profile info, and video data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Connected
              </span>
            </div>
            <button
              type="button"
              onClick={() => connector?.connectedAccountId && onDisconnect(connector.connectedAccountId)}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="w-full px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Connect TikTok
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default TikTokCard;
