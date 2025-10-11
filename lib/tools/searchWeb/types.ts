export type SearchProgressStatus = 'searching' | 'streaming' | 'complete';

export type SearchProgress = {
  status: SearchProgressStatus;
  message: string;
  query?: string;
  content?: string; // Streaming content
  accumulatedContent?: string; // All content so far
  searchResults?: Array<{
    url: string;
    title?: string;
  }>;
  citations?: string[];
};

export type SearchWebResult = {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
};
