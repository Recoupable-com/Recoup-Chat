export const isTextPath = (value: string): boolean => {
  const lower = value.toLowerCase().split("?")[0];
  const textExtensions = [
    ".txt",
    ".csv",
    ".json",
    ".md",
    ".log",
    ".xml",
    ".yaml",
    ".yml",
  ] as const;
  return textExtensions.some((ext) => lower.endsWith(ext));
};

export default isTextPath;


