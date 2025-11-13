import { z } from "zod";
import { tool } from "ai";
import { findFileByName } from "@/lib/supabase/files/findFileByName";
import { uploadFileByKey } from "@/lib/supabase/storage/uploadFileByKey";
import { updateFileSizeBytes } from "@/lib/supabase/files/updateFileSizeBytes";
import { fetchFileContentServer } from "@/lib/supabase/storage/fetchFileContent";
import { normalizeContent } from "@/lib/utils/normalizeContent";

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

      // 2. Read current content to check if it's actually changing
      const currentContent = await fetchFileContentServer(fileRecord.storage_key);
      console.log(`[UPDATE_FILE] Reading current content for '${fileName}'`);
      console.log(`[UPDATE_FILE] Current content length: ${currentContent.length} bytes`);
      console.log(`[UPDATE_FILE] Current content preview: ${currentContent.substring(0, 100)}...`);

      // Check if content is identical (no actual change)
      // Normalize both to avoid false changes due to whitespace/encoding differences
      const normalizedCurrent = normalizeContent(currentContent);
      const normalizedNewPreUpload = normalizeContent(newContent);
      
      console.log(`[UPDATE_FILE] Normalized current length: ${normalizedCurrent.length}`);
      console.log(`[UPDATE_FILE] Normalized new length: ${normalizedNewPreUpload.length}`);
      
      if (normalizedCurrent === normalizedNewPreUpload) {
        console.log(`[UPDATE_FILE] Content is identical, skipping update`);
        return {
          success: false,
          noChange: true,
          error: "Content is identical to existing file.",
          message: `No update needed - '${fileName}' already contains this exact content.`,
        };
      }

      // 3. Update file content in storage
      console.log(`[UPDATE_FILE] Uploading new content for '${fileName}'`);
      console.log(`[UPDATE_FILE] New content length: ${newContent.length} bytes`);
      console.log(`[UPDATE_FILE] New content preview: ${newContent.substring(0, 100)}...`);
      
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
      
      console.log(`[UPDATE_FILE] Upload complete, waiting for cache to update...`);
      
      // Wait 150ms for Supabase Storage cache to update before verifying
      await new Promise(resolve => setTimeout(resolve, 150));
      
      console.log(`[UPDATE_FILE] Cache wait complete, now verifying...`);

      // 4. Verify content actually changed by reading it back
      const updatedContent = await fetchFileContentServer(fileRecord.storage_key);
      console.log(`[UPDATE_FILE] Verification: Read back content length: ${updatedContent.length} bytes`);
      console.log(`[UPDATE_FILE] Verification: Content preview: ${updatedContent.substring(0, 100)}...`);

      // Normalize content for comparison (ignore minor formatting differences)
      const normalizedUpdated = normalizeContent(updatedContent);
      const normalizedNew = normalizeContent(newContent);
      
      console.log(`[UPDATE_FILE] Verification: Normalized updated length: ${normalizedUpdated.length}`);
      console.log(`[UPDATE_FILE] Verification: Normalized new length: ${normalizedNew.length}`);
      console.log(`[UPDATE_FILE] Verification: Contents match? ${normalizedUpdated === normalizedNew}`);

      // Verify the new content matches what we intended to write (ignore minor whitespace differences)
      if (normalizedUpdated !== normalizedNew) {
        console.error(`[UPDATE_FILE] ⚠️ VERIFICATION FAILED`);
        console.error(`[UPDATE_FILE] Expected content: ${normalizedNew.substring(0, 200)}`);
        console.error(`[UPDATE_FILE] Actual content: ${normalizedUpdated.substring(0, 200)}`);
        return {
          success: false,
          verified: false,
          error: "File content does not match what was uploaded.",
          message: `Update verification failed - '${fileName}' was modified but doesn't contain the expected content. Found ${updatedContent.length} bytes instead of expected ${newContent.length} bytes.`,
          suggestion: "Read the current file content to see what it contains, then retry the update.",
        };
      }
      
      console.log(`[UPDATE_FILE] ✅ Verification successful!`);

      // 5. Update file size in metadata
      const newSizeBytes = new TextEncoder().encode(updatedContent).length;
      await updateFileSizeBytes(fileRecord.id, newSizeBytes);

      return {
        success: true,
        verified: true,
        storageKey: fileRecord.storage_key,
        fileName,
        sizeBytes: newSizeBytes,
        path: path || "root",
        message: `Successfully updated and verified '${fileName}' (${newSizeBytes} bytes).`,
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
