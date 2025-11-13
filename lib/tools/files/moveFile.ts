import { z } from "zod";
import { tool } from "ai";
import { findFileByName } from "@/lib/supabase/files/findFileByName";
import { ensureDirectoryExists } from "@/lib/supabase/files/ensureDirectoryExists";
import { copyFileByKey } from "@/lib/supabase/storage/copyFileByKey";
import { deleteFileByKey } from "@/lib/supabase/storage/deleteFileByKey";
import { updateFileStorageKey } from "@/lib/supabase/files/updateFileStorageKey";
import isValidStorageKey from "@/utils/isValidStorageKey";

const moveFile = tool({
  description: `
Move a file from one directory to another. Use this to reorganize files into proper folders.

When to use:
- Organize files into category folders
- Move research into a dedicated reports folder
- Restructure file organization
- Consolidate related files into one location

Important:
- V1 supports files only (not directories)
- Target directory must be specified (cannot move to root if already there)
- File keeps the same name (use rename_file_or_folder to change name)
- Target file cannot already exist
`,
  inputSchema: z.object({
    fileName: z
      .string()
      .describe("Name of the file to move (e.g., 'research.md')"),
    sourcePath: z
      .string()
      .optional()
      .describe("Current directory path (e.g., 'old-folder'). Leave empty if file is in root directory."),
    targetPath: z
      .string()
      .describe("Destination directory path (e.g., 'reports', 'research/2024'). Cannot be empty."),
    active_account_id: z
      .string()
      .describe("Pull active_account_id from the system prompt"),
    active_artist_id: z
      .string()
      .describe("Pull active_artist_id from the system prompt"),
  }),
  execute: async ({
    fileName,
    sourcePath,
    targetPath,
    active_account_id,
    active_artist_id,
  }) => {
    try {
      // 1. Find the file
      const fileRecord = await findFileByName(
        fileName,
        active_account_id,
        active_artist_id,
        sourcePath
      );

      if (!fileRecord) {
        return {
          success: false,
          error: `File '${fileName}' not found${sourcePath ? ` in '${sourcePath}'` : " in root directory"}.`,
          message: `Cannot move - '${fileName}' does not exist. Use list_files to see available files.`,
        };
      }

      // 2. Check if it's a directory (not supported in V1)
      if (fileRecord.is_directory) {
        return {
          success: false,
          error: `'${fileName}' is a directory.`,
          message: "Directory moving is not supported in V1. Only files can be moved.",
        };
      }

      // 3. Validate target path
      if (!targetPath || targetPath.trim() === "") {
        return {
          success: false,
          error: "Target path cannot be empty.",
          message: "Please specify a destination directory. Use rename_file_or_folder if you want to keep the file in the same location.",
        };
      }

      // Generate full target path for validation
      const baseStoragePath = `files/${active_account_id}/${active_artist_id}/`;
      const fullTargetPath = `${baseStoragePath}${targetPath.endsWith("/") ? targetPath : targetPath + "/"}`;

      if (!isValidStorageKey(fullTargetPath)) {
        return {
          success: false,
          error: "Invalid target path.",
          message: `Target path '${targetPath}' contains invalid characters or patterns. Paths cannot contain '..' or start with '/'.`,
        };
      }

      // 4. Check if moving to same location
      const normalizedSourcePath = sourcePath?.trim() || "";
      const normalizedTargetPath = targetPath.trim();

      if (normalizedSourcePath === normalizedTargetPath) {
        return {
          success: false,
          error: "Source and target paths are the same.",
          message: `File '${fileName}' is already in '${targetPath}'. No move needed.`,
        };
      }

      // 5. Ensure target directory exists
      await ensureDirectoryExists(active_account_id, active_artist_id, targetPath);

      // 6. Check if file with same name exists in target directory
      const existingFile = await findFileByName(
        fileName,
        active_account_id,
        active_artist_id,
        targetPath
      );

      if (existingFile) {
        // DEBUG: Log what file was found to understand the bug
        console.log('[moveFile] Conflict detected:', {
          fileName,
          targetPath,
          existingFile: {
            id: existingFile.id,
            storage_key: existingFile.storage_key,
            file_name: existingFile.file_name,
          },
        });
        
        return {
          success: false,
          error: `File '${fileName}' already exists in target directory.`,
          message: `Cannot move - a file named '${fileName}' already exists in '${targetPath}'. Rename the file first or choose a different target directory.`,
        };
      }

      // 7. Generate new storage key with target path
      const newStorageKey = `${fullTargetPath}${fileName}`;

      // 8. Copy file to new location
      await copyFileByKey(
        fileRecord.storage_key,
        newStorageKey,
        fileRecord.mime_type || undefined
      );

      // 9. Update database record with new storage key
      await updateFileStorageKey(fileRecord.id, newStorageKey);

      // 10. Delete old storage file
      await deleteFileByKey(fileRecord.storage_key);

      return {
        success: true,
        fileName,
        sourcePath: sourcePath || "root",
        targetPath,
        storageKey: newStorageKey,
        message: `Successfully moved '${fileName}' from '${sourcePath || "root"}' to '${targetPath}'.`,
      };
    } catch (error) {
      console.error("Error in moveFile tool:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        error: errorMessage,
        message: `Failed to move '${fileName}': ${errorMessage}`,
      };
    }
  },
});

export default moveFile;

