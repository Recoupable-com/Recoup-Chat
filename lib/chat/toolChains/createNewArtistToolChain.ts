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
  {
    toolName: "create_knowledge_base",
    system:
      "Aggregate all findings from: artist_deep_research, spotify_deep_research, get_artist_socials, get_spotify_artist_top_tracks, get_spotify_artist_albums, get_spotify_album. De-duplicate and organize into sections: Profile, Socials, Top Tracks, Albums, Notable Facts, Sources (with links/IDs). Pass the full compiled text as knowledgeBaseText to this tool.",
  },
  {
    toolName: "generate_txt_file",
    system:
      "Use the compiled knowledge base text from the previous create_knowledge_base step as contents. Generate a TXT file with that exact text.",
  },
  { toolName: "update_account_info" },
  { toolName: "search_web" },
  { toolName: "update_artist_socials" },
  { toolName: "search_web" },
  {
    toolName: "create_knowledge_base",
    system:
      "Aggregate all useful findings from prior steps in this phase, especially all search_web results (there may be multiple). Ignore outputs from update_account_info and update_artist_socials. De-duplicate, cite sources with URLs, and pass the compiled text as knowledgeBaseText.",
  },
  {
    toolName: "generate_txt_file",
    system:
      "Use the compiled knowledge base text from the immediately preceding create_knowledge_base as contents. Generate a TXT file with that exact text.",
  },
  { toolName: "update_account_info" },
  { toolName: "create_segments" },
  { toolName: "youtube_login" },
];
