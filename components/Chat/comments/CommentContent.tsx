import React from "react";
import CommentSocialIndicators from "./CommentSocialIndicators";

interface CommentContentProps {
  text: string;
  timestamp: string;
}

/**
 * Component for displaying the comment text and social indicators
 */
const CommentContent: React.FC<CommentContentProps> = ({
  text,
  timestamp,
}) => {
  return (
    <div className="rounded-xl border-blue-100 dark:border-blue-900">
      <p className="p-3 pl-1 rounded-xl rounded-bl-none bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900 text-foreground dark:text-muted-foreground font-normal whitespace-pre-wrap text-sm font-sans">
        {text}
      </p>
      
      {/* Social media indicators */}
      <CommentSocialIndicators timestamp={timestamp} />
    </div>
  );
};

export default CommentContent; 