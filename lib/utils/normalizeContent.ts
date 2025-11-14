/**
 * Normalizes content for comparison by handling whitespace, line endings, Unicode, and case.
 *
 * This ensures that minor formatting differences don't cause false verification failures
 * when comparing file content.
 *
 * @param content - The content string to normalize
 * @returns Normalized content string
 */
export function normalizeContent(content: string): string {
  return content
    .trim() // Remove leading/trailing whitespace
    .replace(/\r\n/g, "\n") // Normalize line endings (Windows → Unix)
    .replace(/\r/g, "\n") // Normalize old Mac line endings
    .replace(/\n+$/g, "\n") // Normalize trailing newlines to single newline
    .replace(/[ \t]+$/gm, "") // Remove trailing spaces/tabs from each line
    .normalize("NFC"); // Normalize Unicode characters (e.g., é)
}
