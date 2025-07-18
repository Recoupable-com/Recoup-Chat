import { type Segment } from "@/lib/supabase/getArtistSegments";
import SegmentFanCircles from "./SegmentFanCircles";

interface SegmentButtonProps {
  segment: Segment;
  onGenerateReport: (id: string, name: string) => void;
}

const SegmentButton = ({ segment, onGenerateReport }: SegmentButtonProps) => {
  const fansWithAvatars = segment.fans?.filter((fan) => fan.avatar) || [];

  return (
    <button
      onClick={() => onGenerateReport(segment.id, segment.name)}
      className="bg-white border-2 border-black rounded-[10px] p-4 md:pl-5 md:pr-4 md:h-16 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-2 justify-between
        transition-all text-[15px] font-medium text-black hover:bg-black hover:text-white active:bg-white/80"
    >
      <div className="flex flex-col items-start flex-1 w-full md:w-auto">
        <p className="text-sm text-start font-medium">{segment.name}</p>
        <p className="text-xs text-grey-primary">{segment.size} fans</p>
      </div>

      {fansWithAvatars.length > 0 && (
        <SegmentFanCircles fans={fansWithAvatars} />
      )}

      <div className="text-xs text-grey-primary whitespace-nowrap self-end md:self-auto">
        Generate Report
      </div>
    </button>
  );
};

export default SegmentButton;
