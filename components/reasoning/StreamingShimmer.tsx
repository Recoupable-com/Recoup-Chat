/**
 * StreamingShimmer Component
 * 
 * Creates beautiful shimmer effects during streaming/thinking states.
 * Single responsibility: Shimmer animation for streaming content.
 */

import React from 'react';

interface StreamingShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export const StreamingShimmer = ({ children, className }: StreamingShimmerProps): React.ReactElement => {
  return (
    <span className={`relative inline-block ${className || ''}`}>
      {children}
      <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/70 to-transparent bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]"></span>
    </span>
  );
};

export default StreamingShimmer;
