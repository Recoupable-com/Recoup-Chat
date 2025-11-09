import { Clock } from "lucide-react";
import useArtistImage from "@/hooks/useArtistImage";

interface TaskArtistImageProps {
  artistAccountId?: string | null;
}

const TaskArtistImage: React.FC<TaskArtistImageProps> = ({
  artistAccountId,
}) => {
  const { imageUrl, artistName } = useArtistImage(artistAccountId);

  if (!imageUrl) {
    return (
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={artistName ?? "Artist avatar"}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default TaskArtistImage;
