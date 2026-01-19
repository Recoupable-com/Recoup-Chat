import { Plug, RefreshCw } from "lucide-react";

interface ConnectorsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function ConnectorsHeader({ onRefresh, isLoading }: ConnectorsHeaderProps) {
  return (
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
        onClick={onRefresh}
        disabled={isLoading}
        className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw
          className={`h-5 w-5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}
