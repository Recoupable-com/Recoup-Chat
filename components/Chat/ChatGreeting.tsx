import { Plus_Jakarta_Sans } from "next/font/google";
import { useUserProvider } from "@/providers/UserProvder";
import useIsMobile from "@/hooks/useIsMobile";
import { useArtistProvider } from "@/providers/ArtistProvider";

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
              <span className="text-[#A0A0A8]">{artistName}&apos;s</span>
            ) : (
              <span className="text-[#A0A0A8]">your artist&apos;s</span>
            )}
          </span>
        </div>
      ) : (
        <div className="flex items-start flex-wrap">
          <span>Hey there</span>
          <span className="ml-1 mr-2 text-[16px] sm:text-[20px]">👋</span>
          <span className="text-[#A0A0A8]">
            Ask me about{" "}
            {isArtistSelected ? (
              <span className="text-[#A0A0A8]">{artistName}&apos;s</span>
            ) : (
              <span className="text-[#A0A0A8]">your artist&apos;s</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatGreeting;
