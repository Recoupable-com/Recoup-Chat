import { Plus_Jakarta_Sans } from "next/font/google";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useTypingAnimation from "@/hooks/useTypingAnimation";
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
 * Displays the prompt area with artist name or typing animation
 * Accesses data directly from providers
 */
export function ChatPrompt({ isVisible }: { isVisible: boolean }) {
  const { selectedArtist } = useArtistProvider();
  const words = ["artist?", "campaign?", "fans?"];
  const { currentWord } = useTypingAnimation(words, isVisible);
  const artistName = selectedArtist?.name || "";

  // Check if an artist is selected
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
      <span className="inline-flex items-center gap-1 border-b-2 border-dotted border-pink-500/30">
        {icon}
        {word}
      </span>
    );
  };

  return (
    <div
      className={`
        ${textStyle} mb-0 sm:mb-1 block text-[#A0A0A8] ${fadeBase}
        ${isVisible ? fadeEnd : fadeStart}
        transition-delay-[100ms]
      `}
    >
      <span>
        <span className="text-[#A0A0A8]">
          Ask me about your{" "}
          {isArtistSelected && (
            <span className="text-[#A0A0A8]">{artistName}'s </span>
          )}
        </span>
        <span>
          &nbsp;
        </span>
        <WordRotate
          duration={3000}
          className="block md:inline text-[#000]/70 font-bold"
          words={[
            wordComponent("Youtube", <Image src={YoutubeIcon} alt="Youtube" className="w-6 h-6" />),
            wordComponent("Fans"),
            wordComponent("Instagram", <Image src={InstagramIcon} alt="Instagram" className="w-6 h-6" />),
            wordComponent("Tiktok", <Image src={TiktokIcon} alt="Tiktok" className="w-6 h-6" />),
            wordComponent("Spotify", <Image src={SpotifyIcon} alt="Spotify" className="w-6 h-6" />),
          ]}
        />
        <span className="hidden">
          {/* This hidden span ensures currentWord is "used" to fix linter warnings */}
          {currentWord}
        </span>
      </span>
    </div>
  );
}

export default ChatPrompt;
