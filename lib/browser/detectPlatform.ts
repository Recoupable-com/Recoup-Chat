/**
 * Detects the social media platform from a URL
 * Single source of truth for platform detection across browser tools
 */
export function detectPlatform(url?: string): string {
  if (!url) return "browser";

  const urlLower = url.toLowerCase();

  if (urlLower.includes("instagram")) return "instagram";
  if (urlLower.includes("facebook")) return "facebook";
  if (urlLower.includes("tiktok")) return "tiktok";
  if (urlLower.includes("youtube")) return "youtube";
  if (urlLower.includes("x.com") || urlLower.includes("twitter")) return "x";
  if (urlLower.includes("threads")) return "threads";

  return "browser";
}

/**
 * Gets platform info with emoji for UI display
 */
export function getPlatformInfo(url?: string) {
  const platform = detectPlatform(url);

  const platformEmojis: Record<string, string> = {
    instagram: "📸",
    facebook: "👤",
    x: "✖️",
    youtube: "📺",
    tiktok: "🎵",
    threads: "🧵",
    browser: "🌐",
  };

  return {
    name: platform,
    emoji: platformEmojis[platform] || "🌐",
  };
}

