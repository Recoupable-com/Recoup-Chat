import { SYSTEM_PROMPT } from "@/lib/consts";

export function getSystemPrompt({
  roomId,
  artistId,
  accountId,
  email,
  knowledgeBaseText,
  artistInstruction,
  conversationName = "New conversation",
}: {
  roomId?: string;
  artistId?: string;
  accountId?: string;
  email?: string;
  knowledgeBaseText?: string;
  artistInstruction?: string;
  conversationName?: string;
}): string {
  const resolvedArtistId = artistId;

  let systemPrompt = `${SYSTEM_PROMPT} 

  The active artist_account_id is ${resolvedArtistId}. 
  The account_id is ${accountId || "Unknown"} use this to create / delete artists.
  The active_account_email is ${email || "Unknown"}. 
  The active_conversation_id is ${roomId || "No ID"}.
  The active_conversation_name is ${conversationName || "No Chat Name"}.`;

  const customInstruction = artistInstruction;
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
