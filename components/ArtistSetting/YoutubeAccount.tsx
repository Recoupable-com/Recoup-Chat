import useYoutubeStatus from "@/hooks/useYoutubeStatus";
import { ConnectYouTubeButton } from "../common/ConnectYouTubeButton";
import { Youtube } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Tooltip } from "../common/Tooltip";

interface StandaloneYoutubeComponentProps {
  artistAccountId?: string;
  dense?: boolean;
}

const StandaloneYoutubeComponent = ({
  artistAccountId,
  dense,
}: StandaloneYoutubeComponentProps) => {
  const { data, isLoading } = useYoutubeStatus(artistAccountId);

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col gap-1">
          <label
            className={cn("text-sm", {
              hidden: dense,
            })}
          >
            YouTube
          </label>
          <div className="flex items-center p-2 rounded-full bg-gray-50 border border-gray-200">
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
        <Tooltip content="Connected to YouTube">
          <div className="flex flex-col gap-1 cursor-pointer">
            <label
              className={cn("text-sm", {
                hidden: dense,
              })}
            >
              YouTube
            </label>
            <div
              className={cn(
                "flex items-center p-2 rounded-lg bg-red-50 border border-red-200",
                {
                  "rounded-full": dense,
                }
              )}
            >
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
                Connected to YouTube
              </span>
            </div>
          </div>
        </Tooltip>
      ) : (
        <Tooltip content="Connect YouTube Account">
          <div className="flex flex-col gap-1.5">
            <label
              className={cn("text-sm", {
                hidden: dense,
              })}
            >
              YouTube
            </label>
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
