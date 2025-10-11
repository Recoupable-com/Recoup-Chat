# Perplexity API Integration

This directory contains functions for integrating with the Perplexity API for web search capabilities.

## Files

### Core Functions

#### `fetchPerplexityApi.ts` (Non-streaming)
- Makes POST request to Perplexity API without streaming
- Returns complete Response object
- Used by: `performChatCompletion.ts`

#### `performChatCompletion.ts` (Non-streaming)
- Calls `fetchPerplexityApi` and parses JSON response
- Appends citations to response content
- Returns: String with complete response

#### `streamPerplexityApi.ts` (Streaming) ⚡
- Makes POST request with `stream: true`
- Returns Response with streaming body for SSE parsing
- Used by: `streamChatCompletion.ts`

#### `streamChatCompletion.ts` (Streaming) ⚡
- Async generator that yields content chunks in real-time
- Parses Server-Sent Events (SSE) format
- Collects search results and citations from final chunks
- Returns: StreamedResponse with content, citations, and search results

### Types

#### `types.ts`
- `PerplexityMessage` - Message format for API requests
- `PerplexityStreamChunk` - Individual SSE chunk structure
- `SearchResult` - Search result metadata
- `StreamedResponse` - Final accumulated response

## Usage

### Non-Streaming (Legacy)
```typescript
import performChatCompletion from "@/lib/perplexity/performChatCompletion";

const result = await performChatCompletion(
  [{ role: "user", content: "What is AI?" }],
  "sonar-pro"
);
```

### Streaming (Current) ⚡
```typescript
import streamChatCompletion from "@/lib/perplexity/streamChatCompletion";

const stream = streamChatCompletion(
  [{ role: "user", content: "What is AI?" }],
  "sonar-pro"
);

// Iterate through chunks as they arrive
for await (const chunk of stream) {
  console.log(chunk); // Process each chunk in real-time
}

// Or manually control iteration to get return value
let content = "";
while (true) {
  const { value, done } = await stream.next();
  if (done) {
    // value contains StreamedResponse with citations
    console.log(value.citations);
    break;
  }
  content += value;
}
```

## Integration

The streaming functionality is integrated into the chat system via:
- **Tool**: `lib/tools/searchWeb/getSearchWebTool.ts`
- Uses `streamChatCompletion` to fetch web search results
- Streams content from Perplexity internally
- Returns complete result to AI SDK for processing

## Benefits of Streaming

1. **Faster Response Time**: Content starts arriving immediately
2. **Better User Experience**: Progressive display of results
3. **Handles Long Responses**: No timeout on lengthy analyses
4. **Efficient Processing**: Parse chunks as they arrive

## API Reference

See [Perplexity Streaming Documentation](https://docs.perplexity.ai/guides/streaming-responses)

