import { type Segment } from "@/lib/supabase/getArtistSegments";

interface SegmentButtonProps {
  segment: Segment;
  onGenerateReport: (id: string, name: string) => void;
}

const SegmentButton = ({ segment, onGenerateReport }: SegmentButtonProps) => {
  return (
    <button
      onClick={() => onGenerateReport(segment.id, segment.name)}
      className="bg-black rounded-[10px] pl-5 pr-4 h-16 z-20 flex items-center gap-2 justify-between
        transition-all text-[15px] font-medium text-white hover:bg-black active:bg-white/80"
    >
      <div className="flex flex-col items-start">
        <p className="text-sm text-start">{segment.name}</p>
        <p className="text-xs text-grey-primary">{segment.size} fans</p>
      </div>
      <div className="text-xs text-grey-primary whitespace-nowrap">
        Generate Report
      </div>
    </button>
  );
};

export default SegmentButton;
