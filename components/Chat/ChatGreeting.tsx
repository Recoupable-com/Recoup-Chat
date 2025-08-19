import { Plus_Jakarta_Sans } from "next/font/google";
import { useUserProvider } from "@/providers/UserProvder";
import useIsMobile from "@/hooks/useIsMobile";
import { useArtistProvider } from "@/providers/ArtistProvider";
import WordRotate from "../ui/word-rotate";
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
    text-[19px]
    sm:text-[22px]
    lg:text-[28px] 
    leading-[1.3]
    sm:leading-[1.2]
    lg:leading-[1.3] 
    tracking-[-0.25px]
    lg:tracking-[-0.3px] 
    font-medium 
  `;

  const fadeBase = "transition-opacity duration-700 ease-out";
  const fadeStart = "opacity-0";
  const fadeEnd = "opacity-100";

  const wordComponent = (word: string, icon?: ReactNode) => {
    return (
      <span className="inline-flex items-center gap-1">
        {icon}
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
        <div className="flex items-start flex-wrap">
          <span>Hey {firstName}</span>
          <span className="ml-1 mr-2 text-[16px] sm:text-[20px]">👋</span>
          <span className="text-[#A0A0A8]">
            Ask me about{" "}
            {isArtistSelected ? (
              <span className="text-[#A0A0A8]">{artistName}&apos;s </span>
            ) : (
              <span className="text-[#A0A0A8]">your artist&apos;s </span>
            )}
          </span>
          <WordRotate
            duration={3000}
            className="inline text-[#000]/70 font-bold"
            words={[
              wordComponent("Youtube", <Image src={YoutubeIcon} alt="Youtube" className="w-6 h-6" />),
              wordComponent("Fans"),
              wordComponent("Instagram", <Image src={InstagramIcon} alt="Instagram" className="w-6 h-6" />),
              wordComponent("Analytics"),
              wordComponent("Tiktok", <Image src={TiktokIcon} alt="Tiktok" className="w-6 h-6" />),
              wordComponent("Songs"),
              wordComponent("Spotify", <Image src={SpotifyIcon} alt="Spotify" className="w-6 h-6" />),
              wordComponent("Albums"),
              wordComponent("Engagement"),
              wordComponent("Demographics"),
            ]}
          />
        </div>
      ) : (
        <div className="flex items-start flex-wrap">
          <span>Hey there</span>
          <span className="ml-1 mr-2 text-[16px] sm:text-[20px]">👋</span>
          <span className="text-[#A0A0A8]">
            Ask me about{" "}
            {isArtistSelected ? (
              <span className="text-[#A0A0A8]">{artistName}&apos;s </span>
            ) : (
              <span className="text-[#A0A0A8]">your artist&apos;s </span>
            )}
          </span>
          <WordRotate
            duration={3000}
            className="inline text-[#000]/70 font-bold"
            words={[
              wordComponent("Youtube", <Image src={YoutubeIcon} alt="Youtube" className="w-6 h-6" />),
              wordComponent("Fans"),
              wordComponent("Instagram", <Image src={InstagramIcon} alt="Instagram" className="w-6 h-6" />),
              wordComponent("Analytics"),
              wordComponent("Tiktok", <Image src={TiktokIcon} alt="Tiktok" className="w-6 h-6" />),
              wordComponent("Songs"),
              wordComponent("Spotify", <Image src={SpotifyIcon} alt="Spotify" className="w-6 h-6" />),
              wordComponent("Albums"),
              wordComponent("Engagement"),
              wordComponent("Demographics"),
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default ChatGreeting;
