import { Loader2, MoreVertical, RefreshCw, Unlink, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectorConnectedMenuProps {
  isDisconnecting: boolean;
  onReconnect: () => void;
  onDisconnect: () => void;
}

export function ConnectorConnectedMenu({
  isDisconnecting,
  onReconnect,
  onDisconnect,
}: ConnectorConnectedMenuProps) {
  return (
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
          <DropdownMenuItem onClick={onReconnect} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconnect
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDisconnect}
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
  );
}
