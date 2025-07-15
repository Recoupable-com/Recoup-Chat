export const getDisplayToolName = (name: string) => {
  switch (name) {
    case "search_web":
      return "Search Internet";
    default:
      return name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};
