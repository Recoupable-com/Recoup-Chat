import { Card } from "@/components/ui/card";
import { Users, ArrowUpRight } from "lucide-react";
import { Segment } from "@/lib/supabase/getArtistSegments";
import SegmentFanCircles from "./SegmentFanCircles";

interface SegmentButtonProps {
  segment: Segment;
  onGenerateReport: (id: string, name: string) => void;
}

const SegmentButton = ({ segment, onGenerateReport }: SegmentButtonProps) => {
  const fansWithAvatars = segment.fans?.filter((fan) => fan.avatar) || [];

  return (
    <Card 
      className="p-6 border border-border-light dark:bg-dark-bg-tertiary hover:shadow-lg dark:hover:bg-dark-bg-hover transition-all duration-200 cursor-pointer relative"
      onClick={() => onGenerateReport(segment.id, segment.name)}
    >
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          {segment.name}
        </h3>

        {/* Fan Avatars and Count */}
        <div className="flex items-center space-x-3">
          {fansWithAvatars.length > 0 ? (
            <SegmentFanCircles 
              fans={fansWithAvatars} 
              maxVisible={3}
              totalCount={segment.size}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-dark-border-light flex items-center justify-center">
                <Users className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-300">{segment.size} Fans</span>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="absolute bottom-4 right-4">
        <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
      </div>
    </Card>
  );
};

export default SegmentButton;
