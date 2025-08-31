import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
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
      className="p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onGenerateReport(segment.id, segment.name)}
    >
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900">
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
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          )}
          <span className="text-sm text-gray-600">{segment.size} Fans</span>
        </div>
      </div>
    </Card>
  );
};

export default SegmentButton;
