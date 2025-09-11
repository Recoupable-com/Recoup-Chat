export default function isValidStorageKey(key: string): boolean {
  if (!key || key.length > 1024) return false;
  if (key.startsWith("/")) return false;
  if (key.includes("..")) return false;
  if (key.includes("\\")) return false;
  return true;
}


