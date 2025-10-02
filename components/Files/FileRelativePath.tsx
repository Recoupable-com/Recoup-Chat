import getRelativeStoragePath from "@/utils/getRelativeStoragePath";

type FileRelativePathProps = {
  storageKey: string;
  isDirectory?: boolean;
};

/**
 * Displays the relative path of a file by extracting owner/artist IDs from storage key
 * and using the existing getRelativeStoragePath utility
 */
export default function FileRelativePath({ storageKey, isDirectory }: FileRelativePathProps) {
  // Extract owner and artist IDs from storage key (format: files/{owner}/{artist}/...)
  const extractIds = (key: string) => {
    const parts = key.split("/");
    return {
      ownerAccountId: parts[1] || "",
      artistAccountId: parts[2] || "",
    };
  };

  const { ownerAccountId, artistAccountId } = extractIds(storageKey);
  const relativePath = getRelativeStoragePath(storageKey, ownerAccountId, artistAccountId, isDirectory);

  return <>{relativePath}</>;
}

