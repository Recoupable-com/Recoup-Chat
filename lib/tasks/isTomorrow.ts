/**
 * Checks if a cron expression matches tomorrow's date or day of week
 */
export const isTomorrow = (
  dayOfMonth: string,
  month: string,
  dayOfWeek: string
): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.getDate();
  const tomorrowMonth = tomorrow.getMonth() + 1;
  const tomorrowDayOfWeek = tomorrow.getDay();

  // Check if it matches tomorrow's date
  if (dayOfMonth !== "*" && month !== "*") {
    return (
      parseInt(dayOfMonth) === tomorrowDate && parseInt(month) === tomorrowMonth
    );
  }

  // Check if it's tomorrow's day of week
  if (dayOfWeek !== "*" && dayOfMonth === "*" && month === "*") {
    return parseInt(dayOfWeek) === tomorrowDayOfWeek;
  }

  return false;
};
