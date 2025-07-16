import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import useYoutubeStatus from "@/hooks/useYoutubeStatus";
import { useQuery } from "@tanstack/react-query";
import { Youtube, Eye, Video } from "lucide-react";
import StatCard from "./StatCard";

const ChatInputYoutubeButtonPopover = ({
  children,
  artistAccountId,
}: {
  children: React.ReactNode;
  artistAccountId: string;
}) => {
  const { data: youtubeStatus, isLoading } = useYoutubeStatus(artistAccountId);
  const { data: channelInfo, isLoading: isChannelInfoLoading } = useQuery({
    queryKey: ["youtube-channel-info", artistAccountId],
    queryFn: () =>
      fetch(
        `/api/youtube/channel-info?artist_account_id=${artistAccountId}`
      ).then((res) => res.json()),
    enabled:
      !!artistAccountId && youtubeStatus?.status === "valid" && !isLoading,
  });

  const channel = channelInfo?.channels?.[0];

  if (youtubeStatus?.status === "invalid" || isLoading || isChannelInfoLoading) {
    return children;
  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 rounded-xl overflow-hidden">
        {channel ? (
          <div className="bg-gradient-to-br from-red-50 to-red-100 border rounded-xl border-red-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white">
              <Youtube className="h-4 w-4" />
              <span className="font-medium text-sm">YouTube Channel</span>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <img
                  src={channel.thumbnails?.high?.url || channel.thumbnails?.medium?.url || channel.thumbnails?.default?.url}
                  alt={channel.title}
                  className="h-16 w-16 rounded-full object-cover border-2 border-red-200"
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
                      {channel.description.length > 100 ? channel.description.slice(0, 100) + "..." : channel.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <StatCard icon={Youtube} label="Subscribers" value={formatFollowerCount(channel.statistics?.subscriberCount || "0")} />
                <StatCard icon={Video} label="Videos" value={formatFollowerCount(channel.statistics?.videoCount || "0")} />
                <StatCard icon={Eye} label="Total Views" value={formatFollowerCount(channel.statistics?.viewCount || "0")} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-sm text-muted-foreground flex items-center gap-2">
            <Youtube className="h-4 w-4 text-red-600" />
            Loading channel info...
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ChatInputYoutubeButtonPopover;
