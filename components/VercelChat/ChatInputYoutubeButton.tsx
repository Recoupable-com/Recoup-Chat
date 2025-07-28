"use client";

import { useArtistProvider } from "@/providers/ArtistProvider";
import StandaloneYoutubeComponent from "../ArtistSetting/StandaloneYoutubeComponent";
import ChatInputYoutubeButtonPopover from "../YouTube/ChatInputYoutubeButtonPopover";
import { useVercelChatContext } from "@/providers/VercelChatProvider";

export function ChatInputYoutubeButton() {
  const { selectedArtist } = useArtistProvider();
  const { messages } = useVercelChatContext();
  
  return (
    <ChatInputYoutubeButtonPopover artistAccountId={selectedArtist?.account_id as string}>
      <StandaloneYoutubeComponent
        artistAccountId={selectedArtist?.account_id as string}
        dense={true}
      />
    </ChatInputYoutubeButtonPopover>
  );
}
