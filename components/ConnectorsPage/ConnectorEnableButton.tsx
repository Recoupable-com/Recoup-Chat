import { Loader2 } from "lucide-react";

interface ConnectorEnableButtonProps {
  isConnecting: boolean;
  onClick: () => void;
}

export function ConnectorEnableButton({
  isConnecting,
  onClick,
}: ConnectorEnableButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
    >
      {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
      Enable
    </button>
  );
}
