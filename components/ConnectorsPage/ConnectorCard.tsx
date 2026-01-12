"use client";

import { useState } from "react";
import {
  Link2,
  Loader2,
  MoreVertical,
  RefreshCw,
  Unlink,
  CheckCircle,
} from "lucide-react";
import {
  SiGooglesheets,
  SiGoogledrive,
  SiGoogledocs,
  SiGooglecalendar,
  SiGmail,
  SiSlack,
  SiGithub,
  SiNotion,
  SiLinear,
  SiJira,
  SiAirtable,
  SiHubspot,
  SiSupabase,
  SiX,
} from "@icons-pack/react-simple-icons";
import { Mail, Globe } from "lucide-react";
import { ConnectorInfo } from "@/hooks/useConnectors";
import { getConnectorMeta } from "@/lib/connectors/connectorMetadata";
import { formatConnectorName } from "@/lib/connectors/formatConnectorName";
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
 * Get branded icon for a connector.
 * Uses Simple Icons for brand logos, falls back to Lucide for others.
 */
function getConnectorIcon(slug: string, size = 24) {
  const iconProps = { size, className: "flex-shrink-0" };

  const icons: Record<string, React.ReactNode> = {
    googlesheets: <SiGooglesheets {...iconProps} color="#34A853" />,
    googledrive: <SiGoogledrive {...iconProps} color="#4285F4" />,
    googledocs: <SiGoogledocs {...iconProps} color="#4285F4" />,
    googlecalendar: <SiGooglecalendar {...iconProps} color="#4285F4" />,
    gmail: <SiGmail {...iconProps} color="#EA4335" />,
    outlook: <Mail size={size} className="flex-shrink-0 text-[#0078D4]" />,
    slack: <SiSlack {...iconProps} color="#4A154B" />,
    github: <SiGithub {...iconProps} className="flex-shrink-0 dark:text-white" />,
    notion: <SiNotion {...iconProps} className="flex-shrink-0 dark:text-white" />,
    linear: <SiLinear {...iconProps} color="#5E6AD2" />,
    jira: <SiJira {...iconProps} color="#0052CC" />,
    airtable: <SiAirtable {...iconProps} color="#18BFFF" />,
    hubspot: <SiHubspot {...iconProps} color="#FF7A59" />,
    supabase: <SiSupabase {...iconProps} color="#3FCF8E" />,
    twitter: <SiX {...iconProps} className="flex-shrink-0 dark:text-white" />,
    perplexityai: <Globe size={size} className="flex-shrink-0 text-[#20B8CD]" />,
  };

  return icons[slug] || <Link2 size={size} className="flex-shrink-0 text-muted-foreground" />;
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
      <div className="flex-shrink-0 p-2.5 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
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

      <div className="flex-shrink-0">
        {connector.isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              Connected
              <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
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
