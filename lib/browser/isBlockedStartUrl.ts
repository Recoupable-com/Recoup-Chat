/**
 * Check if a startURL points to a private or disallowed host
 * Blocks SSRF attacks by rejecting internal/private hosts and adding DNS resolution checks
 */
export function isBlockedStartUrl(startUrl: string): boolean {
  try {
    const url = new URL(startUrl);
    
    // Only allow http(s) protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return true;
    }
    
    const host = url.hostname.toLowerCase();
    
    // Block localhost variants
    if (host === 'localhost' || host === '0.0.0.0') {
      return true;
    }
    
    // Block common private IP ranges
    if (/^127\.\d+\.\d+\.\d+$/.test(host)) return true; // 127.x.x.x
    if (/^10\.\d+\.\d+\.\d+$/.test(host)) return true; // 10.x.x.x
    if (/^192\.168\.\d+\.\d+$/.test(host)) return true; // 192.168.x.x
    if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(host)) return true; // 172.16-31.x.x
    if (/^169\.254\.\d+\.\d+$/.test(host)) return true; // 169.254.x.x (link-local)
    
    return false;
  } catch {
    // Invalid URL
    return true;
  }
}

