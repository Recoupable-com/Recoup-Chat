/**
 * Enhanced Search Web Result with Citations
 * 
 * Extends SearchWebResult to include inline citation support.
 * Single responsibility: Display search results with interactive citations.
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import useContainerHeight from "@/hooks/useContainerHeight";
import { CitationRenderer } from "@/components/citations/CitationRenderer";
import { parseCitationsFromText } from "@/lib/citations/parseCitations";

export interface SearchWebResultType {
  content: Array<{
    type: "text";
    text: string;
  }>;
  success: boolean;
  message?: string;
}

const SearchWebResultWithCitations = ({ result }: { result: SearchWebResultType }) => {
  const [expanded, setExpanded] = useState(false);
  const { containerRef, containerHeight } = useContainerHeight();

  const showTopExpandButton = containerHeight > 300;

  const expandButton = () => (
    <Button
      onClick={() => setExpanded(!expanded)}
      variant="outline"
      size="sm"
      className="text-xs"
    >
      {expanded ? (
        <>
          <Minimize2 className="w-3 h-3 mr-1" />
          Collapse
        </>
      ) : (
        <>
          <Maximize2 className="w-3 h-3 mr-1" />
          Expand
        </>
      )}
    </Button>
  );

  return (
    <Card className="w-full">
      <CardContent className="pt-4 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium mb-2">Web Search Results</h3>
          {showTopExpandButton ? (expanded ? expandButton() : null) : null}
        </div>
        <div className={"prose prose-sm dark:prose-invert max-w-none relative"}>
          {result.content.map((item, index) => {
            // Parse citations from the text
            const { contentWithCitations, citations } = parseCitationsFromText(item?.text || "");
            
            return (
              <div
                ref={containerRef}
                key={index}
                className={cn(
                  "mb-4 [&_p]:text-xs [&_li]:text-xs [&_td]:text-xs [&_th]:text-xs [&_h2]:text-sm overflow-hidden"
                )}
                style={{
                  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  maxHeight: expanded ? 5000 : 200,
                }}
              >
                {item.type === "text" && (
                  <CitationRenderer 
                    content={contentWithCitations}
                    citations={citations}
                  />
                )}
              </div>
            );
          })}
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>
        {expandButton()}
      </CardContent>
    </Card>
  );
};

export default SearchWebResultWithCitations;
