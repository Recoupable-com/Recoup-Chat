export const parseCronParts = (cronExpression = "* * * * *"): string[] => {
  const parts = (cronExpression || "* * * * *").trim().split(/\s+/).slice(0, 5);
  while (parts.length < 5) {
    parts.push("*");
  }
  return parts;
};

export default parseCronParts;
