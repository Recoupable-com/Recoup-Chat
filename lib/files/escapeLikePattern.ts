/**
 * Escape special LIKE wildcard characters in SQL patterns to prevent injection
 * Handles: backslash (\), percent (%), underscore (_)
 */
export function escapeLikePattern(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

