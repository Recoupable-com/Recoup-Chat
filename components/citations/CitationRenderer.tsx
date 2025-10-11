/**
 * Citation Renderer Component
 * 
 * Renders text content with inline citations using AI Elements.
 * Single responsibility: Display content with interactive citations.
 */

import React, { memo } from 'react';
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationSource,
} from '@/components/ai-elements/inline-citation';
import { Response } from '@/components/ai-elements/response';
import { Citation } from '@/lib/citations/parseCitations';

interface CitationRendererProps {
  content: string;
  citations: Citation[];
}

export const CitationRenderer = memo(({ content, citations }: CitationRendererProps) => {
  if (citations.length === 0) {
    return <Response>{content}</Response>;
  }

  // Split content by citation markers and render with inline citations
  const parts = content.split(/(<citation-\d+>)/);
  
  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        const citationMatch = part.match(/<citation-(\d+)>/);
        
        if (citationMatch) {
          const citationNumber = citationMatch[1];
          const citation = citations.find(c => c.number === citationNumber);
          
          if (citation) {
            return (
              <InlineCitation key={index}>
                <InlineCitationCard>
                  <InlineCitationCardTrigger sources={[citation.url]} />
                  <InlineCitationCardBody>
                    <InlineCitationCarousel>
                      <InlineCitationCarouselHeader>
                        <InlineCitationCarouselIndex />
                      </InlineCitationCarouselHeader>
                      <InlineCitationCarouselContent>
                        <InlineCitationCarouselItem>
                          <InlineCitationSource
                            title={citation.title}
                            url={citation.url}
                            description={citation.description}
                          />
                        </InlineCitationCarouselItem>
                      </InlineCitationCarouselContent>
                    </InlineCitationCarousel>
                  </InlineCitationCardBody>
                </InlineCitationCard>
              </InlineCitation>
            );
          }
        }
        
        // Regular text content
        if (part.trim()) {
          return <Response key={index}>{part}</Response>;
        }
        
        return null;
      })}
    </div>
  );
});

CitationRenderer.displayName = 'CitationRenderer';
