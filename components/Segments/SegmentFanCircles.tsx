import { Tables } from "@/types/database.types";
import { User } from "lucide-react";
import { useState } from "react";

type Social = Tables<"socials">;

interface SegmentFanCirclesProps {
  fans: Social[];
  maxVisible?: number;
  totalCount?: number;
}

const SegmentFanCircles = ({ 
  fans, 
  maxVisible = 4, 
  totalCount 
}: SegmentFanCirclesProps) => {
  const displayedFans = fans.slice(0, maxVisible);
  const remainingCount = totalCount ? totalCount - maxVisible : fans.length - maxVisible;
  const showCounter = remainingCount > 0;
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (fanId: string) => {
    setImageErrors(prev => new Set(prev).add(fanId));
  };

  return (
    <div className="flex -space-x-2">
      {displayedFans.map((fan, index) => (
        <div key={fan.id} className="relative group">
          {!imageErrors.has(fan.id) && fan.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fan.avatar}
              alt={fan.username || `Fan ${index + 1}`}
              className="h-10 w-10 rounded-full border-2 border-white object-cover hover:z-10 transition-all duration-200"
              title={fan.username}
              onError={() => handleImageError(fan.id)}
            />
          ) : (
            <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center hover:z-10 transition-all duration-200">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          {fan.bio && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <div className="font-medium">{fan.username}</div>
              <div className="text-gray-300 mt-1">{fan.bio}</div>
            </div>
          )}
        </div>
      ))}
      {showCounter && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-center text-xs font-medium text-white">
          +{remainingCount > 99 ? '99' : remainingCount}
        </div>
      )}
    </div>
  );
};

export default SegmentFanCircles;
