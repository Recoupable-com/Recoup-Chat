import useYoutubeStatus from "@/hooks/useYoutubeStatus";
import { ConnectYouTubeButton } from "../common/ConnectYouTubeButton";
import { Youtube } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface StandaloneYoutubeComponentProps {
  artistAccountId?: string;
}

const StandaloneYoutubeComponent = ({
  artistAccountId,
}: StandaloneYoutubeComponentProps) => {
  const { data, isLoading } = useYoutubeStatus(artistAccountId);

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col gap-1">
          <label className="text-sm">YouTube</label>
          <div className="flex items-center p-2 rounded-lg bg-gray-50 border border-gray-200">
            <Skeleton className="h-4 w-4 mr-2 rounded" />
            <Skeleton className="h-4 flex-1 max-w-32" />
          </div>
        </div>
      ) : data?.status === "valid" ? (
        <div className="flex flex-col gap-1">
          <label className="text-sm">YouTube</label>
          <div className="flex items-center p-2 rounded-lg bg-red-50 border border-red-200">
            <Youtube className="h-4 w-4 mr-2 text-red-600" />
            <span className="text-red-800 font-medium text-sm">
              Connected to YouTube
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm">YouTube</label>
          <ConnectYouTubeButton
            accountId={artistAccountId}
            className="w-full"
            size="sm"
            disabled={!artistAccountId}
          />
        </div>
      )}
    </div>
  );
};

export default StandaloneYoutubeComponent;
