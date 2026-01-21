import { ToolChainItem } from "./toolChains";
import getKnowledgeBaseReportReferenceMessage from "./getKnowbaseReportReferenceMessage";

export const createNewArtistToolChain: ToolChainItem[] = [
  { toolName: "get_spotify_search" },
  {
    toolName: "update_account_info",
    system:
      "From the get_spotify_search results, select the artist whose name best matches the user-provided artist name (prefer exact, case-insensitive match; otherwise choose the closest by name and popularity). Update the account using the update_account_info tool with the artist's basic information: name, image, label, etc.",
  },
  { toolName: "update_artist_socials" },
  { toolName: "artist_deep_research" },
  { toolName: "spotify_deep_research" },
  { toolName: "get_artist_socials" },
  { toolName: "get_spotify_artist_top_tracks" },
  { toolName: "get_spotify_artist_albums" },
  { toolName: "get_spotify_album" },
  { toolName: "search_web" },
  { toolName: "update_artist_socials" },
  {
    toolName: "search_web",
    messages: [getKnowledgeBaseReportReferenceMessage()],
  },
  {
    toolName: "create_knowledge_base",
    messages: [getKnowledgeBaseReportReferenceMessage()],
  },
  {
    toolName: "generate_txt_file",
    messages: [getKnowledgeBaseReportReferenceMessage()],
  },
  { toolName: "update_account_info" },
  { toolName: "create_segments" },
  { toolName: "youtube_login" },
];
