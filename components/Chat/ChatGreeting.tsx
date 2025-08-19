import { Plus_Jakarta_Sans } from "next/font/google";
import { useUserProvider } from "@/providers/UserProvder";
import useIsMobile from "@/hooks/useIsMobile";
import { useArtistProvider } from "@/providers/ArtistProvider";
import WordTypewriter from "../ui/word-typewriter";
import { ReactNode } from "react";
import YoutubeIcon from "@/public/brand-logos/youtube.png";
import InstagramIcon from "@/public/brand-logos/instagram.png";
import Image from "next/image";
import TiktokIcon from "@/public/brand-logos/tiktok.png";
import SpotifyIcon from "@/public/brand-logos/spotify.png";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

/**
 * Displays the greeting message with user's name and prompt
 * Accesses user data directly from providers
 */
export function ChatGreeting({ isVisible }: { isVisible: boolean }) {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const isMobile = useIsMobile();
  const firstName = userData?.name?.split(" ")[0] || "";
  const artistName = selectedArtist?.name || "";
  const isArtistSelected = !!selectedArtist;

  const textStyle = `
    ${plusJakartaSans.className} 
    text-[20px]
    sm:text-[24px]
    lg:text-[28px] 
    leading-[1.4]
    sm:leading-[1.3]
    lg:leading-[1.3] 
    tracking-[-0.02em]
    font-normal
  `;

  const fadeBase = "transition-opacity duration-700 ease-out";
  const fadeStart = "opacity-0";
  const fadeEnd = "opacity-100";

  const wordComponent = (word: string, icon?: ReactNode) => {
    return (
      <span className="inline-flex items-center gap-1.5">
        {icon && <span className="opacity-70">{icon}</span>}
        {word}
      </span>
    );
  };

  return (
    <div
      className={`
        ${textStyle} ${isMobile ? "mb-2" : "mb-2"} ${fadeBase}
        ${isVisible ? fadeEnd : fadeStart}
      `}
    >
      {firstName ? (
        <div className="flex items-baseline flex-wrap gap-x-2">
          <span className="text-black font-medium">Hey {firstName}</span>
          <span className="text-[18px] sm:text-[22px]">👋</span>
          <span className="text-[#6B6B75]">
            Ask me about{" "}
            {isArtistSelected ? (
              <span className="text-[#6B6B75]">{artistName}&apos;s</span>
            ) : (
              <span className="text-[#6B6B75]">your artist&apos;s</span>
            )}
          </span>
          <WordTypewriter
            duration={3000}
            typingSpeed={60}
            className="text-black font-semibold"
            words={[
              wordComponent("YouTube", <Image src={YoutubeIcon} alt="YouTube" className="w-5 h-5" />),
              wordComponent("fans"),
              wordComponent("Instagram", <Image src={InstagramIcon} alt="Instagram" className="w-5 h-5" />),
              wordComponent("analytics"),
              wordComponent("TikTok", <Image src={TiktokIcon} alt="TikTok" className="w-5 h-5" />),
              wordComponent("songs"),
              wordComponent("Spotify", <Image src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />),
              wordComponent("albums"),
              wordComponent("engagement"),
              wordComponent("demographics"),
            ]}
          />
        </div>
      ) : (
        <div className="flex items-baseline flex-wrap gap-x-2">
          <span className="text-black font-medium">Hey there</span>
          <span className="text-[18px] sm:text-[22px]">👋</span>
          <span className="text-[#6B6B75]">
            Ask me about{" "}
            {isArtistSelected ? (
              <span className="text-[#6B6B75]">{artistName}&apos;s</span>
            ) : (
              <span className="text-[#6B6B75]">your artist&apos;s</span>
            )}
          </span>
          <WordTypewriter
            duration={3000}
            typingSpeed={60}
            className="text-black font-semibold"
            words={[
              wordComponent("YouTube", <Image src={YoutubeIcon} alt="YouTube" className="w-5 h-5" />),
              wordComponent("fans"),
              wordComponent("Instagram", <Image src={InstagramIcon} alt="Instagram" className="w-5 h-5" />),
              wordComponent("analytics"),
              wordComponent("TikTok", <Image src={TiktokIcon} alt="TikTok" className="w-5 h-5" />),
              wordComponent("songs"),
              wordComponent("Spotify", <Image src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />),
              wordComponent("albums"),
              wordComponent("engagement"),
              wordComponent("demographics"),
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default ChatGreeting;
