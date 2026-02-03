import { CheckCircle } from "lucide-react";

interface ArtistConnectorSuccessBannerProps {
  show: boolean;
  toolkit: string | null;
}

/**
 * Human-readable names for toolkit slugs.
 */
const TOOLKIT_NAMES: Record<string, string> = {
  tiktok: "TikTok",
};

/**
 * Success banner shown after completing an artist connector OAuth flow.
 */
export function ArtistConnectorSuccessBanner({
  show,
  toolkit,
}: ArtistConnectorSuccessBannerProps) {
  if (!show || !toolkit) return null;

  const toolkitName = TOOLKIT_NAMES[toolkit] || toolkit;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 shadow-lg animate-in slide-in-from-top-2">
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      <span className="text-sm font-medium text-green-800 dark:text-green-200">
        {toolkitName} connected successfully!
      </span>
    </div>
  );
}
