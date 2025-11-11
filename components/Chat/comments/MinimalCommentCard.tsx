import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MinimalCommentCardProps } from '@/types/Comment';

/**
 * Card component displaying a compact view of a comment
 */
const MinimalCommentCard: React.FC<MinimalCommentCardProps> = ({ comment, onClick }) => {
  const initials = comment.username.slice(0, 2).toUpperCase();
  
  // Truncate comment based on responsive layout (mobile gets more space)
  const previewText = comment.comment.length > 45 
    ? comment.comment.substring(0, 45) + '...' 
    : comment.comment;

  return (
    <div 
      className="flex items-center space-x-2 p-2 bg-muted rounded-xl border border-border  hover:bg-muted dark:hover:bg-dark-bg-tertiary hover:border-gray-200 dark:hover:border-dark-border-light transition-all cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Tiny Avatar */}
      <div className="h-5 w-5 rounded-full overflow-hidden flex-shrink-0">
        {comment.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={comment.avatar} 
            alt={comment.username} 
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white text-[8px] font-medium">
            {initials}
          </div>
        )}
      </div>
      
      {/* Content - responsive text sizing */}
      <div className="flex-grow min-w-0">
        <div className="flex items-start space-x-1">
          <span className="font-medium text-xs md:text-[11px] lg:text-xs text-foreground flex-shrink-0">@{comment.username}</span>
          <span className="text-xs md:text-[11px] lg:text-xs text-muted-foreground dark:text-muted-foreground truncate leading-tight">
            {previewText}
          </span>
        </div>
      </div>
      
      {/* Click indicator */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-3 w-3 text-muted-foreground dark:text-muted-foreground" />
      </div>
    </div>
  );
};

export default MinimalCommentCard; 