/**
 * Types for search web tool streaming progress
 */

export type SearchProgressStatus = 'searching' | 'reviewing' | 'streaming' | 'complete';

export type SearchProgress = {
  status: SearchProgressStatus;
  message: string;
  query?: string;
  content?: string; // Current chunk
  accumulatedContent?: string; // All content accumulated so far
  searchResults?: Array<{
    title: string;
    url: string;
    snippet: string;
    date?: string;
    last_updated?: string;
  }>;
  citations?: string[];
};

export type SearchWebResult = {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
};

