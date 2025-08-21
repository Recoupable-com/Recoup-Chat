import { z } from "zod";
import { tool } from "ai";
import createArtistInDb from "../supabase/createArtistInDb";
import copyRoom from "../supabase/copyRoom";

export interface CreateArtistResult {
  artist?: {
    account_id: string;
    name: string;
    image?: string;
  };
  artistAccountId?: string;
  message: string;
  error?: string;
  newRoomId?: string | null;
}

const createArtist = tool({
  description: `
  Create a new artist account in the system.
  Requires the artist name and the account ID of the user with admin access to the new artist account.
  The active_conversation_id parameter is optional — when omitted, use the active_conversation_id from the system prompt
  to copy the conversation. Never ask the user to provide a room ID.
  `,
  inputSchema: z.object({
    name: z.string().describe("The name of the artist to be created"),
    account_id: z
      .string()
      .describe(
        "The account ID of the human with admin access to the new artist account"
      ),
    active_conversation_id: z
      .string()
      .optional()
      .describe(
        "The ID of the room/conversation to copy for this artist's first conversation. " +
          "If not provided, use the active_conversation_id from the system prompt."
      ),
  }),
  execute: async ({
    name,
    account_id,
    active_conversation_id,
  }): Promise<CreateArtistResult> => {
    try {
      // Step 1: Create the artist account
      const artist = await createArtistInDb(name, account_id);

      if (!artist) {
        throw new Error("Failed to create artist");
      }

      // Step 2: Copy the conversation to the new artist
      let newRoomId = null;
      if (active_conversation_id) {
        newRoomId = await copyRoom(active_conversation_id, artist.account_id);
      }

      return {
        artist,
        artistAccountId: artist.account_id,
        message: `Successfully created artist "${name}". Now searching Spotify for this artist to connect their profile...`,
        newRoomId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create artist for unknown reason";
      return {
        error: errorMessage,
        message: `Failed to create artist: ${errorMessage}`,
      };
    }
  },
});

export default createArtist;
