import { type Segment } from "@/lib/supabase/getArtistSegments";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import SegmentFanCircles from "./SegmentFanCircles";

interface SegmentButtonProps {
  segment: Segment;
  onGenerateReport: (id: string, name: string) => void;
}

const SegmentButton = ({ segment, onGenerateReport }: SegmentButtonProps) => {
  const fansWithAvatars = segment.fans?.filter((fan) => fan.avatar) || [];

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
      onClick={() => onGenerateReport(segment.id, segment.name)}
    >
      <CardHeader className="pb-2 p-4">
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight min-h-[3rem] flex items-start">
          {segment.name}
        </h3>
      </CardHeader>

      <CardContent className="pt-0 px-4 pb-4 space-y-3 min-h-[4rem] flex flex-col justify-between">
        <div className="flex items-center min-h-[2rem]">
          {fansWithAvatars.length > 0 ? (
            <SegmentFanCircles 
              fans={fansWithAvatars} 
              maxVisible={3}
              totalCount={segment.size}
            />
          ) : (
            <div className="flex items-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm">{segment.size} fans</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
            <span className="mr-2">Generate Report</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentButton;
