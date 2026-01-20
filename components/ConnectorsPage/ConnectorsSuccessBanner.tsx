import { CheckCircle } from "lucide-react";

interface ConnectorsSuccessBannerProps {
  show: boolean;
}

export function ConnectorsSuccessBanner({ show }: ConnectorsSuccessBannerProps) {
  if (!show) return null;

  return (
    <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 animate-in slide-in-from-top-2">
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      <span className="text-sm font-medium text-green-800 dark:text-green-200">
        Connector enabled successfully!
      </span>
    </div>
  );
}
