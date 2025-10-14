/**
 * Extracts the domain from a URL for display purposes.
 * Removes 'www.' prefix for cleaner presentation.
 * 
 * @param url - Full URL string
 * @returns Clean domain name (e.g., "example.com")
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Generates a favicon URL using Google's favicon service.
 * Used for displaying site icons in search results and links.
 * 
 * @param domain - Domain name (e.g., "example.com")
 * @param size - Icon size in pixels (default: 32)
 * @returns URL string pointing to the favicon
 */
export function getFaviconUrl(domain: string, size: number = 32): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Generates a fallback SVG data URL for when favicon loading fails.
 * Creates a simple circle icon as a placeholder.
 * 
 * @returns Data URL containing SVG markup
 */
export function getFallbackFaviconUrl(): string {
  return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
}

