import { Tooltip } from "@/components/common/Tooltip";
import { cn } from "@/lib/utils";
import { Youtube } from "lucide-react";

const ChannelInfo = ({ dense }: { dense?: boolean }) => {
  return (
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
  );
};

export default ChannelInfo;
