import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import { YouTubeChannelData } from "@/types/youtube";

export const MobilePopoverContent = ({ channel }: { channel: YouTubeChannelData }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
    {channel ? (
      <div className="bg-white">
        {/* Header with YouTube branding */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <img
            src="/brand-logos/youtube.png"
            alt="YouTube"
            className="h-4 w-4"
          />
          <span className="font-medium text-gray-900 text-xs">
            YouTube Channel
          </span>
        </div>

        {/* Channel info */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={
                channel.thumbnails?.default?.url ||
                channel.thumbnails?.medium?.url ||
                ""
              }
              alt={channel.title || "YouTube Channel"}
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {channel.title}
              </h3>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              {formatFollowerCount(Number(channel.statistics?.subscriberCount || "0"))}{" "}
              subs
            </span>
            <span>
              {formatFollowerCount(Number(channel.statistics?.videoCount || "0"))}{" "}
              videos
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-3 text-sm text-gray-600 flex items-center gap-2">
        <img src="/brand-logos/youtube.png" alt="YouTube" className="h-4 w-4" />
        Loading...
      </div>
    )}
  </div>
);
