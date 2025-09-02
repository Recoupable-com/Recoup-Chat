import { SYSTEM_PROMPT } from "@/lib/consts";
import getKnowledgeBaseContext from "@/lib/agent/getKnowledgeBaseContext";
import getArtistInstruction from "../supabase/getArtistInstruction";
import { KnowledgeBaseEntry } from "../supabase/getArtistKnowledge";

export async function getSystemPrompt({
  roomId,
  artistId,
  accountId,
  email,
  knowledgeFiles,
  conversationName = "New conversation",
}: {
  roomId?: string;
  artistId?: string;
  accountId?: string;
  email?: string;
  knowledgeFiles?: KnowledgeBaseEntry[];
  conversationName?: string;
}): Promise<string> {
  const resolvedArtistId = artistId;

  let systemPrompt = `${SYSTEM_PROMPT} 

  Current date and time in UTC: ${new Date().toISOString()}
  The active artist_account_id is ${resolvedArtistId}. 
  The account_id is ${accountId || "Unknown"} use this to create / delete artists.
  The active_account_email is ${email || "Unknown"}. 
  The active_conversation_id is ${roomId || "No ID"}.
  The active_conversation_name is ${conversationName || "No Chat Name"}.`;

  const customInstruction = await getArtistInstruction(resolvedArtistId || "");
  if (customInstruction) {
    systemPrompt = `${systemPrompt}
-----ARTIST CUSTOM INSTRUCTION-----
${customInstruction}
-----END ARTIST CUSTOM INSTRUCTION-----`;
  }

  const knowledge = await getKnowledgeBaseContext(knowledgeFiles);
  if (knowledge) {
    systemPrompt = `${systemPrompt}
-----ARTIST KNOWLEDGE BASE-----
${knowledge}
-----END KNOWLEDGE BASE-----`;
  }

  return systemPrompt;
}

export default getSystemPrompt;
