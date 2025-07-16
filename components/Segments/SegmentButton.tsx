import { type Segment } from "@/lib/supabase/getArtistSegments";
import ImageWithFallback from "../ImageWithFallback";

interface SegmentButtonProps {
  segment: Segment;
  onGenerateReport: (id: string, name: string) => void;
}

const SegmentButton = ({ segment, onGenerateReport }: SegmentButtonProps) => {
  const fansWithAvatars = segment.fans?.filter((fan) => fan.avatar) || [];
  const displayedFans = fansWithAvatars.slice(0, 5);

  return (
    <button
      onClick={() => onGenerateReport(segment.id, segment.name)}
      className="bg-white border-2 border-black rounded-[10px] pl-5 pr-4 h-16 flex items-center gap-2 justify-between
        transition-all text-[15px] font-medium text-black hover:bg-black hover:text-white active:bg-white/80"
    >
      <div className="flex flex-col items-start flex-1">
        <p className="text-sm text-start">{segment.name}</p>
        <p className="text-xs text-grey-primary">{segment.size} fans</p>
      </div>

      {/* Profile picture circles */}
      {displayedFans.length > 0 && (
        <div className="flex items-center gap-1 mr-2">
          {displayedFans.map((fan) => (
            <div key={fan.id} className="relative group" title={fan.username}>
              <ImageWithFallback
                src={fan.avatar!}
                className="w-6 h-6 rounded-full object-cover border border-gray-200 hover:border-blue-400 transition-colors"
              />
              {fan.bio && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-32 p-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {fan.bio}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-grey-primary whitespace-nowrap">
        Generate Report
      </div>
    </button>
  );
};

export default SegmentButton;
