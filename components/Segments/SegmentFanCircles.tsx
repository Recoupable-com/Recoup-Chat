import { Tables } from "@/types/database.types";
import ImageWithFallback from "@/components/ImageWithFallback";

type Social = Tables<"socials">;

interface SegmentFanCirclesProps {
  fans: Social[];
}

const SegmentFanCircles = ({ fans }: SegmentFanCirclesProps) => {
  const displayedFans = fans.slice(0, 5);

  return (
    <div className="flex items-center gap-1 mr-2">
      {displayedFans.map((fan) => (
        <div key={fan.id} className="relative group" title={fan.username}>
          <ImageWithFallback
            src={fan.avatar!}
            className="w-4 h-4 rounded-full object-cover border border-gray-200 hover:border-blue-400 transition-colors"
          />
          {fan.bio && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-32 p-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {fan.bio}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SegmentFanCircles;
