"use client";

import { useState } from "react";
import { Loader2, MoreVertical, RefreshCw, Unlink, CheckCircle } from "lucide-react";
import { ConnectorInfo } from "@/hooks/useConnectors";
import { getConnectorMeta } from "@/lib/connectors/connectorMetadata";
import { formatConnectorName } from "@/lib/connectors/formatConnectorName";
import { getConnectorIcon } from "@/lib/connectors/getConnectorIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectorCardProps {
  connector: ConnectorInfo;
  onConnect: (slug: string) => Promise<string | null>;
  onDisconnect: (connectedAccountId: string) => Promise<boolean>;
}

/**
 * Card component for a single connector.
 * Uses branded icons from Simple Icons.
 */
export function ConnectorCard({
  connector,
  onConnect,
  onDisconnect,
}: ConnectorCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const meta = getConnectorMeta(connector.slug);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const redirectUrl = await onConnect(connector.slug);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connector.connectedAccountId) return;

    setIsDisconnecting(true);
    try {
      await onDisconnect(connector.connectedAccountId);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm transition-all duration-200">
      <div className="shrink-0 p-2.5 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
        {getConnectorIcon(connector.slug, 22)}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">
          {formatConnectorName(connector.name, connector.slug)}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {meta.description}
        </p>
      </div>

      <div className="shrink-0">
        {connector.isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              Connected
              <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="Connector options"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleConnect}
                  className="cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
            Enable
          </button>
        )}
      </div>
    </div>
  );
}
