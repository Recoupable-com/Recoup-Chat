const getSocialPlatformByLink = (link: string) => {
  if (!link) return "NONE";
  if (link.includes("x.com") || link.includes("twitter.com")) return "TWITTER";
  if (link.includes("instagram.com")) return "INSTAGRAM";
  if (link.includes("spotify.com")) return "SPOTIFY";
  if (link.includes("tiktok.com")) return "TIKTOK";
  if (link.includes("apple.com")) return "APPPLE";
  if (link.includes("youtube.")) return "YOUTUBE";
  if (link.includes("facebook.com")) return "FACEBOOK";
  if (link.includes("threads.net")) return "THREADS";
  if (link.includes("linkedin.com")) return "LINKEDIN";
  if (link.includes("snapchat.com")) return "SNAPCHAT";

  return "NONE";
};

export default getSocialPlatformByLink;
