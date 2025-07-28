import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import MenuItemIcon from "../MenuItemIcon";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistSegments } from "@/hooks/useArtistSegments";

const FanGroupNavItem = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  const { selectedArtist } = useArtistProvider();
  const { data: segments, isLoading } = useArtistSegments(selectedArtist?.account_id);

  // Don't render if no artist is selected, still loading, or no segments exist
  if (!selectedArtist || isLoading || !segments || segments.length === 0) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn("rounded-xl w-full flex justify-start", {
        "bg-gray-200 hover:bg-gray-200/70": isActive,
      })}
    >
      <MenuItemIcon name="segments" />
      Fan Groups
    </Button>
  );
};

export default FanGroupNavItem;
