import { useUserProvider } from "@/providers/UserProvder";
import { useRouter } from "next/navigation";
import { ArrowRightFromLine } from "lucide-react";
import Icon from "../Icon";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistSegments } from "@/hooks/useArtistSegments";

const MiniMenu = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { data: segments, isLoading } = useArtistSegments(selectedArtist?.account_id);
  
  const goToItem = (link?: string) => {
    if (isPrepared()) push(`/${link || ""}`);
  };

  const showSegments = selectedArtist && !isLoading && segments && segments.length > 0;

  return (
    <div className="w-full h-full pt-10 pb-4 px-2 gap-3 hidden md:flex">
      <div className="flex flex-col items-center gap-3 grow">
        <button type="button" onClick={() => push(`/`)} className="p-2">
          <Icon name="logo" />
        </button>
        <button
          type="button"
          className="p-2 rounded-md mt-2"
          onClick={() => goToItem("chat")}
        >
          <Icon name="plus" />
        </button>
        <button
          type="button"
          className=" p-2 rounded-md"
          onClick={() => goToItem("agents")}
        >
          <Icon name="robot" />
        </button>
        {showSegments && (
          <button
            type="button"
            className=" p-2 rounded-md"
            onClick={() => goToItem("segments")}
          >
            <Icon name="segments" />
          </button>
        )}
        <div className="grow flex items-end justify-center">
          <button type="button" onClick={toggleMenuExpanded}>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniMenu;
