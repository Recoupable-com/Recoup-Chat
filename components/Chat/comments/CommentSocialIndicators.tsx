import React from 'react';
import { Heart, MessageCircle, Send } from "lucide-react";
import formatTimestamp from "@/lib/utils/formatTimestamp";

interface CommentSocialIndicatorsProps {
  timestamp: string;
}

/**
 * Social media indicators component showing engagement metrics and timestamp
 */
const CommentSocialIndicators: React.FC<CommentSocialIndicatorsProps> = ({ 
  timestamp 
}) => {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Heart className="h-3 w-3" />
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <MessageCircle className="h-3 w-3" />
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Send className="h-3 w-3" />
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="text-muted-foreground">•</span>
        <span className="text-xs">
          {formatTimestamp(timestamp, true)}
        </span>
      </div>
    </div>
  );
};

export default CommentSocialIndicators; 