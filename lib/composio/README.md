# Composio Integration

This directory contains the server-side Composio SDK integration for the Recoup Chat application.

## ✅ What's Set Up

1. **SDK Installed**: `@composio/core` and `@composio/vercel`
2. **API Key Configured**: `COMPOSIO_API_KEY` in `.env`
3. **Client Initialization**: `lib/composio/client.ts`
4. **Tool Fetcher**: `lib/composio/getComposioTools.ts`

## 🔒 Security Architecture

**IMPORTANT**: Composio client is **server-side only**. It should **never** be used in client components or passed through React context.

### ❌ Incorrect (Will Fail)
```typescript
// DON'T: Cannot serialize Composio instance across server→client boundary
const composio = getComposioClient();
return <ClientComponent composio={composio} />;
```

### ✅ Correct Usage Patterns

#### Pattern 1: API Routes (Recommended)
```typescript
// app/api/my-endpoint/route.ts
import { getComposioTools } from '@/lib/composio/getComposioTools';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { userId, message } = await req.json();
  
  // Fetch Composio tools for this user
  const composioTools = await getComposioTools(userId, {
    toolkits: ['GMAIL', 'LINEAR']
  });
  
  // Use with Vercel AI SDK
  const { text } = await generateText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    tools: composioTools,
    messages: [{ role: 'user', content: message }],
  });
  
  return Response.json({ text });
}
```

#### Pattern 2: Integrate with Existing Tools
```typescript
// lib/chat/setupChatRequest.ts
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { getComposioTools } from "@/lib/composio/getComposioTools";

export async function setupChatRequest(body: ChatRequest) {
  // Get existing custom tools
  const mcpTools = getMcpTools();
  
  // Optionally add Composio tools
  const composioTools = await getComposioTools(body.email, {
    toolkits: ['GMAIL']
  });
  
  // Merge tools
  const tools = { ...mcpTools, ...composioTools };
  
  return {
    // ... rest of config
    tools,
  };
}
```

#### Pattern 3: Server Actions
```typescript
// app/actions.ts
'use server';

import { getComposioTools } from '@/lib/composio/getComposioTools';

export async function sendEmailAction(userId: string, to: string, subject: string, body: string) {
  const tools = await getComposioTools(userId, {
    tools: ['GMAIL_SEND_EMAIL']
  });
  
  // Execute tool directly or with AI
  // ...
}
```

## 📚 Tool Authorization

Before using Composio tools, users need to authorize their accounts:

```typescript
// Server-side authorization flow
import { getComposioClient } from '@/lib/composio/client';

export async function POST(req: Request) {
  const { userId, toolkit } = await req.json();
  const composio = getComposioClient();
  
  if (!composio) {
    return Response.json({ error: 'Composio not configured' }, { status: 500 });
  }
  
  // Initialize authorization
  const connection = await composio.toolkits.authorize(userId, toolkit);
  
  return Response.json({
    redirectUrl: connection.redirectUrl,
    message: 'Visit the URL to authorize your account'
  });
}
```

Users visit the `redirectUrl` to complete OAuth, then tools become available.

## 🧪 Testing

To verify Composio is working:

```bash
# 1. Check API key is set
grep COMPOSIO_API_KEY .env

# 2. Check packages are installed
npm list @composio/core @composio/vercel

# 3. Test in an API route (see examples above)
```

## 📖 Documentation

- [Composio Quickstart](https://docs.composio.dev/docs/quickstart)
- [Vercel AI SDK Provider](https://docs.composio.dev/providers/vercel)
- [Available Toolkits](https://docs.composio.dev/docs/tools)

## 🚫 Common Mistakes

1. ❌ Using `getComposioClient()` in client components
2. ❌ Passing Composio instance through React context
3. ❌ Exposing API key with `NEXT_PUBLIC_` prefix
4. ❌ Forgetting user authorization before fetching tools

## ✅ Best Practices

1. ✅ Only call Composio functions in API routes or Server Actions
2. ✅ Always check if client exists before using
3. ✅ Handle errors gracefully when tools fail to load
4. ✅ Keep API key in server-only environment variables
5. ✅ Test authorization flow before deploying

