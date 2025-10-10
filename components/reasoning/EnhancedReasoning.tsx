/**
 * Enhanced Reasoning Component
 * 
 * Combines AI Elements Chain of Thought with our advanced backup features:
 * - Modern, clean UI from AI Elements
 * - Streaming shimmer animations from backup
 * - Smart title extraction from backup
 * - Auto-collapse behavior from backup
 * - Advanced content processing from backup
 */

'use client';

import { memo } from 'react';
import { 
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from '@/components/ai-elements/chain-of-thought';
// Inline the essential features we need
const getReasoningTitle = (content?: string): string => {
  if (!content) return "Chain of Thought";
  
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return "Chain of Thought";
  
  let firstLine = lines[0].trim();
  
  // Strip markdown formatting
  firstLine = firstLine
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
    .replace(/`(.*?)`/g, '$1')       // Remove code `text`
    .replace(/#{1,6}\s*/g, '')       // Remove headers # ## ###
    .trim();
  
  // Truncate if too long
  if (firstLine.length > 100) {
    const firstSentence = firstLine.split('.')[0];
    return firstSentence.length < 100 ? firstSentence : firstSentence.substring(0, 97) + '...';
  }
  
  return firstLine;
};

const StreamingShimmer = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block">
    {children}
    <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/70 to-transparent bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]"></span>
  </span>
);

const useDurationTracking = (isStreaming: boolean) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isStreaming) {
      if (startTime === null) {
        setStartTime(Date.now());
      }
    } else if (startTime !== null) {
      setDuration(Math.round((Date.now() - startTime) / 1000));
      setStartTime(null);
    }
  }, [isStreaming, startTime]);

  return { duration };
};
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export interface EnhancedReasoningProps {
  content?: string;
  isStreaming?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const EnhancedReasoning = memo(({
  content,
  isStreaming = false,
  defaultOpen = true,
  onOpenChange,
  className
}: EnhancedReasoningProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Use our advanced features from backup
  const title = getReasoningTitle(content);
  const { duration } = useDurationTracking(isStreaming);
  
  // Disable auto-collapse - keep reasoning open after completion
  // useAutoCollapse({
  //   defaultOpen,
  //   isStreaming,
  //   isOpen,
  //   setIsOpen: (open) => {
  //     setIsOpen(open);
  //     onOpenChange?.(open);
  //   }
  // });
  
  // Simplified: No complex parsing needed for single-step approach
  
  // Handle case where we have no content yet (initial streaming state)
  if (!content && isStreaming) {
    return (
      <ChainOfThought 
        defaultOpen={defaultOpen} 
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          onOpenChange?.(open);
        }}
        className={cn('not-prose mb-4', className)}
      >
      <ChainOfThoughtHeader>
        <StreamingShimmer>
          Thinking...
        </StreamingShimmer>
      </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {/* Empty content while thinking */}
        </ChainOfThoughtContent>
      </ChainOfThought>
    );
  }
  
  // Handle case where we have no content at all
  if (!content || content.trim().length === 0) {
    return null;
  }
  
  return (
    <ChainOfThought 
      defaultOpen={defaultOpen}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onOpenChange?.(open);
      }}
      className={cn('not-prose mb-4', className)}
    >
      <ChainOfThoughtHeader>
        {isStreaming ? (
          <StreamingShimmer>
            {title}
          </StreamingShimmer>
        ) : (
          <div className="flex items-center gap-2">
            <span>{title}</span>
            {duration > 0 && (
              <span className="text-xs text-muted-foreground/50">
                ({duration}s)
              </span>
            )}
          </div>
        )}
      </ChainOfThoughtHeader>
      
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          label="Reasoning process"
          status={isStreaming ? 'active' : 'complete'}
        >
          <div className="mt-2">
            <StepContent content={content} />
          </div>
        </ChainOfThoughtStep>
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
});

/**
 * Component to render step content with basic markdown processing
 */
const StepContent = memo(({ content }: { content: string }) => {
  // Basic markdown processing for step content
  const processedContent = content
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>') // Bold
    .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 rounded text-xs">$1</code>') // Code
    .replace(/\n/g, '<br />'); // Line breaks
  
  return (
    <div 
      className="text-sm text-muted-foreground/80 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
});

EnhancedReasoning.displayName = 'EnhancedReasoning';
StepContent.displayName = 'StepContent';
