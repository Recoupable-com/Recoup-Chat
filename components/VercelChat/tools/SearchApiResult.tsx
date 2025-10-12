import React from "react";

export interface SearchApiResultType {
  content: {
    text: string;
    type: string;
  }[];
  isError: boolean;
}

interface ParsedSearchResult {
  title: string;
  url: string;
  snippet: string;
  date?: string;
}

/**
 * Parses the formatted search results text into structured data
 */
function parseSearchResults(text: string): ParsedSearchResult[] {
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

/**
 * Extracts domain from URL for display
 */
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

const SearchApiResult = ({ result }: { result: SearchApiResultType }) => {
  if (result.isError) {
    return (
      <div className="py-3 px-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-destructive font-medium">
          Error retrieving search results
        </p>
      </div>
    );
  }

  const text = result.content[0]?.text || "";
  const searchResults = parseSearchResults(text);

  if (searchResults.length === 0) {
    return (
      <div className="py-3 px-4">
        <p className="text-sm text-muted-foreground">No search results found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Reviewing sources · {searchResults.length}
      </p>
      
      <div className="space-y-1">
        {searchResults.map((item, index) => {
          const domain = getDomain(item.url);
          const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
          
          return (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <img 
                  src={favicon} 
                  alt="" 
                  className="w-4 h-4 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                  {item.title}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {domain}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SearchApiResult;

