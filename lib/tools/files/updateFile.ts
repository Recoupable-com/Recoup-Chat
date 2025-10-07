import { z } from "zod";
import { tool } from "ai";
import { findFileByName } from "@/lib/supabase/files/findFileByName";
import { uploadFileByKey } from "@/lib/supabase/storage/uploadFileByKey";
import { updateFileSizeBytes } from "@/lib/supabase/files/updateFileSizeBytes";

const updateFile = tool({
  description: `
Update the content of an existing file in storage. Use this to modify, enhance, or iterate on files you previously created.

When to use:
- User asks to "add more detail" or "expand on" existing file
- Updating research findings with new information
- Fixing or improving content in existing files
- Iterating on reports, notes, or documentation

Important:
- File must already exist (use write_file to create new files)
- This will overwrite the current content completely
- Specify fileName and optionally path to locate the file
`,
  inputSchema: z.object({
    fileName: z
      .string()
      .describe("Name of the file to update (e.g., 'research.md', 'report.txt')"),
    newContent: z
      .string()
      .describe("The new content that will replace the current file content"),
    path: z
      .string()
      .optional()
      .describe("Optional subdirectory path where file is located (e.g., 'research', 'reports')"),
    active_account_id: z
      .string()
      .describe("Pull active_account_id from the system prompt"),
    active_artist_id: z
      .string()
      .describe("Pull active_artist_id from the system prompt"),
  }),
  execute: async ({
    fileName,
    newContent,
    path,
    active_account_id,
    active_artist_id,
  }) => {
    try {
      // 1. Find the file
      const fileRecord = await findFileByName(
        fileName,
        active_account_id,
        active_artist_id,
        path
      );

      if (!fileRecord) {
        return {
          success: false,
          error: `File '${fileName}' not found${path ? ` in '${path}'` : ""}.`,
          message: `Cannot update file - '${fileName}' does not exist. Use write_file to create new files.`,
        };
      }

      // Check if it's a directory
      if (fileRecord.is_directory) {
        return {
          success: false,
          error: `'${fileName}' is a directory, not a file.`,
          message: "Cannot update directory. Only files can be updated.",
        };
      }

      // 2. Update file content in storage
      const blob = new Blob([newContent], {
        type: fileRecord.mime_type || "text/plain",
      });
      const file = new File([blob], fileName, {
        type: fileRecord.mime_type || "text/plain",
      });

      await uploadFileByKey(fileRecord.storage_key, file, {
        contentType: fileRecord.mime_type || "text/plain",
        upsert: true,
      });

      // 3. Update file size in metadata
      const newSizeBytes = new TextEncoder().encode(newContent).length;
      await updateFileSizeBytes(fileRecord.id, newSizeBytes);

      return {
        success: true,
        storageKey: fileRecord.storage_key,
        fileName,
        sizeBytes: newSizeBytes,
        path: path || "root",
        message: `Successfully updated '${fileName}' (${newSizeBytes} bytes).`,
      };
    } catch (error) {
      console.error("Error in updateFile tool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        error: errorMessage,
        message: `Failed to update file '${fileName}': ${errorMessage}`,
      };
    }
  },
});

export default updateFile;
