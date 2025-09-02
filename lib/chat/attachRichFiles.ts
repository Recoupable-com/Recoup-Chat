import {
  UIMessage,
  ModelMessage,
  convertToModelMessages,
  FileUIPart,
} from "ai";
import type { KnowledgeBaseEntry } from "../supabase/getArtistKnowledge";
import createMessageFileAttachment from "./createFileAttachment";

const findLastUserMessageIndex = (messages: UIMessage[]): number => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return i;
  }
  return -1;
};

const attachRichFiles = async (
  messages: UIMessage[],
  {
    knowledgeFiles,
  }: { artistId: string; knowledgeFiles?: KnowledgeBaseEntry[] }
): Promise<ModelMessage[]> => {
  const lastUserIndex = findLastUserMessageIndex(messages);
  // Get and process artist knowledge files
  const supportedFiles = (knowledgeFiles || []).filter(
    (file) => file.type === "application/pdf" || file.type.startsWith("image")
  );

  const fileAttachments = supportedFiles
    .map(createMessageFileAttachment)
    .filter((attachment): attachment is FileUIPart => attachment !== null);

  // Transform messages, adding attachments to the user message
  // Ref. https://ai-sdk.dev/providers/ai-sdk-providers/anthropic#pdf-support
  const transformedMessages = messages.map((message, idx) => {
    if (idx === lastUserIndex && message.role === "user") {
      // Process user-uploaded attachments from experimental_attachments
      const userAttachments =
        message.parts
          ?.map((part) =>
            part.type === "file"
              ? createMessageFileAttachment({
                  url: part.url,
                  type: part.mediaType,
                })
              : null
          )
          .filter(
            (attachment): attachment is FileUIPart => attachment !== null
          ) || [];

      const content = [
        {
          type: "text" as const,
          text: message.parts.find((part) => part.type === "text")?.text || "",
        },
        ...fileAttachments,
        ...userAttachments,
      ];

      return {
        role: "user" as const,
        parts: content,
      };
    }

    return message;
  });

  return convertToModelMessages(transformedMessages);
};

export default attachRichFiles;
