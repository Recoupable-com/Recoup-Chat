export interface BrowserActRequest {
  url: string;
  action: string;
}

export interface BrowserActResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface BrowserExtractRequest {
  url: string;
  schema: Record<string, string>;
  instruction?: string;
}

export interface BrowserExtractResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface BrowserObserveRequest {
  url: string;
  instruction?: string;
}

export interface BrowserObserveResponse {
  success: boolean;
  actions?: string[];
  error?: string;
}

export interface BrowserAgentRequest {
  startUrl: string;
  task: string;
  model?: string;
}

export interface BrowserAgentResponse {
  success: boolean;
  result?: string;
  error?: string;
}

