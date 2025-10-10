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
import { parseReasoningSteps } from '@/lib/reasoning/parseReasoningSteps';
import { 
  StreamingShimmer,
  ThinkingIndicator,
  getReasoningTitle,
  useAutoCollapse,
  useDurationTracking
} from '@/lib/reasoning/backup-features';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  
  // Parse content into structured steps for better visualization
  const steps = parseReasoningSteps(content || '', isStreaming);
  
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
        {steps.map((step, index) => (
          <ChainOfThoughtStep
            key={`step-${index}`}
            icon={step.icon}
            label={step.label}
            status={step.status}
          >
            {step.content && step.content.trim() && step.content !== step.label && (
              <div className="mt-2">
                <StepContent content={step.content} />
              </div>
            )}
          </ChainOfThoughtStep>
        ))}
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
