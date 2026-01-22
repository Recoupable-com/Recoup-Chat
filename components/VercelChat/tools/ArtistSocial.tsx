import { Social as SocialType } from "@/types/ArtistSocials";
import Link from "next/link";
import ArtistSocialDisplayText from "./ArtistSocialDisplayText";
import getSocialPlatformByLink from "@/lib/getSocialPlatformByLink";

/**
 * Converts a platform type to a display-friendly name.
 * @param platformType - The platform type (e.g., "SPOTIFY", "TWITTER")
 * @returns Display-friendly platform name (e.g., "Spotify", "Twitter")
 */
const getPlatformDisplayName = (platformType: string): string => {
  const displayNames: Record<string, string> = {
    SPOTIFY: "Spotify",
    TWITTER: "Twitter",
    INSTAGRAM: "Instagram",
    TIKTOK: "TikTok",
    APPPLE: "Apple Music",
    YOUTUBE: "YouTube",
    FACEBOOK: "Facebook",
    THREADS: "Threads",
  };
  return displayNames[platformType] || platformType.charAt(0) + platformType.slice(1).toLowerCase();
};

export const ArtistSocial = ({ social }: { social: SocialType }) => {
  const platformType = getSocialPlatformByLink(social.profile_url);
  const platform = platformType !== "NONE"
    ? getPlatformDisplayName(platformType)
    : social.profile_url.split("/")[0].split(".")[0];

  return (
    <Link
      key={social.id}
      href={`https://${social.profile_url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-start p-4 border rounded-xl transition-all hover:shadow-md hover:scale-[1.02] bg-card hover:bg-accent"
    >
      <span className="text-sm font-medium mb-1 text-card-foreground">{platform}</span>
      <ArtistSocialDisplayText social={social} />
    </Link>
  );
};
