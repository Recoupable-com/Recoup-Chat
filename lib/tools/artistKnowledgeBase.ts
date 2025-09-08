import { z } from "zod";
import { FileUIPart, ModelMessage, convertToModelMessages, tool } from "ai";
import { getArtistKnowledge } from "../supabase/getArtistKnowledge";
import createMessageFileAttachment from "../chat/createFileAttachment";
import getKnowbaseReportReferenceMessage from "../chat/toolChains/getKnowbaseReportReferenceMessage";

interface ArtistKnowledgeBaseResponse {
  success: true;
  artist_id: string;
  messages: ModelMessage[];
  message: string;
  attachedFilesCount: number;
}

const artistKnowledgeBase = tool({
  description:
    "If you need any information related to the artist, call this tool with artist_id to access their knowledge base.",
  inputSchema: z.object({
    artist_id: z.string().min(1, "Artist ID is required"),
  }),
  execute: async ({ artist_id }: { artist_id: string }): Promise<ArtistKnowledgeBaseResponse> => {
    const knowledgeFiles = await getArtistKnowledge(artist_id);
    const supportedFiles = knowledgeFiles.filter(
      (file) => file.type === "application/pdf" || file.type.startsWith("image")
    );

    const fileAttachments = supportedFiles
      .map((file) => createMessageFileAttachment({ url: file.url, type: file.type }))
      .filter((attachment): attachment is FileUIPart => attachment !== null);

    const reference = getKnowbaseReportReferenceMessage();
    const referenceText = typeof reference.content === "string" ? reference.content : "";

    const parts: Array<{ type: "text"; text: string } | FileUIPart> = [
      { type: "text", text: referenceText },
      ...fileAttachments,
    ];

    const messages: ModelMessage[] = convertToModelMessages([
      {
        role: "user",
        parts,
      },
    ]);

    return {
      success: true,
      artist_id,
      messages,
      message: "Knowledge base reference prepared with attached files.",
      attachedFilesCount: fileAttachments.length,
    };
  },
});

export default artistKnowledgeBase;


