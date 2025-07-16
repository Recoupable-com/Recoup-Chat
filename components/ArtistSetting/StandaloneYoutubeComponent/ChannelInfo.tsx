import { Tooltip } from "@/components/common/Tooltip";
import { cn } from "@/lib/utils";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import { useQuery } from "@tanstack/react-query";
import { Youtube } from "lucide-react";

const ChannelInfo = ({ dense, artistAccountId }: { dense?: boolean; artistAccountId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["youtube-channel-info", artistAccountId],
    queryFn: () =>
      fetch(
        `/api/youtube/channel-info?artist_account_id=${artistAccountId}`
      ).then((res) => res.json()),
  });

  const channel = data?.channels?.[0];

  return (
    <Tooltip
      content={
        channel ? `Connected to ${channel.title}` : "Connected to YouTube"
      }
    >
      <div className="flex flex-col gap-1 cursor-pointer">
        <label className={cn("text-sm", { hidden: dense })}>
          YouTube
        </label>
        <div className={cn("flex items-center px-2 py-1 rounded-lg bg-red-50 border border-red-200", {"rounded-full px-1": dense})}>
          {isLoading && (
            <>
              <Youtube
                className={cn("h-4 w-4 mr-2 text-red-600", {
                  "mr-0": dense,
                })}
              />
              <span
                className={cn("text-red-800 font-medium text-sm", {
                  hidden: dense,
                })}
              >
                Loading...
              </span>
            </>
          )}
          {channel && (
            <>
              {channel.thumbnails?.default?.url ? (
                <img
                  src={channel.thumbnails.default.url}
                  alt={channel.title}
                  className={cn("h-4 w-4 mr-2 rounded-full object-cover", { "mr-0": dense })}
                />
              ) : (
                <Youtube className={cn("h-4 w-4 mr-2 text-red-600", { "mr-0": dense })} />
              )}
              <div className={cn("flex flex-col", { hidden: dense })}>
                <span className="text-red-800 font-medium text-xs truncate">
                  {channel.title}
                </span>
                <span className="text-red-600 text-[10px]">
                  {formatFollowerCount(channel.statistics?.subscriberCount || "0")} subscribers
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default ChannelInfo;
