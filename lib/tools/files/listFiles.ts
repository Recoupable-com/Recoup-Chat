import { z } from "zod";
import { tool } from "ai";
import { TEXT_EXTENSIONS } from "@/lib/consts/fileExtensions";

const listFiles = tool({
  description: `
List files in storage for the current artist. Use this to discover what files exist before reading or updating them.

When to use:
- Before creating a new file, check if it already exists
- To show the user what files are available
- To find files matching a pattern or in a specific directory
- Before reading a file, to confirm it exists and get its exact name
`,
  inputSchema: z.object({
    path: z
      .string()
      .optional()
      .describe("Optional subdirectory path to list files from (e.g., 'research', 'reports'). Defaults to root directory."),
    textFilesOnly: z
      .boolean()
      .optional()
      .default(false)
      .describe("If true, only return text-based files (md, txt, json, etc). If false, return all files."),
    active_account_id: z
      .string()
      .describe("Pull active_account_id from the system prompt"),
    active_artist_id: z
      .string()
      .describe("Pull active_artist_id from the system prompt"),
  }),
  execute: async ({ path, textFilesOnly, active_account_id, active_artist_id }) => {
    try {
      // Build the API URL with query parameters
      const params = new URLSearchParams({
        ownerAccountId: active_account_id,
        artistAccountId: active_artist_id,
      });

      if (path) {
        params.append("path", path);
      }

      const apiUrl = `/api/files/list?${params.toString()}`;
      const response = await fetch(apiUrl, { cache: "no-store" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to list files");
      }

      const data = await response.json();
      let files = data.files || [];

      // Filter to text files only if requested
      if (textFilesOnly && files.length > 0) {
        files = files.filter((file: { file_name: string; is_directory?: boolean }) => {
          // Keep directories (for navigation)
          if (file.is_directory) return true;

          // Check if file has a text extension
          return TEXT_EXTENSIONS.some((ext) =>
            file.file_name.toLowerCase().endsWith(ext)
          );
        });
      }

      // Format the response
      const fileList = files.map((file: {
        file_name: string;
        storage_key: string;
        size_bytes: number | null;
        mime_type: string | null;
        is_directory?: boolean;
        created_at: string;
      }) => ({
        fileName: file.file_name,
        storageKey: file.storage_key,
        sizeBytes: file.size_bytes,
        mimeType: file.mime_type,
        isDirectory: file.is_directory || false,
        createdAt: file.created_at,
      }));

      return {
        success: true,
        files: fileList,
        count: fileList.length,
        path: path || "root",
        textFilesOnly,
        message: `Found ${fileList.length} ${textFilesOnly ? "text " : ""}file(s)${path ? ` in '${path}'` : ""}.`,
      };
    } catch (error) {
      console.error("Error in listFiles tool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        files: [],
        count: 0,
        error: errorMessage,
        message: `Failed to list files: ${errorMessage}`,
      };
    }
  },
});

export default listFiles;
