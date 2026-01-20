"use client";

import { Fragment, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import { useConnectors } from "@/hooks/useConnectors";
import { ConnectorsSuccessBanner } from "./ConnectorsSuccessBanner";
import { ConnectorsErrorBanner } from "./ConnectorsErrorBanner";
import { ConnectorsLoadingState } from "./ConnectorsLoadingState";
import { ConnectorsEmptyState } from "./ConnectorsEmptyState";
import { ConnectorsSection } from "./ConnectorsSection";
import { ConnectorsHeader } from "./ConnectorsHeader";

/**
 * Main connectors page component.
 * Redesigned to match Perplexity's Connectors style.
 */
export function ConnectorsPage() {
  const { userData } = useUserProvider();
  const { ready } = usePrivy();
  const { connectors, isLoading, error, refetch, authorize, disconnect } =
    useConnectors();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      setShowSuccess(true);
      refetch();
      window.history.replaceState({}, "", "/settings/connectors");
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, refetch]);

  if (!ready) return <Fragment />;

  if (!userData?.account_id) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">
          Please sign in to manage connectors.
        </p>
      </div>
    );
  }

  const connected = connectors.filter((c) => c.isConnected);
  const available = connectors.filter((c) => !c.isConnected);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <ConnectorsSuccessBanner show={showSuccess} />
      <ConnectorsHeader onRefresh={refetch} isLoading={isLoading} />
      <ConnectorsErrorBanner error={error} />

      {isLoading ? (
        <ConnectorsLoadingState />
      ) : (
        <div className="space-y-10">
          <ConnectorsSection
            title="Installed Connectors"
            description="Connected tools provide richer and more accurate answers, gated by permissions you have granted."
            connectors={connected}
                    onConnect={authorize}
                    onDisconnect={disconnect}
                  />
          <ConnectorsSection
            title="Available Connectors"
            description="Connect your tools to search across them and take action. Your permissions are always respected."
            connectors={available}
                    onConnect={authorize}
                    onDisconnect={disconnect}
                  />
          {connectors.length === 0 && <ConnectorsEmptyState />}
        </div>
      )}
    </main>
  );
}
