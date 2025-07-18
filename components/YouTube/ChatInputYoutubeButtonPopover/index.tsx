import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import useYoutubeStatus from "@/hooks/useYoutubeStatus";
import { Eye, Video, Youtube } from "lucide-react";
import useYoutubeChannel from "@/hooks/useYoutubeChannel";
import StatCard from "./StatCard";
import useIsMobile from "@/hooks/useIsMobile";
import { useState } from "react";
import { DesktopPopoverContent } from "./DesktopPopoverContent";
import { MobilePopoverContent } from "./MobilePopoverContent";

const ChatInputYoutubeButtonPopover = ({
  children,
  artistAccountId,
}: {
  children: React.ReactNode;
  artistAccountId: string;
}) => {
  const { data: youtubeStatus, isLoading } = useYoutubeStatus(artistAccountId);
  const { data: channelInfo, isLoading: isChannelInfoLoading } = useYoutubeChannel(artistAccountId);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const channel = channelInfo?.channels?.[0];

  if (youtubeStatus?.status === "invalid" || isLoading || isChannelInfoLoading) {
    return children;
  }

  if (isMobile) {
    return (
      <div className="relative">
        <div onClick={() => setIsOpen(!isOpen)}>
          {children}
        </div>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile popover - positioned to avoid cutoff */}
            <div className="absolute bottom-full -right-4 mb-2 z-50 w-56 max-w-[calc(100vw-1rem)] translate-x-[11rem]">
              <MobilePopoverContent channel={channel} />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 rounded-xl overflow-hidden">
        <DesktopPopoverContent channel={channel} />
      </HoverCardContent>
    </HoverCard>
  );
};

export default ChatInputYoutubeButtonPopover;
