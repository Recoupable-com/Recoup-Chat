import { Tables } from "@/types/database.types";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";

type Social = Tables<"socials">;

interface FanProfileHoverProps {
  fan: Social;
  children: React.ReactNode;
}

const FanProfileHover = ({ fan, children }: FanProfileHoverProps) => {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };



  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-6 mb-3 z-30 pointer-events-none">
          <Card className="w-72 shadow-lg border rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {!imageError && fan.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fan.avatar}
                      alt={fan.username || 'Fan'}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-gray-200 flex items-center justify-center">
                      <User className="w-7 h-7 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-plus_jakarta_sans_bold text-sm text-foreground truncate">
                      {fan.username || 'Unknown User'}
                    </h4>
                  </div>

                  {fan.bio && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                      {fan.bio}
                    </p>
                  )}

                  {/* Follower Stats */}
                  <div className="flex space-x-4 mt-2 text-xs text-muted-foreground">
                    {fan.followerCount !== null && (
                      <span>
                        <span className="font-medium text-foreground">{fan.followerCount.toLocaleString()}</span> followers
                      </span>
                    )}
                    {fan.followingCount !== null && (
                      <span>
                        <span className="font-medium text-foreground">{fan.followingCount.toLocaleString()}</span> following
                      </span>
                    )}
                  </div>

                  {fan.region && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {fan.region}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FanProfileHover; 