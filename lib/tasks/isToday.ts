/**
 * Checks if a cron expression matches today's date or day of week
 */
export const isToday = (
  dayOfMonth: string,
  month: string,
  dayOfWeek: string
): boolean => {
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentDayOfWeek = new Date().getDay();

  // Check if it matches today's date
  if (dayOfMonth !== "*" && month !== "*") {
    return parseInt(dayOfMonth) === today && parseInt(month) === currentMonth;
  }

  // Check if it's today's day of week
  if (dayOfWeek !== "*" && dayOfMonth === "*" && month === "*") {
    return parseInt(dayOfWeek) === currentDayOfWeek;
  }

  return false;
};
