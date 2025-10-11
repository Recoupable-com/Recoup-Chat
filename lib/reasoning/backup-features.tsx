/**
 * BACKUP: Critical reasoning features to preserve
 * 
 * These are the advanced features from our original reasoning component
 * that we want to keep available in case we need to restore them or
 * integrate them into the new AI Elements Chain of Thought.
 * 
 * Created: 2025-01-10
 * From: components/reasoning.tsx
 */

import React, { useEffect, useState } from 'react';

// Constants from original reasoning component
export const AUTO_CLOSE_DELAY = 1000;
export const MS_IN_S = 1000;

/**
 * FEATURE 1: Smart Title Extraction
 * 
 * Extracts the first line or sentence as the title for reasoning content,
 * with intelligent markdown stripping and length handling.
 */
export const getReasoningTitle = (content?: string): string => {
  if (!content) return "Reasoning";
  
  // Get the first non-empty line
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    let firstLine = lines[0].trim();
    
    // Strip markdown formatting
    firstLine = firstLine
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
      .replace(/`(.*?)`/g, '$1')       // Remove code `text`
      .replace(/#{1,6}\s*/g, '')       // Remove headers # ## ###
      .trim();
    
    // If it's a short line (likely a title), use it as-is
    if (firstLine.length < 100) {
      return firstLine;
    }
    // If it's a long line, extract the first sentence
    const firstSentence = firstLine.split('.')[0];
    return firstSentence.length < 100 ? firstSentence : firstSentence.substring(0, 97) + '...';
  }
  return "Reasoning";
};

/**
 * FEATURE 2: Streaming Shimmer Animation Components
 * 
 * Creates beautiful shimmer effects during streaming/thinking states.
 */
export const StreamingShimmer = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <span className="relative inline-block">
      {children}
      <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/70 to-transparent bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]"></span>
    </span>
  );
};

export const ThinkingIndicator = (): React.ReactElement => {
  return (
    <p className="relative overflow-hidden">
      <StreamingShimmer>
        Thinking...
      </StreamingShimmer>
    </p>
  );
};

export const StreamingTitle = ({ title }: { title: string }): React.ReactElement => {
  return (
    <p className="relative overflow-hidden">
      <StreamingShimmer>
        {title}
      </StreamingShimmer>
    </p>
  );
};

/**
 * FEATURE 3: Auto-Collapse Logic Hook
 * 
 * Automatically closes the reasoning component after streaming ends
 * with a configurable delay.
 */
export const useAutoCollapse = ({
  defaultOpen,
  isStreaming,
  isOpen,
  setIsOpen,
  delay = AUTO_CLOSE_DELAY
}: {
  defaultOpen: boolean;
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  delay?: number;
}) => {
  const [hasAutoClosedRef, setHasAutoClosedRef] = useState(false);

  useEffect(() => {
    if (defaultOpen && !isStreaming && isOpen && !hasAutoClosedRef) {
      // Add a small delay before closing to allow user to see the content
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosedRef(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosedRef, delay]);

  return { hasAutoClosedRef, setHasAutoClosedRef };
};

/**
 * FEATURE 4: Duration Tracking Hook
 * 
 * Tracks how long the reasoning/thinking process takes.
 */
export const useDurationTracking = (isStreaming: boolean) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isStreaming) {
      if (startTime === null) {
        setStartTime(Date.now());
      }
    } else if (startTime !== null) {
      setDuration(Math.round((Date.now() - startTime) / MS_IN_S));
      setStartTime(null);
    }
  }, [isStreaming, startTime]);

  return { duration, startTime };
};

/**
 * FEATURE 5: Advanced Content Processing
 * 
 * Processes reasoning content with sophisticated markdown parsing,
 * header styling, and HTML generation.
 */
export const getContentWithoutTitle = (content: string): string => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 1) {
    // Remove the first line and rejoin
    return lines.slice(1).join('\n').trim();
  }
  return content; // If only one line, keep it as is
};

export const processContentWithHeaders = (content: string): string => {
  const processedContent = getContentWithoutTitle(content);
  
  // Split into lines and process each line
  const lines = processedContent.split('\n');
  const processedLines = lines.map(line => {
    // Check if line starts with header markdown
    const headerMatch = line.match(/^(#{1,6})\s*(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      
      // Return styled header based on level
      switch (level) {
        case 1:
          return `<h3 class="text-base font-semibold mt-4 mb-2 text-foreground">${text}</h3>`;
        case 2:
          return `<h4 class="text-sm font-semibold mt-3 mb-1 text-foreground">${text}</h4>`;
        case 3:
        default:
          return `<h5 class="text-sm font-medium mt-2 mb-1 text-foreground">${text}</h5>`;
      }
    }
    
    // Check if line contains **bold** text (treat as header)
    const boldHeaderMatch = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (boldHeaderMatch) {
      const text = boldHeaderMatch[1].trim();
      return `<h4 class="text-xs font-normal mt-2 mb-1 text-muted-foreground/80">${text}</h4>`;
    }
    
    // Process inline markdown in regular text
    if (line.trim()) {
      const processedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>') // Bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1 rounded">$1</code>'); // Code
      
      return `<p class="text-xs text-muted-foreground/70 mb-2">${processedLine}</p>`;
    }
    
    return '';
  });
  
  return processedLines.filter(line => line).join('\n');
};

/**
 * FEATURE 6: Complete Reasoning Hook
 * 
 * Combines all the advanced reasoning features into a single hook
 * for easy integration into new components.
 */
export const useAdvancedReasoning = ({
  content,
  isStreaming,
  defaultOpen = false,
  autoCollapseDelay = AUTO_CLOSE_DELAY
}: {
  content?: string;
  isStreaming: boolean;
  defaultOpen?: boolean;
  autoCollapseDelay?: number;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const title = getReasoningTitle(content);
  const processedContent = content ? processContentWithHeaders(content) : '';
  const { duration } = useDurationTracking(isStreaming);
  const { hasAutoClosedRef } = useAutoCollapse({
    defaultOpen,
    isStreaming,
    isOpen,
    setIsOpen,
    delay: autoCollapseDelay
  });

  return {
    title,
    processedContent,
    duration,
    isOpen,
    setIsOpen,
    hasAutoClosedRef
  };
};

/**
 * USAGE EXAMPLES:
 * 
 * // For shimmer animations:
 * {isStreaming ? <StreamingTitle title={title} /> : title}
 * 
 * // For auto-collapse:
 * const { isOpen, setIsOpen } = useAutoCollapse({ defaultOpen, isStreaming, isOpen, setIsOpen });
 * 
 * // For content processing:
 * const processedHTML = processContentWithHeaders(reasoningText);
 * <div dangerouslySetInnerHTML={{ __html: processedHTML }} />
 * 
 * // Complete integration:
 * const reasoning = useAdvancedReasoning({ content, isStreaming, defaultOpen });
 */
