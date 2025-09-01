'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { BrainIcon, ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { Response } from './response';

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning');
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen = true,
    onOpenChange,
    duration: durationProp,
    children,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });
    const [duration, setDuration] = useControllableState({
      prop: durationProp,
      defaultProp: 0,
    });

    const [hasAutoClosedRef, setHasAutoClosedRef] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) {
          setStartTime(Date.now());
        }
      } else if (startTime !== null) {
        setDuration(Math.round((Date.now() - startTime) / MS_IN_S));
        setStartTime(null);
      }
    }, [isStreaming, startTime, setDuration]);

    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosedRef) {
          // Add a small delay before closing to allow user to see the content
          const timer = setTimeout(() => {
            setIsOpen(false);
            setHasAutoClosedRef(true);
          }, AUTO_CLOSE_DELAY);

          return () => clearTimeout(timer);
        }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosedRef]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
    };

    return (
      <ReasoningContext.Provider
        value={{ isStreaming, isOpen, setIsOpen, duration }}
      >
        <Collapsible
          className={cn('not-prose mb-4', className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  content?: string;
};

export const ReasoningTrigger = memo(
  ({ className, children, content, ...props }: ReasoningTriggerProps) => {
    const { isStreaming, isOpen, duration } = useReasoning();
    
    // Extract the first line or sentence as the title
    const getReasoningTitle = () => {
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

    return (
      <CollapsibleTrigger
        className={cn(
          'flex items-center gap-2 text-muted-foreground text-sm',
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <BrainIcon className="size-4" />
            {isStreaming && !content ? (
              <p className="relative overflow-hidden">
                <span className="relative inline-block">
                  Thinking...
                  <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/70 to-transparent bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]"></span>
                </span>
              </p>
            ) : (
              <p className={isStreaming ? "relative overflow-hidden" : ""}>
                {isStreaming ? (
                  <span className="relative inline-block">
                    {getReasoningTitle()}
                    <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/70 to-transparent bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]"></span>
                  </span>
                ) : (
                  getReasoningTitle()
                )}
              </p>
            )}
            <ChevronDownIcon
              className={cn(
                'size-4 text-muted-foreground transition-transform',
                isOpen ? 'rotate-180' : 'rotate-0'
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => {
    // Remove the first line (title) from the content since it's shown in the header
    const getContentWithoutTitle = (content: string) => {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length > 1) {
        // Remove the first line and rejoin
        return lines.slice(1).join('\n').trim();
      }
      return content; // If only one line, keep it as is
    };

    return (
      <CollapsibleContent
        className={cn(
          'mt-4 text-sm',
          'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
          className
        )}
        {...props}
      >
        <Response className="grid gap-2">{getContentWithoutTitle(children)}</Response>
      </CollapsibleContent>
    );
  }
);

Reasoning.displayName = 'Reasoning';
ReasoningTrigger.displayName = 'ReasoningTrigger';
ReasoningContent.displayName = 'ReasoningContent';
