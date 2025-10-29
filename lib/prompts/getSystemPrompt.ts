import { SYSTEM_PROMPT } from "@/lib/consts";
import getArtistIdForRoom from "../supabase/getArtistIdForRoom";
import getArtistInstruction from "../supabase/getArtistInstruction";
import getKnowledgeBaseContext from "../agent/getKnowledgeBaseContext";

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

  **IMPORTANT CONTEXT VALUES (use these exact values in tools):**
  - account_id: ${accountId || "Unknown"} (use this for ALL tools that require account_id parameter)
  - artist_account_id: ${resolvedArtistId}
  - active_account_email: ${email || "Unknown"}
  - active_conversation_id: ${roomId || "No ID"}
  - active_conversation_name: ${conversationName || "No Chat Name"}
  - active_timezone: ${timezone || "Unknown"} (use with get_local_time tool when available)

  **IMAGE EDITING INSTRUCTIONS:**
  When the user asks to edit an image (e.g., "add glasses", "make it darker", "add a hat"):
  
  **WHICH IMAGE TO EDIT:**
  1. Check conversation history for the most recent nano_banana_edit tool result
  2. If found: Use the imageUrl from that result (e.g., "https://v3b.fal.media/files/...")
  3. If NOT found OR user says "original": Use the URL from "ATTACHED IMAGE URLS" section below
  4. This ensures edits build on each other (glasses → then hat keeps the glasses)
  
  **HOW TO CALL THE TOOL:**
  - IMMEDIATELY call nano_banana_edit (don't explain first)
  - imageUrl: The URL determined from steps above (NEVER use "attachment://")
  - prompt: Describe the edit clearly (e.g., "add sunglasses to the person")
  - account_id: Use the account_id value shown above
  - DO NOT ask the user for any information - you have everything you need`;

  const customInstruction = artistInstruction || await getArtistInstruction(resolvedArtistId || "");
  if (customInstruction) {
    systemPrompt = `${systemPrompt}
-----ARTIST CUSTOM INSTRUCTION-----
${customInstruction}
-----END ARTIST CUSTOM INSTRUCTION-----`;
  }

  const knowledge = knowledgeBaseText || await getKnowledgeBaseContext(resolvedArtistId || "");
  if (knowledge) {
    systemPrompt = `${systemPrompt}
-----ARTIST KNOWLEDGE BASE-----
${knowledge}
-----END KNOWLEDGE BASE-----`;
  }

  return systemPrompt;
}

export default getSystemPrompt;
