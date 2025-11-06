/**
 * Converts a day of week number (0-6) to its day name
 */
export const getDayName = (dayOfWeek: string): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = parseInt(dayOfWeek);
  return days[dayIndex] || "Day";
};
