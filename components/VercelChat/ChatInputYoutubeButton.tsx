"use client";

import { useArtistProvider } from "@/providers/ArtistProvider";
import StandaloneYoutubeComponent from "../ArtistSetting/StandaloneYoutubeComponent";
import ChatInputYoutubeButtonPopover from "./ChatInputYoutubeButtonPopover";

export function ChatInputYoutubeButton() {
  const { selectedArtist } = useArtistProvider();
  return (
    <ChatInputYoutubeButtonPopover artistAccountId={selectedArtist?.account_id as string}>
      <StandaloneYoutubeComponent
        artistAccountId={selectedArtist?.account_id as string}
        dense={true}
      />
    </ChatInputYoutubeButtonPopover>
  );
}
