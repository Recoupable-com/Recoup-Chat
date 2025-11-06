/**
 * Convert frequency and time back to cron expression
 */
export const convertFrequencyAndTimeToCron = (
  frequency: string,
  time: string
): string => {
  try {
    // Parse time (e.g., "9:00 AM" -> hour: 9, minute: 0)
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!timeMatch) {
      throw new Error("Invalid time format");
    }

    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3];

    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    // Generate cron based on frequency
    switch (frequency) {
      case "Daily":
        return `${minute} ${hour} * * *`;
      case "Weekly":
        // Default to Monday (1) for weekly
        return `${minute} ${hour} * * 1`;
      case "Monthly":
        // Default to 1st day of month for monthly
        return `${minute} ${hour} 1 * *`;
      case "Once": {
        // For "Once", we'll use the current date
        const now = new Date();
        return `${minute} ${hour} ${now.getDate()} ${now.getMonth() + 1} *`;
      }
      default:
        return `${minute} ${hour} * * *`; // Default to daily
    }
  } catch {
    return "0 9 * * *"; // Default fallback
  }
};
