export interface ParsedSearchResult {
  title: string;
  url: string;
  snippet?: string;
  date?: string;
  last_updated?: string;
}

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

