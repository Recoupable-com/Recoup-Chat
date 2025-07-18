import { Youtube, Eye, Video } from "lucide-react";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import StatCard from "./StatCard";
import { YouTubeChannelData } from "@/types/youtube";

export const DesktopPopoverContent = ({ channel }: { channel: YouTubeChannelData }) => (
  <div className="w-80 p-0 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-md">
    {channel ? (
      <div className="bg-white">
        {/* Header with YouTube branding */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <img
            src="/brand-logos/youtube.png"
            alt="YouTube"
            className="h-5 w-5"
          />
          <span className="font-medium text-gray-900 text-sm">
            YouTube Channel
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <img
              src={
                channel.thumbnails?.high?.url ||
                channel.thumbnails?.medium?.url ||
                channel.thumbnails?.default?.url ||
                ""
              }
              alt={channel.title || "YouTube Channel"}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {channel.title}
              </h3>
              {channel.customUrl && (
                <p className="text-red-600 text-sm font-medium">
                  {channel.customUrl}
                </p>
              )}
              {channel.description && (
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {channel.description.length > 100
                    ? channel.description.slice(0, 100) + "..."
                    : channel.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StatCard
              icon={Youtube}
              label="Subscribers"
              value={formatFollowerCount(
                Number(channel.statistics?.subscriberCount || "0")
              )}
            />
            <StatCard
              icon={Video}
              label="Videos"
              value={formatFollowerCount(Number(channel.statistics?.videoCount || "0"))}
            />
            <StatCard
              icon={Eye}
              label="Total Views"
              value={formatFollowerCount(Number(channel.statistics?.viewCount || "0"))}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="p-4 text-sm text-gray-600 flex items-center gap-2">
        <img src="/brand-logos/youtube.png" alt="YouTube" className="h-4 w-4" />
        Loading channel info...
      </div>
    )}
  </div>
);
