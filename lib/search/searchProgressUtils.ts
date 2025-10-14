import { SearchProgress } from "@/lib/tools/searchWeb/types";

/**
 * Checks if a result object is a search progress update
 * @param result - The result object from tool execution
 * @returns true if it's a progress update, false otherwise
 */
export const isSearchProgressUpdate = (result: unknown): result is SearchProgress => {
  return result !== null && 
         typeof result === 'object' && 
         'status' in result;
};

/**
 * Safely casts a result to SearchProgress after validation
 * @param result - The result object from tool execution
 * @returns SearchProgress object or null if invalid
 */
export const asSearchProgress = (result: unknown): SearchProgress | null => {
  return isSearchProgressUpdate(result) ? result : null;
};
