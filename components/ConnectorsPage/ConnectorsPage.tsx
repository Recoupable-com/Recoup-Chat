"use client";

import { Fragment } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Plug, CheckCircle, RefreshCw } from "lucide-react";
import { useUserProvider } from "@/providers/UserProvder";
import { useConnectors } from "@/hooks/useConnectors";
import { ConnectorCard } from "./ConnectorCard";

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
      {showSuccess && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Connector enabled successfully!
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Plug className="h-6 w-6" />
            Connectors
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect your tools to enable AI-powered automation
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw
            className={`h-5 w-5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-10">
          {connected.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Installed Connectors</h2>
                <p className="text-sm text-muted-foreground">
                  Connected tools provide richer and more accurate answers,
                  gated by permissions you have granted.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {connected.map((connector) => (
                  <ConnectorCard
                    key={connector.slug}
                    connector={connector}
                    onConnect={authorize}
                    onDisconnect={disconnect}
                  />
                ))}
              </div>
            </section>
          )}

          {available.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Available Connectors</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your tools to search across them and take action. Your
                  permissions are always respected.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {available.map((connector) => (
                  <ConnectorCard
                    key={connector.slug}
                    connector={connector}
                    onConnect={authorize}
                    onDisconnect={disconnect}
                  />
                ))}
              </div>
            </section>
          )}

          {connectors.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No connectors available.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
