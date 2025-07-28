import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistSegments } from "@/hooks/useArtistSegments";
import NavButton from "./NavButton";

const FanGroupNavItem = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  const { selectedArtist } = useArtistProvider();
  const { data: segments, isLoading } = useArtistSegments(selectedArtist?.account_id);
  
  const shouldRender = !!(selectedArtist && !isLoading && segments && segments.length > 0);

  return (
    <NavButton
      icon="segments"
      label="Fan Groups"
      isActive={isActive}
      onClick={onClick}
      shouldRender={shouldRender}
    />
  );
};

export default FanGroupNavItem;
