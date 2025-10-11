/**
 * Citation Parsing Utilities
 * 
 * Parses citation text and converts to InlineCitation components.
 * Single responsibility: Citation parsing and formatting.
 */

export interface Citation {
  number: string;
  title: string;
  url: string;
  description?: string;
}

/**
 * Parse Perplexity-style citations from text content
 */
export function parseCitationsFromText(content: string): {
  contentWithCitations: string;
  citations: Citation[];
} {
  const lines = content.split('\n');
  const citationStartIndex = lines.findIndex(line => 
    line.toLowerCase().includes('citations:') || 
    line.toLowerCase().includes('sources:')
  );
  
  if (citationStartIndex === -1) {
    return { contentWithCitations: content, citations: [] };
  }
  
  // Split content and citations
  const mainContent = lines.slice(0, citationStartIndex).join('\n').trim();
  const citationLines = lines.slice(citationStartIndex + 1);
  
  // Parse citations
  const citations: Citation[] = [];
  
  citationLines.forEach(line => {
    // Match format: [1] URL or [1] Title - URL
    const match = line.match(/\[(\d+)\]\s*(.+)/);
    if (match) {
      const number = match[1];
      const rest = match[2].trim();
      
      // Try to extract URL
      const urlMatch = rest.match(/(https?:\/\/[^\s]+)/);
      const url = urlMatch ? urlMatch[1] : '';
      
      // Extract title (everything before URL or the whole thing)
      const title = url ? rest.replace(url, '').trim().replace(/[-—]$/, '').trim() : rest;
      
      citations.push({
        number,
        title: title || extractTitleFromUrl(url),
        url,
        description: title ? `Source ${number}` : undefined
      });
    }
  });
  
  return { contentWithCitations: mainContent, citations };
}

/**
 * Extract a readable title from URL
 */
function extractTitleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return 'Source';
  }
}

/**
 * Replace citation numbers in text with inline citation markers
 */
export function insertInlineCitations(
  content: string, 
  citations: Citation[]
): string {
  let processedContent = content;
  
  citations.forEach(citation => {
    const citationPattern = new RegExp(`\\[${citation.number}\\]`, 'g');
    processedContent = processedContent.replace(
      citationPattern, 
      `<citation-${citation.number}>`
    );
  });
  
  return processedContent;
}
