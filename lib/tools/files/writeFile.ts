import { z } from "zod";
import { tool } from "ai";
import { findFileByName } from "@/lib/supabase/files/findFileByName";
import { uploadFileByKey } from "@/lib/supabase/storage/uploadFileByKey";
import { createFileRecord } from "@/lib/supabase/files/createFileRecord";
import { ensureDirectoryExists } from "@/lib/supabase/files/ensureDirectoryExists";

const writeFile = tool({
  description: `
Create a new file in storage with the provided content. Use this to save research, reports, notes, or any content for the user.

When to use:
- After conducting research, save findings to a file for the user
- Creating reports, summaries, or documentation
- Saving generated content (e.g., analysis results, recommendations)
- Storing structured data (JSON, CSV, etc.)

Important:
- Check if file already exists first using list_files or read_file
- Default path is root directory unless specified
- Supported formats: text files (.txt, .md, .json, .csv, etc.)
`,
  inputSchema: z.object({
    fileName: z
      .string()
      .describe("Name of the file to create (e.g., 'research.md', 'report.txt', 'data.json')"),
    content: z
      .string()
      .describe("The text content to write to the file"),
    mimeType: z
      .string()
      .optional()
      .describe("MIME type of the file (e.g., 'text/plain', 'text/markdown', 'application/json'). Auto-detected if not provided."),
    path: z
      .string()
      .optional()
      .describe("Optional subdirectory path where file should be created (e.g., 'research', 'reports')"),
    description: z
      .string()
      .optional()
      .describe("Optional description of the file content"),
    active_account_id: z
      .string()
      .describe("Pull active_account_id from the system prompt"),
    active_artist_id: z
      .string()
      .describe("Pull active_artist_id from the system prompt"),
  }),
  execute: async ({
    fileName,
    content,
    mimeType,
    path,
    description,
    active_account_id,
    active_artist_id,
  }) => {
    try {
      // 1. Check if file already exists
      const existingFile = await findFileByName(
        fileName,
        active_account_id,
        active_artist_id,
        path
      );

      if (existingFile) {
        return {
          success: false,
          error: `File '${fileName}' already exists${path ? ` in '${path}'` : ""}.`,
          message: `Cannot create file - '${fileName}' already exists. Use update_file to modify existing files, or choose a different name.`,
        };
      }

      // 2. Ensure parent directory exists (if path is provided)
      if (path) {
        await ensureDirectoryExists(active_account_id, active_artist_id, path);
      }

      // 3. Generate storage key
      const baseStoragePath = `files/${active_account_id}/${active_artist_id}/`;
      const fullPath = path
        ? `${baseStoragePath}${path.endsWith("/") ? path : path + "/"}`
        : baseStoragePath;
      const storageKey = `${fullPath}${fileName}`;

      // 4. Auto-detect MIME type if not provided
      let detectedMimeType = mimeType;
      if (!detectedMimeType) {
        const ext = fileName.toLowerCase().split(".").pop();
        const mimeTypeMap: Record<string, string> = {
          txt: "text/plain",
          md: "text/markdown",
          json: "application/json",
          csv: "text/csv",
          xml: "application/xml",
          html: "text/html",
          yaml: "text/yaml",
          yml: "text/yaml",
          log: "text/plain",
        };
        detectedMimeType = mimeTypeMap[ext || ""] || "text/plain";
      }

      // 5. Convert content to Blob and upload
      const blob = new Blob([content], { type: detectedMimeType });
      const file = new File([blob], fileName, { type: detectedMimeType });

      await uploadFileByKey(storageKey, file, {
        contentType: detectedMimeType,
        upsert: false,
      });

      // 6. Calculate size and record metadata
      const sizeBytes = new TextEncoder().encode(content).length;

      const fileRecord = await createFileRecord({
        ownerAccountId: active_account_id,
        artistAccountId: active_artist_id,
        storageKey,
        fileName,
        mimeType: detectedMimeType,
        sizeBytes,
        description,
      });

      return {
        success: true,
        storageKey,
        fileName,
        sizeBytes,
        mimeType: detectedMimeType,
        path: path || "root",
        fileId: fileRecord.id,
        message: `Successfully created file '${fileName}' (${sizeBytes} bytes)${path ? ` in '${path}'` : ""}.`,
      };
    } catch (error) {
      console.error("Error in writeFile tool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        error: errorMessage,
        message: `Failed to create file '${fileName}': ${errorMessage}`,
      };
    }
  },
});

export default writeFile;
