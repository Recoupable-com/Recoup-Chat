import { Clock } from "lucide-react";
import useArtistImage from "@/hooks/useArtistImage";

interface TaskArtistImageProps {
  artistAccountId?: string | null;
}

const TaskArtistImage: React.FC<TaskArtistImageProps> = ({
  artistAccountId,
}) => {
  const { imageUrl, artistName } = useArtistImage(artistAccountId);

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={artistName ?? "Artist avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <Clock className="h-5 w-5 text-gray-400" />
      )}
    </div>
  );
};

export default TaskArtistImage;
