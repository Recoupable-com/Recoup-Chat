import { z } from "zod";
import { tool } from "ai";
import { findFileByName } from "@/lib/supabase/files/findFileByName";
import { copyFileByKey } from "@/lib/supabase/storage/copyFileByKey";
import { deleteFileByKey } from "@/lib/supabase/storage/deleteFileByKey";
import { updateFileName } from "@/lib/supabase/files/updateFileName";
import { isValidFileName } from "@/utils/isValidFileName";
import { isValidPath } from "@/utils/isValidPath";
import supabase from "@/lib/supabase/serverClient";

/**
 * Escape special LIKE wildcard characters to prevent injection
 */
function escapeLikePattern(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

/**
 * Get file extension from filename (e.g., "report.pdf" -> ".pdf")
 */
function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) return ''; // No extension or hidden file
  return fileName.slice(lastDot);
}

const renameFileOrFolder = tool({
  description: `
Rename a file or folder in storage. Use this to fix typos, improve naming, or reorganize.

When to use:
- Fix typo in file or folder name
- Update name for better clarity
- Standardize naming conventions

Important:
- For FILES: The file extension is ALWAYS preserved (e.g., renaming "old.pdf" to "new" becomes "new.pdf")
- For FOLDERS: All files and subfolders inside are automatically updated
- New name must not already exist in the same directory
- Item stays in the same location (use move_file to change location)
- Special characters and path separators are not allowed in names
`,
  inputSchema: z.object({
    fileName: z
      .string()
      .describe("Current name of the file or folder (e.g., 'old-research.md' or 'Albums')"),
    newFileName: z
      .string()
      .describe("New name for the file or folder (e.g., 'updated-research' or 'Music'). For files, do not include extension - it will be preserved automatically."),
    path: z
      .string()
      .optional()
      .describe("Optional subdirectory path where item is located (e.g., 'research', 'reports')"),
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
      // 1. Validate path to prevent directory traversal
      if (path && !isValidPath(path)) {
        return {
          success: false,
          error: "Invalid path provided.",
          message: `Path '${path}' is invalid. Paths cannot contain directory traversal sequences (.., ./), backslashes, or control characters.`,
        };
      }

      // 2. Find the file or folder
      const fileRecord = await findFileByName(
        fileName,
        active_account_id,
        active_artist_id,
        path
      );

      if (!fileRecord) {
        return {
          success: false,
          error: `'${fileName}' not found${path ? ` in '${path}'` : ""}.`,
          message: `Cannot rename - '${fileName}' does not exist. Use list_files to see available items.`,
        };
      }

      const isFolder = fileRecord.is_directory;
      
      // 3. For files: preserve the original file extension
      let finalNewFileName = newFileName;
      if (!isFolder) {
        const extension = getFileExtension(fileName);
        if (extension && !newFileName.endsWith(extension)) {
          finalNewFileName = newFileName + extension;
        }
      }

      // 4. Validate new filename
      if (!isValidFileName(finalNewFileName)) {
        return {
          success: false,
          error: "Invalid new name.",
          message: `New name '${finalNewFileName}' is invalid. Names cannot contain path separators (/  \\), special characters (..), or be reserved system names.`,
        };
      }

      // 5. Check if new name is the same as current name
      if (fileName === finalNewFileName) {
        return {
          success: false,
          error: "New name is the same as current name.",
          message: `Item is already named '${fileName}'. No changes needed.`,
        };
      }

      // 6. Check if new name already exists in same directory
      const existingFile = await findFileByName(
        finalNewFileName,
        active_account_id,
        active_artist_id,
        path
      );

      if (existingFile) {
        return {
          success: false,
          error: `'${finalNewFileName}' already exists${path ? ` in '${path}'` : ""}.`,
          message: `Cannot rename - an item named '${finalNewFileName}' already exists in the same location. Choose a different name.`,
        };
      }

      // 7. Generate new storage key (same path, new name)
      const baseStoragePath = `files/${active_account_id}/${active_artist_id}`;
      const normalizedPath = path?.replace(/^\/+|\/+$/g, '');
      const fullPath = normalizedPath
        ? `${baseStoragePath}/${normalizedPath}/`
        : `${baseStoragePath}/`;
      
      const newStorageKey = isFolder 
        ? `${fullPath}${finalNewFileName}/`
        : `${fullPath}${finalNewFileName}`;

      // 8. Handle folder renaming (update all children)
      if (isFolder) {
        const oldStorageKey = fileRecord.storage_key;
        
        // Find all files and subfolders inside this folder
        const escapedKey = escapeLikePattern(oldStorageKey);
        const { data: children, error: childrenError } = await supabase
          .from("files")
          .select("id, storage_key, file_name")
          .like("storage_key", `${escapedKey}%`)
          .neq("id", fileRecord.id);

        if (childrenError) {
          throw new Error(`Failed to find children: ${childrenError.message}`);
        }

        // Update all children storage keys
        if (children && children.length > 0) {
          for (const child of children) {
            const newChildStorageKey = child.storage_key.replace(
              oldStorageKey,
              newStorageKey
            );
            
            const { error: updateError } = await supabase
              .from("files")
              .update({
                storage_key: newChildStorageKey,
                updated_at: new Date().toISOString(),
              })
              .eq("id", child.id);

            if (updateError) {
              throw new Error(`Failed to update child: ${updateError.message}`);
            }
          }
        }

        // Update the folder itself
        await updateFileName(fileRecord.id, finalNewFileName, newStorageKey);

        return {
          success: true,
          oldName: fileName,
          newName: finalNewFileName,
          type: "folder",
          childrenUpdated: children?.length || 0,
          path: path || "root",
          storageKey: newStorageKey,
          message: `Successfully renamed folder '${fileName}' to '${finalNewFileName}'${children?.length ? ` (updated ${children.length} items inside)` : ''}.`,
        };
      }

      // 9. Handle file renaming (copy and delete from storage)
      await copyFileByKey(
        fileRecord.storage_key,
        newStorageKey,
        fileRecord.mime_type || undefined
      );

      await updateFileName(fileRecord.id, finalNewFileName, newStorageKey);
      await deleteFileByKey(fileRecord.storage_key);

      return {
        success: true,
        oldName: fileName,
        newName: finalNewFileName,
        type: "file",
        path: path || "root",
        storageKey: newStorageKey,
        message: `Successfully renamed file '${fileName}' to '${finalNewFileName}'.`,
      };
    } catch (error) {
      console.error("Error in rename_file_or_folder tool:", error);

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

export default renameFileOrFolder;

