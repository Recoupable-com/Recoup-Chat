import useYoutubeStatus from "@/hooks/useYoutubeStatus";
import { ConnectYouTubeButton } from "../../common/ConnectYouTubeButton";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";
import { Tooltip } from "../../common/Tooltip";
import ChannelInfo from "./ChannelInfo";

interface StandaloneYoutubeComponentProps {
  artistAccountId: string;
  dense?: boolean;
}

const StandaloneYoutubeComponent = ({
  artistAccountId,
  dense,
}: StandaloneYoutubeComponentProps) => {
  const { data, isLoading } = useYoutubeStatus(artistAccountId);

  const label = () => (
    <label
      className={cn("text-sm", {
        hidden: dense,
      })}
    >
      Youtube
    </label>
  );

  return (
    <div className="w-full relative">
      {isLoading ? (
        <div className="flex flex-col gap-1">
          {label()}
          <div
            className={cn(
              "flex items-center p-2 rounded-lg bg-muted border border-gray-200",
              {
                "rounded-full": dense,
              }
            )}
          >
            <Skeleton
              className={cn("h-4 w-4 mr-2 rounded", {
                "mr-0": dense,
              })}
            />
            <Skeleton
              className={cn("h-4 flex-1 max-w-32", {
                hidden: dense,
              })}
            />
          </div>
        </div>
      ) : data?.status === "valid" ? (
        <ChannelInfo dense={dense} artistAccountId={artistAccountId} />
      ) : (
        <Tooltip content="Connect YouTube Account">
          <div className="flex flex-col gap-1.5">
            {label()}
            <ConnectYouTubeButton
              accountId={artistAccountId}
              className="w-full"
              size="sm"
              disabled={!artistAccountId}
              dense={dense}
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default StandaloneYoutubeComponent;
