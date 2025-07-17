import { Suggestion } from "@/hooks/usePromptSuggestions";
import { Youtube } from "lucide-react";
import Image from "next/image";
import TiktokIcon from "@/public/brand-logos/tiktok.png";
import SpotifyIcon from "@/public/brand-logos/spotify.png";
import InstagramIcon from "@/public/brand-logos/instagram.png";

const PromptIcon = ({
  type,
  className,
}: {
  type: Suggestion["type"];
  className?: string;
}) => {
  switch (type) {
    case "youtube":
      return <Youtube className={`text-red-500 ${className} w-4 h-4`} />;
    case "tiktok":
      return (
        <Image
          src={TiktokIcon}
          alt="TikTok"
          width={16}
          height={16}
          className={className}
        />
      );
    case "spotify":
      return (
        <Image
          src={SpotifyIcon}
          alt="Spotify"
          width={16}
          height={16}
          className={className}
        />
      );
    case "instagram":
      return (
        <Image
          src={InstagramIcon}
          alt="Instagram"
          width={16}
          height={16}
          className={className}
        />
      );
    case "other":
      return null;
    default:
      return null;
  }
};

export default PromptIcon;
