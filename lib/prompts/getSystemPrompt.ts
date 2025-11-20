import { SYSTEM_PROMPT } from "@/lib/consts";
import getArtistIdForRoom from "../supabase/getArtistIdForRoom";
import getArtistInstruction from "../supabase/getArtistInstruction";
import getKnowledgeBaseContext from "../agent/getKnowledgeBaseContext";
import getUserInfo from "../supabase/getUserInfo";

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

  // Add user information section
  console.log("[getSystemPrompt] Fetching user info for accountId:", accountId);
  const userInfo = await getUserInfo(accountId || "");
  console.log("[getSystemPrompt] User info retrieved:", JSON.stringify(userInfo, null, 2));
  
  if (userInfo) {
    let userSection = `

-----CURRENT USER CONTEXT-----
This is information about the person currently using this application (the human you're talking to):

Name: ${userInfo.name || "Not provided"}
Email: ${userInfo.email || email || "Not provided"}`;

    if (userInfo.job_title || userInfo.role_type || userInfo.company_name || userInfo.organization) {
      userSection += `

Professional Context:`;
      if (userInfo.job_title) userSection += `
- Job Title: ${userInfo.job_title}`;
      if (userInfo.role_type) userSection += `
- Role Type: ${userInfo.role_type}`;
      if (userInfo.company_name) userSection += `
- Company: ${userInfo.company_name}`;
      if (userInfo.organization) userSection += `
- Organization: ${userInfo.organization}`;
    }

    if (userInfo.instruction) {
      userSection += `

User's Custom Instructions & Preferences:
${userInfo.instruction}`;
    }

    userSection += `
-----END USER CONTEXT-----`;

    console.log("[getSystemPrompt] User section being added:", userSection);
    systemPrompt = `${systemPrompt}${userSection}`;
  } else {
    console.log("[getSystemPrompt] No user info found!");
  }

  const customInstruction = artistInstruction || await getArtistInstruction(resolvedArtistId || "");
  if (customInstruction) {
    systemPrompt = `${systemPrompt}

-----SELECTED ARTIST/WORKSPACE CONTEXT-----
This is information about the artist/workspace the user is currently working with:

Custom Instructions for this Artist:
${customInstruction}
-----END ARTIST/WORKSPACE CONTEXT-----`;
  }

  const knowledge = knowledgeBaseText || await getKnowledgeBaseContext(resolvedArtistId || "");
  if (knowledge) {
    systemPrompt = `${systemPrompt}

-----ARTIST/WORKSPACE KNOWLEDGE BASE-----
Additional context and knowledge for the selected artist/workspace:
${knowledge}
-----END ARTIST/WORKSPACE KNOWLEDGE BASE-----`;
  }

  console.log("[getSystemPrompt] Final system prompt length:", systemPrompt.length);
  console.log("[getSystemPrompt] System prompt preview (first 500 chars):", systemPrompt.substring(0, 500));
  
  // Log if user context is present in the final prompt
  if (systemPrompt.includes("CURRENT USER CONTEXT")) {
    console.log("[getSystemPrompt] ✅ User context section found in system prompt");
  } else {
    console.log("[getSystemPrompt] ❌ User context section NOT found in system prompt");
  }
  
  return systemPrompt;
}

export default getSystemPrompt;
