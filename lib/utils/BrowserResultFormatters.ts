/**
 * Data formatting utilities for browser tool results
 */

// Limits for safe serialization
const MAX_JSON_LENGTH = 500;
const MAX_JSON_DEPTH = 3;

// Priority metric field names
export const PRIORITY_FIELDS = [
  'followerCount', 'followingCount', 'postCount', 'likesCount', 
  'subscribers', 'views', 'price', 'rating', 'title', 'name'
] as const;

// Helper: Check if field name is a priority metric
export const isPriorityField = (key: string): boolean =>
  PRIORITY_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()));

// Format camelCase or snake_case field names to readable labels
export function formatFieldName(fieldName: string): string {
  return fieldName
    // Handle camelCase: insert space before capitals
    .replace(/([A-Z])/g, ' $1')
    // Handle snake_case: replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter of each word
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

// Format field values with appropriate type handling
export function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value.trim() || null;
  }

  if (typeof value === 'number') {
    // Format large numbers with commas
    return value.toLocaleString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : null;
  }

  if (typeof value === 'object') {
    return safeStringifyObject(value);
  }

  return String(value);
}

// Safe JSON serialization with depth and length limits
function safeStringifyObject(obj: object): string {
  try {
    let depth = 0;
    
    const depthLimitedReplacer = (_key: string, value: unknown) => {
      if (typeof value === 'object' && value !== null) {
        depth++;
        if (depth > MAX_JSON_DEPTH) {
          return '[Object (max depth)]';
        }
      }
      return value;
    };

    const result = JSON.stringify(obj, depthLimitedReplacer, 2);
    
    if (result.length > MAX_JSON_LENGTH) {
      return result.slice(0, MAX_JSON_LENGTH) + '...';
    }
    
    return result;
  } catch {
    // Handle circular references or stringify failures
    return '[Object (truncated)]';
  }
}

