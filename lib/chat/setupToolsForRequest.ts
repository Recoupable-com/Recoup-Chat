import { ToolSet } from "ai";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { filterExcludedTools } from "./filterExcludedTools";

/**
 * Sets up and filters tools for a chat request
 * @param excludeTools - Optional array of tool names to exclude
 * @returns Filtered tool set ready for use
 */
export function setupToolsForRequest(excludeTools?: string[]): ToolSet {
  const allTools = getMcpTools();
  const tools = filterExcludedTools(allTools, excludeTools);
  
  console.log("🔧 setupToolsForRequest - Tools:", {
    totalTools: Object.keys(allTools).length,
    filteredTools: Object.keys(tools).length,
    hasNanoBananaEdit: "nano_banana_edit" in tools,
    hasNanoBananaGenerate: "nano_banana_generate" in tools,
  });
  
  return tools;
}

