import { z } from "zod";
import { tool } from "ai";
import { findFileByName } from "@/lib/supabase/files/findFileByName";
import { copyFileByKey } from "@/lib/supabase/storage/copyFileByKey";
import { deleteFileByKey } from "@/lib/supabase/storage/deleteFileByKey";
import { updateFileName } from "@/lib/supabase/files/updateFileName";
import { isValidFileName } from "@/utils/isValidFileName";

const renameFile = tool({
  description: `
Rename a file in storage. Use this to fix typos, improve file names, or reorganize naming conventions.

When to use:
- Fix typo in filename
- Update file name for better clarity
- Standardize naming across files
- Change file extension if needed

Important:
- V1 supports files only (not directories)
- New name must not already exist in the same directory
- File stays in the same location (use move_file to change location)
- Special characters and path separators are not allowed in names
`,
  inputSchema: z.object({
    fileName: z
      .string()
      .describe("Current name of the file (e.g., 'old-research.md')"),
    newFileName: z
      .string()
      .describe("New name for the file (e.g., 'updated-research.md')"),
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
    newFileName,
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
          message: `Cannot rename - '${fileName}' does not exist. Use list_files to see available files.`,
        };
      }

      // 2. Check if it's a directory (not supported in V1)
      if (fileRecord.is_directory) {
        return {
          success: false,
          error: `'${fileName}' is a directory.`,
          message: "Directory renaming is not supported in V1. Only files can be renamed.",
        };
      }

      // 3. Validate new filename
      if (!isValidFileName(newFileName)) {
        return {
          success: false,
          error: "Invalid new file name.",
          message: `New file name '${newFileName}' is invalid. File names cannot contain path separators (/  \\), special characters (..), or be reserved system names.`,
        };
      }

      // 4. Check if new name is the same as current name
      if (fileName === newFileName) {
        return {
          success: false,
          error: "New name is the same as current name.",
          message: `File is already named '${fileName}'. No changes needed.`,
        };
      }

      // 5. Check if new name already exists in same directory
      const existingFile = await findFileByName(
        newFileName,
        active_account_id,
        active_artist_id,
        path
      );

      if (existingFile) {
        return {
          success: false,
          error: `File '${newFileName}' already exists${path ? ` in '${path}'` : ""}.`,
          message: `Cannot rename - a file named '${newFileName}' already exists in the same location. Choose a different name.`,
        };
      }

      // 6. Generate new storage key (same path, new filename)
      const baseStoragePath = `files/${active_account_id}/${active_artist_id}/`;
      const fullPath = path
        ? `${baseStoragePath}${path.endsWith("/") ? path : path + "/"}`
        : baseStoragePath;
      const newStorageKey = `${fullPath}${newFileName}`;

      // 7. Copy file to new storage key
      await copyFileByKey(
        fileRecord.storage_key,
        newStorageKey,
        fileRecord.mime_type || undefined
      );

      // 8. Update database record with new name and storage key
      await updateFileName(fileRecord.id, newFileName, newStorageKey);

      // 9. Delete old storage file
      await deleteFileByKey(fileRecord.storage_key);

      return {
        success: true,
        oldFileName: fileName,
        newFileName,
        path: path || "root",
        storageKey: newStorageKey,
        message: `Successfully renamed '${fileName}' to '${newFileName}'.`,
      };
    } catch (error) {
      console.error("Error in renameFile tool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        error: errorMessage,
        message: `Failed to rename '${fileName}': ${errorMessage}`,
      };
    }
  },
});

export default renameFile;

