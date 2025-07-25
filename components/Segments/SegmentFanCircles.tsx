import { Tables } from "@/types/database.types";
import { User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import FanProfileHover from "./FanProfileHover";
import Link from "next/link";

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
        <FanProfileHover key={fan.id} fan={fan}>
          <div className="relative group">
            <Link
              href={
                fan.profile_url.startsWith("http")
                  ? fan.profile_url
                  : `https://${fan.profile_url}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block"
            >
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
            </Link>
            {fan.profile_url.includes("tiktok.com") && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <Image
                  src="/brand-logos/tiktok.png"
                  alt="TikTok"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </div>
            )}
            {fan.profile_url.includes("instagram.com") && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <Image
                  src="/brand-logos/instagram.png"
                  alt="Instagram"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </div>
            )}
          </div>
        </FanProfileHover>
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
