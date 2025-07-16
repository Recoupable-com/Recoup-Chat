"use client";

import { useArtistProvider } from "@/providers/ArtistProvider";
import StandaloneYoutubeComponent from "../ArtistSetting/StandaloneYoutubeComponent";

export function ChatInputYoutubeButton() {
    const { selectedArtist } = useArtistProvider();
  return <StandaloneYoutubeComponent artistAccountId={selectedArtist?.account_id as string} dense={true}/>
}
