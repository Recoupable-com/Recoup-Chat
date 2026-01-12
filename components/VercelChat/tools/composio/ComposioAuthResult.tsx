"use client";

import React from "react";
import { FileSpreadsheet, Link2, CheckCircle } from "lucide-react";
import { formatConnectorName } from "@/lib/connectors/formatConnectorName";

interface ComposioAuthResultProps {
  result: {
    data?: {
      results?: Record<
        string,
        {
          toolkit?: string;
          status?: string;
          redirect_url?: string;
          instruction?: string;
        }
      >;
    };
  };
}

/**
 * Component to display Composio authentication result.
 * Shows different UI based on connection status:
 * - "Active": Shows connected confirmation
 * - "initiated": Shows connect button
 */
export function ComposioAuthResult({ result }: ComposioAuthResultProps) {
  const results = result?.data?.results;
  const firstResult = results ? Object.values(results)[0] : null;
  const redirectUrl = firstResult?.redirect_url;
  const connector = firstResult?.toolkit || "Connector";
  const status = firstResult?.status;

  const getIcon = (className = "h-5 w-5") => {
    if (connector.toLowerCase().includes("sheet")) {
      return <FileSpreadsheet className={className} />;
    }
    return <Link2 className={className} />;
  };

  const displayName = formatConnectorName(connector);

  // CONNECTED STATE: Status is "Active"
  if (status?.toLowerCase() === "active") {
    return (
      <div className="flex flex-col space-y-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 my-2 max-w-md">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="font-medium text-green-800 dark:text-green-200">
            {displayName} Connected
          </span>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your {displayName} account is connected and ready to use.
        </p>
      </div>
    );
  }

  // NEEDS CONNECTION STATE: Has redirect URL
  if (!redirectUrl) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-muted border border-border my-2 max-w-md">
      <div className="flex items-center space-x-2">
        {getIcon("h-5 w-5 text-muted-foreground")}
        <span className="font-medium text-foreground">
          {displayName} Access Required
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Connect your {displayName} account to enable this connector.
      </p>

      <a
        href={redirectUrl}
        onClick={(e) => {
          e.preventDefault();
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }}
        className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
      >
        {getIcon("h-4 w-4")}
        <span className="ml-2">Connect {displayName}</span>
      </a>

      <p className="text-xs text-muted-foreground text-center">
        You&apos;ll be redirected to authorize access. Link expires in 10
        minutes.
      </p>
    </div>
  );
}

export default ComposioAuthResult;
