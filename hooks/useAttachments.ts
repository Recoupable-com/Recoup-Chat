import { useState, useCallback } from "react";
import { FileUIPart } from "ai";
import { TextAttachment } from "@/types/textAttachment";

/**
 * Hook for managing file attachments in chat
 * Handles file attachments state and pending uploads
 */
export default function useAttachments() {
  const [attachments, setAttachments] = useState<FileUIPart[]>([]);
  const [textAttachments, setTextAttachments] = useState<TextAttachment[]>([]);

  // Remove an attachment by its index
  const removeAttachment = useCallback(
    (indexToRemove: number) => {
      const attachmentToRemove = attachments[indexToRemove];

      // If the attachment has a blob URL, revoke it to prevent memory leaks
      if (attachmentToRemove?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(attachmentToRemove.url);
      }

      setAttachments((prevAttachments: FileUIPart[]) =>
        prevAttachments.filter((_, index) => index !== indexToRemove)
      );
    },
    [attachments]
  );

  // Remove a text attachment by its index
  const removeTextAttachment = useCallback((indexToRemove: number) => {
    setTextAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // Clear all attachments (both file and text)
  const clearAttachments = useCallback(() => {
    // Revoke any blob URLs to prevent memory leaks
    attachments.forEach((attachment: FileUIPart) => {
      if (attachment.url?.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.url);
      }
    });

    setAttachments([]);
    setTextAttachments([]);
  }, [attachments]);

  // Filter for pending attachments (currently being uploaded)
  const pendingAttachments = attachments.filter(
    (attachment: FileUIPart) =>
      attachment.url?.startsWith("blob:") || !attachment.url
  );

  // Check if there are any pending uploads
  const hasPendingUploads = pendingAttachments.length > 0;

  return {
    attachments,
    setAttachments,
    pendingAttachments,
    removeAttachment,
    clearAttachments,
    hasPendingUploads,
    textAttachments,
    setTextAttachments,
    removeTextAttachment,
  };
}
