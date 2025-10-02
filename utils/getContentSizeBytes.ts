/**
 * Calculate the size of text content in bytes
 */
export function getContentSizeBytes(content: string): number {
  return new TextEncoder().encode(content).length;
}

