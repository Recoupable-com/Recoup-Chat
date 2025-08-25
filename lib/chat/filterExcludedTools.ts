import { ToolSet } from "ai";

/**
 * Filters out excluded tools from a tools object
 * @param tools - The tools object to filter
 * @param excludeTools - Array of tool names to exclude
 * @returns Filtered tools object with excluded tools removed
 */
export function filterExcludedTools(
  tools: ToolSet,
  excludeTools?: string[]
): ToolSet {
  if (!excludeTools || excludeTools.length === 0) {
    return tools;
  }

  const filteredTools = Object.fromEntries(
    Object.entries(tools).filter(
      ([toolName]) => !excludeTools.includes(toolName)
    )
  );

  return filteredTools as ToolSet;
}
