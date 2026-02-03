"use client";

import { useState } from "react";
import { Loader2, MoreVertical, RefreshCw, Unlink, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArtistConnectorInfo } from "@/hooks/useArtistConnectors";
import { cn } from "@/lib/utils";

interface TikTokCardProps {
  connector: ArtistConnectorInfo | undefined;
  onConnect: () => Promise<string | null>;
  onDisconnect: (connectedAccountId: string) => Promise<boolean>;
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  const isConnected = connector?.isConnected ?? false;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const redirectUrl = await onConnect();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleReconnect = async () => {
    await handleConnect();
  };

  const handleDisconnect = async () => {
    if (!connector?.connectedAccountId) return;

    setIsDisconnecting(true);
    try {
      await onDisconnect(connector.connectedAccountId);
    } finally {
      setIsDisconnecting(false);
      setShowDisconnectDialog(false);
    }
  };

  return (
    <>
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
          {isConnecting ? (
            <div className="flex items-center justify-center gap-2 px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Connecting...</span>
            </div>
          ) : isConnected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Connected
                  <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="TikTok options"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleReconnect} className="cursor-pointer">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reconnect
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDisconnectDialog(true)}
                    className="cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Connect TikTok
            </button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect TikTok?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the TikTok connection for this artist. The AI will no longer be able to access TikTok stats or data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDisconnecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TikTokCard;
