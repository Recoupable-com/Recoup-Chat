import { TOOL_CHAIN_CREATE_KNOWLEDGE_BASE_SYSTEM_PROMPT } from "@/lib/consts";
import { ToolChainItem } from "./toolChains";

export const createNewArtistToolChain: ToolChainItem[] = [
  { toolName: "get_spotify_search" },
  {
    toolName: "update_account_info",
    system:
      "Read first artist's information from the result of the get_spotify_search tool and update the account using the update_account_info tool with the artist's basic information. Information you should get is: name, image, label etc.",
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
  { toolName: "search_web" },
  {
    toolName: "create_knowledge_base",
    system: TOOL_CHAIN_CREATE_KNOWLEDGE_BASE_SYSTEM_PROMPT,
  },
  { toolName: "generate_txt_file" },
  { toolName: "update_account_info" },
  { toolName: "create_segments" },
  { toolName: "youtube_login" },
];
