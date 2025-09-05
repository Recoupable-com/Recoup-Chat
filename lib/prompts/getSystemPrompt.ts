import { SYSTEM_PROMPT } from "@/lib/consts";
import getArtistIdForRoom from "../supabase/getArtistIdForRoom";
import getArtistInstruction from "../supabase/getArtistInstruction";

export async function getSystemPrompt({
  roomId,
  artistId,
  accountId,
  email,
  knowledgeBaseText,
  artistInstruction,
  conversationName = "New conversation",
  timezone,
}: {
  roomId?: string;
  artistId?: string;
  accountId?: string;
  email?: string;
  knowledgeBaseText?: string;
  artistInstruction?: string;
  conversationName?: string;
  timezone?: string;
}): Promise<string> {
  const resolvedArtistId = artistId || (await getArtistIdForRoom(roomId || ""));

  let systemPrompt = `${SYSTEM_PROMPT} 

  The active artist_account_id is ${resolvedArtistId}. 
  The account_id is ${accountId || "Unknown"} use this to create / delete artists.
  The active_account_email is ${email || "Unknown"}. 
  The active_conversation_id is ${roomId || "No ID"}.
  The active_conversation_name is ${conversationName || "No Chat Name"}.
  The active_timezone is ${timezone || "Unknown"}. If you need current local time, prefer using the get_local_time tool and pass this timezone as the input parameter when available.`;

  const customInstruction = artistInstruction || await getArtistInstruction(resolvedArtistId || "");
  if (customInstruction) {
    systemPrompt = `${systemPrompt}
-----ARTIST CUSTOM INSTRUCTION-----
${customInstruction}
-----END ARTIST CUSTOM INSTRUCTION-----`;
  }

  const knowledge = knowledgeBaseText;
  if (knowledge) {
    systemPrompt = `${systemPrompt}
-----ARTIST KNOWLEDGE BASE-----
${knowledge}
-----END KNOWLEDGE BASE-----`;
  }

  return systemPrompt;
}

export default getSystemPrompt;
