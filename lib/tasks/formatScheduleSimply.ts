import { parseCronToHuman } from "./parseCronToHuman";
import { formatTime } from "./formatTime";
import { getDayName } from "./getDayName";
import { isToday } from "./isToday";
import { isTomorrow } from "./isTomorrow";

/**
 * Formats a cron expression into a simple, human-readable schedule string
 */
export const formatScheduleSimply = (cronExpression: string): string => {
  try {
    const parts = cronExpression.split(" ");
    if (parts.length >= 5) {
      const minute = parts[0];
      const hour = parts[1];
      const dayOfMonth = parts[2];
      const month = parts[3];
      const dayOfWeek = parts[4];

      const timeStr = formatTime(hour, minute);

      // Daily at specific time
      if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        return `Daily at ${timeStr}`;
      }

      // Weekly on specific day
      if (dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") {
        const dayName = getDayName(dayOfWeek);
        return `Weekly on ${dayName}`;
      }

      // If it's a one-time task for today
      if (isToday(dayOfMonth, month, dayOfWeek)) {
        return `Today at ${timeStr}`;
      }

      // If it's tomorrow
      if (isTomorrow(dayOfMonth, month, dayOfWeek)) {
        return `Tomorrow at ${timeStr}`;
      }

      // Monthly on specific day
      if (dayOfMonth !== "*" && month === "*" && dayOfWeek === "*") {
        return `Monthly on day ${dayOfMonth}`;
      }

      // Specific time
      return `At ${timeStr}`;
    }
    return parseCronToHuman(cronExpression);
  } catch {
    return parseCronToHuman(cronExpression);
  }
};
