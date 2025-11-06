/**
 * Parse cron expression into frequency and time for editing
 */
export const parseCronToFrequencyAndTime = (
  cronExpression: string
): { frequency: string; time: string } => {
  try {
    const parts = cronExpression.split(" ");
    if (parts.length >= 5) {
      const minute = parts[0];
      const hour = parts[1];
      const dayOfMonth = parts[2];
      const month = parts[3];
      const dayOfWeek = parts[4];

      // Format time
      const hourNum = parseInt(hour, 10);
      const minuteNum = parseInt(minute, 10);

      if (
        isNaN(hourNum) ||
        isNaN(minuteNum) ||
        hourNum < 0 ||
        hourNum > 23 ||
        minuteNum < 0 ||
        minuteNum > 59
      ) {
        return { frequency: "Daily", time: "9:00 AM" };
      }
      const period = hourNum >= 12 ? "PM" : "AM";
      const displayHour =
        hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
      const timeStr = `${displayHour}:${minuteNum.toString().padStart(2, "0")} ${period}`;

      // Determine frequency
      if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        return { frequency: "Daily", time: timeStr };
      } else if (dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") {
        return { frequency: "Weekly", time: timeStr };
      } else if (dayOfMonth !== "*" && month === "*" && dayOfWeek === "*") {
        return { frequency: "Monthly", time: timeStr };
      } else {
        return { frequency: "Once", time: timeStr };
      }
    }
    return { frequency: "Daily", time: "9:00 AM" };
  } catch {
    return { frequency: "Daily", time: "9:00 AM" };
  }
};
