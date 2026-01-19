"use client";

import React from "react";
import { formatConnectorName } from "@/lib/connectors/formatConnectorName";
import { ComposioConnectedState } from "./ComposioConnectedState";
import { ComposioConnectPrompt } from "./ComposioConnectPrompt";

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
  const displayName = formatConnectorName(connector);

  if (status?.toLowerCase() === "active") {
    return <ComposioConnectedState displayName={displayName} />;
  }

  if (!redirectUrl) {
    return null;
  }

  return (
    <ComposioConnectPrompt
      displayName={displayName}
      redirectUrl={redirectUrl}
      connector={connector}
    />
  );
}

export default ComposioAuthResult;
