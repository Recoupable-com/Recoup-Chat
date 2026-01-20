"use client";

import React from "react";
import { formatConnectorName } from "@/lib/composio/formatConnectorName";
import { ComposioConnectedState } from "./ComposioConnectedState";
import { ComposioConnectPrompt } from "./ComposioConnectPrompt";

interface ComposioResultEntry {
  toolkit?: string;
  status?: string;
  redirect_url?: string;
  instruction?: string;
}

interface ComposioAuthResultProps {
  result: unknown;
}

/**
 * Find the auth result entry that has redirect_url or active status.
 * Returns null if no valid auth result is found.
 */
function findAuthResult(
  results: Record<string, ComposioResultEntry> | undefined
): ComposioResultEntry | null {
  if (!results) return null;

  const entries = Object.values(results);
  return (
    entries.find(
      (r) => r.redirect_url || r.status?.toLowerCase() === "active"
    ) || null
  );
}

/**
 * Check if the result contains valid auth data.
 */
function hasValidAuthData(result: unknown): result is {
  data?: { results?: Record<string, ComposioResultEntry> };
} {
  if (!result || typeof result !== "object") return false;
  const r = result as { data?: { results?: unknown } };
  return r.data?.results !== undefined;
}

/**
 * Component to display Composio authentication result.
 * Shows different UI based on connection status:
 * - "Active": Shows connected confirmation
 * - "initiated": Shows connect button
 * Returns null if no valid auth result is found.
 */
export function ComposioAuthResult({ result }: ComposioAuthResultProps) {
  if (!hasValidAuthData(result)) {
    return null;
  }

  const authResult = findAuthResult(result.data?.results);
  if (!authResult) {
    return null;
  }

  const connector = authResult.toolkit || "Connector";
  const displayName = formatConnectorName(connector);

  if (authResult.status?.toLowerCase() === "active") {
    return <ComposioConnectedState displayName={displayName} />;
  }

  if (!authResult.redirect_url) {
    return null;
  }

  return (
    <ComposioConnectPrompt
      displayName={displayName}
      redirectUrl={authResult.redirect_url}
      connector={connector}
    />
  );
}

export default ComposioAuthResult;
