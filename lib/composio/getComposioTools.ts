import { getComposioClient } from "./client";
import { ToolSet } from "ai";

/**
 * getComposioTools()
 * 
 * Fetches Composio tools for a specific user and toolkits/apps.
 * This function should ONLY be called from server-side code (API routes, Server Actions, Server Components).
 * 
 * @param userId - User identifier (email or unique ID) for authorization
 * @param options - Configuration for which tools to fetch
 * @param options.toolkits - Array of toolkit names (e.g., ['GMAIL', 'LINEAR', 'GITHUB'])
 * @param options.tools - Array of specific tool names (e.g., ['GMAIL_SEND_EMAIL'])
 * 
 * @returns ToolSet compatible with Vercel AI SDK, or empty object if client is unavailable
 * 
 * @example
 * // In an API route
 * const composioTools = await getComposioTools('user@example.com', { 
 *   toolkits: ['GMAIL'] 
 * });
 * 
 * // Merge with existing tools
 * const allTools = { ...getMcpTools(), ...composioTools };
 * 
 * // Use with Vercel AI SDK
 * const { text } = await generateText({
 *   model: anthropic('claude-3-7-sonnet-20250219'),
 *   tools: allTools,
 *   messages: [...],
 * });
 */
export async function getComposioTools(
  userId: string,
  options: {
    toolkits?: string[];
    tools?: string[];
  }
): Promise<ToolSet> {
  const composio = getComposioClient();
  
  if (!composio) {
    console.warn('Composio client not available - skipping Composio tools');
    return {};
  }

  try {
    // Fetch tools using Composio SDK
    // The VercelProvider automatically formats tools with execute functions
    const tools = await composio.tools.get(userId, options);
    
    return tools;
  } catch (error) {
    console.error('Error fetching Composio tools:', error);
    return {};
  }
}

