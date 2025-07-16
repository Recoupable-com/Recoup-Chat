import useYoutubeStatus from "@/hooks/useYoutubeStatus";
import { ConnectYouTubeButton } from "../../common/ConnectYouTubeButton";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";
import { Tooltip } from "../../common/Tooltip";
import ChannelInfo from "./ChannelInfo";
import Arrow from "@/public/youtube-arrow.png";
import Image from "next/image";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

interface StandaloneYoutubeComponentProps {
  artistAccountId: string;
  dense?: boolean;
  hideArrow?: boolean;
}

const StandaloneYoutubeComponent = ({
  artistAccountId,
  dense,
  hideArrow = false,
}: StandaloneYoutubeComponentProps) => {
  const { data, isLoading } = useYoutubeStatus(artistAccountId);

  return (
    <div className="w-full relative">
      {isLoading ? (
        <div className="flex flex-col gap-1">
          <label
            className={cn("text-sm", {
              hidden: dense,
            })}
          >
            YouTube
          </label>
          <div
            className={cn(
              "flex items-center p-2 rounded-lg bg-gray-50 border border-gray-200",
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
      {/* Graphic Arrow */}
      {data?.status === "invalid" && !isLoading && !hideArrow && (
      <div className="absolute w-[10rem] right-[-8rem] top-[-2.5rem] opacity-[0.8] pointer-events-none">
        <Image src={Arrow} alt="Youtube Arrow" className="w-full rotate-[10deg] scale-y-[0.8] opacity-[0.8]" />
        <span className={cn("text-black absolute top-[4rem] left-[7rem] whitespace-nowrap rotate-[351deg] text-[1rem]", caveat.className)}>
          Get Youtube Insights
          </span>
        </div>
      )}
    </div>
  );
};

export default StandaloneYoutubeComponent;
