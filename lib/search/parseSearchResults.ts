/**
 * parseSearchResults.ts
 * Utility for parsing formatted search results from markdown text into structured data.
 * Used by SearchApiResult component to transform API responses.
 */

export interface ParsedSearchResult {
  title: string;
  url: string;
  snippet?: string;
  date?: string;
  last_updated?: string;
}

/**
 * Parses formatted search results text (markdown) into structured data objects.
 * Expects input format with markdown headers (### N.) followed by title, URL, date, and snippet.
 * 
 * @param text - Markdown-formatted search results text
 * @returns Array of parsed search result objects
 */
export function parseSearchResults(text: string): ParsedSearchResult[] {
  const results: ParsedSearchResult[] = [];
  
  // Split by the markdown headers (###)
  const sections = text.split(/### \d+\. /).filter(Boolean);
  
  sections.forEach(section => {
    const lines = section.trim().split('\n');
    
    const title = lines[0]?.trim();
    const urlLine = lines.find(l => l.startsWith('**URL:**'));
    const dateLine = lines.find(l => l.startsWith('**Published:**'));
    
    const url = urlLine?.replace('**URL:**', '').trim() || '';
    const date = dateLine?.replace('**Published:**', '').trim();
    
    // Get snippet (everything after the metadata lines and before the separator)
    const snippetStartIndex = lines.findIndex(l => 
      l.startsWith('**URL:**') || l.startsWith('**Published:**')
    );
    const snippetLines = lines.slice(snippetStartIndex + 2);
    const snippet = snippetLines
      .filter(l => l.trim() && !l.trim().startsWith('---'))
      .join('\n')
      .trim();
    
    if (title && url) {
      results.push({ title, url, snippet, date });
    }
  });
  
  return results;
}

