import { TEXT_EXTENSIONS } from "@/lib/consts/fileExtensions";

/**
 * Check if a file is a text file based on its name
 */
export function isTextFile(fileName: string): boolean {
  const lowerName = fileName.toLowerCase();
  return TEXT_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

