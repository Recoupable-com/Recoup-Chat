import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import ImageWithFallback from "../ImageWithFallback";
import { EllipsisVertical, Pin, PinOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useArtistPinToggle } from "@/hooks/useArtistPinToggle";
import ArtistActionButton from "./ArtistActionButton";

const Artist = ({
  artist,
  toggleDropDown,
  isMini,
}: {
  artist: ArtistRecord | null;
  toggleDropDown: () => void;
  isMini?: boolean;
}) => {
  const {
    setSelectedArtist,
    selectedArtist,
    toggleUpdate,
    toggleSettingModal,
  } = useArtistProvider();
  const [isHovered, setIsHovered] = useState(false);
  const { handlePinToggle, isPinning } = useArtistPinToggle(artist);

  const isSelectedArtist = selectedArtist?.account_id === artist?.account_id;
  const isAnyArtistSelected = !!selectedArtist;
  const shouldHighlight = !isAnyArtistSelected; // Highlight when no artist is selected

  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    toggleDropDown();
    if (pathname.includes("/chat/") && selectedArtist) {
      if (selectedArtist.account_id !== artist?.account_id) {
        replace("/chat");
      }
    }
    setSelectedArtist(artist);
  };


  // Truncate name if longer than 12 characters
  const displayName = artist?.name
    ? artist.name.length > 12
      ? `${artist.name.substring(0, 12)}...`
      : artist.name
    : "";

  return (
    <motion.div
      initial={isMini ? false : true}
      layout="position"
      role="button"
      tabIndex={0}
      className={cn(
        "py-2 w-full outline-none cursor-pointer",
        isMini
          ? [
              "flex justify-center items-center",
              isSelectedArtist && "w-fit rounded-full",
            ]
          : [
              "flex gap-3 items-center px-2 text-sm rounded-md text-grey-dark ",
              isAnyArtistSelected && "hover:bg-grey-light-1 ",
              isSelectedArtist && "!bg-primary/10 ",
            ],
        shouldHighlight && "z-50 relative"
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          className={cn(
            "w-8 h-8 aspect-1/1 rounded-full overflow-hidden flex items-center justify-center p-0.5 border-2 border-transparent transition-colors min-w-8 min-h-8 box-content",
            isSelectedArtist &&
              "shadow-[1px_1px_1px_1px_#E6E6E6] dark:shadow-none border-primary ",
            shouldHighlight && "brightness-110 shadow-md ring-1 ring-white/30"
          )}
        >
          <ImageWithFallback
            src={artist?.image || ""}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      {!isMini && (
        <>
          <div
            key={artist?.account_id}
            className={cn(
              "text-left grow text-grey-dark ",
              shouldHighlight && "font-medium"
            )}
            title={artist?.name || ""}
          >
            {displayName}
          </div>
          <div className="ml-auto flex gap-1">
            <ArtistActionButton
              onClick={handlePinToggle}
              disabled={isPinning}
              isVisible={isHovered || isSelectedArtist}
              title={artist?.pinned ? "Unpin artist" : "Pin artist"}
              ariaLabel={artist?.pinned ? "Unpin artist" : "Pin artist"}
            >
              {artist?.pinned ? (
                <Pin className="size-4 text-primary " />
              ) : (
                <PinOff className="size-4 text-grey-dark " />
              )}
            </ArtistActionButton>
            
            <ArtistActionButton
              onClick={(e) => {
                e.stopPropagation();
                if (artist) toggleUpdate(artist);
                toggleSettingModal();
              }}
              isVisible={isHovered || isSelectedArtist}
              title="Edit artist settings"
              ariaLabel="Edit artist settings"
            >
              <EllipsisVertical className="size-5 rotate-90 text-grey-dark " />
            </ArtistActionButton>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Artist;
