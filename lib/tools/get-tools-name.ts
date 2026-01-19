export const getDisplayToolName = (name: string) => {
  // Remove default_api. prefix if present (for beta AI SDK compatibility)
  const cleanName = name.startsWith("default_api.") 
    ? name.replace("default_api.", "") 
    : name;

  switch (cleanName) {
    case "search_web":
      return "Search Internet";
    case "COMPOSIO_MANAGE_CONNECTIONS":
      return "Manage Connections";
    default:
      return cleanName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};
