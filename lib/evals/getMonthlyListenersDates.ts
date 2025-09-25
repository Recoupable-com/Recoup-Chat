export interface DynamicDates {
  startDateFormatted: string;
  endDateFormatted: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Generates dynamic dates for monthly listeners tracking:
 * - End date: 1 week ago from today
 * - Start date: 1 month prior to end date
 *
 * @returns Object containing formatted date strings and Date objects
 */
export function getDynamicDates(): DynamicDates {
  const today = new Date();

  // End date: 1 week ago
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 7);

  // Start date: 1 month prior to end date
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 1);

  // Format dates as "Month Day" (e.g., "June 6", "September 12")
  const formatDate = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return {
    startDateFormatted: formatDate(startDate),
    endDateFormatted: formatDate(endDate),
    startDate,
    endDate,
  };
}
