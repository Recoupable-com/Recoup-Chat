import React from "react";
import { Clock, Edit, Repeat } from "lucide-react";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import { parseCronToHuman } from "@/lib/utils/cronUtils";

// Simple schedule formatter
const formatScheduleSimply = (cronExpression: string): string => {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length >= 5) {
      const minute = parts[0];
      const hour = parts[1];
      const dayOfMonth = parts[2];
      const month = parts[3];
      const dayOfWeek = parts[4];
      
      const timeStr = formatTime(hour, minute);
      
      // Daily at specific time
      if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return `Daily at ${timeStr}`;
      }
      
      // Weekly on specific day
      if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
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
      if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
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

const isToday = (dayOfMonth: string, month: string, dayOfWeek: string): boolean => {
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentDayOfWeek = new Date().getDay();
  
  // Check if it matches today's date
  if (dayOfMonth !== '*' && month !== '*') {
    return parseInt(dayOfMonth) === today && parseInt(month) === currentMonth;
  }
  
  // Check if it's today's day of week
  if (dayOfWeek !== '*' && dayOfMonth === '*' && month === '*') {
    return parseInt(dayOfWeek) === currentDayOfWeek;
  }
  
  return false;
};

const isTomorrow = (dayOfMonth: string, month: string, dayOfWeek: string): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.getDate();
  const tomorrowMonth = tomorrow.getMonth() + 1;
  const tomorrowDayOfWeek = tomorrow.getDay();
  
  // Check if it matches tomorrow's date
  if (dayOfMonth !== '*' && month !== '*') {
    return parseInt(dayOfMonth) === tomorrowDate && parseInt(month) === tomorrowMonth;
  }
  
  // Check if it's tomorrow's day of week
  if (dayOfWeek !== '*' && dayOfMonth === '*' && month === '*') {
    return parseInt(dayOfWeek) === tomorrowDayOfWeek;
  }
  
  return false;
};

const formatTime = (hour: string, minute: string): string => {
  const hourNum = parseInt(hour);
  const minuteNum = parseInt(minute);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  return `${displayHour}:${minuteNum.toString().padStart(2, '0')} ${period}`;
};

const getDayName = (dayOfWeek: string): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = parseInt(dayOfWeek);
  return days[dayIndex] || 'Day';
};

const isRecurring = (cronExpression: string): boolean => {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length >= 5) {
      const dayOfMonth = parts[2];
      const month = parts[3];
      const dayOfWeek = parts[4];
      
      // Daily recurring
      if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return true;
      }
      
      // Weekly recurring
      if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
        return true;
      }
      
      // Monthly recurring
      if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

type ScheduledAction = Tables<"scheduled_actions">;

export interface ScheduledActionCardProps {
  action: ScheduledAction;
  isDeleted?: boolean;
}

const ScheduledActionCard: React.FC<ScheduledActionCardProps> = ({ action, isDeleted }) => {
  const isActive = action.enabled && !isDeleted;
  const isPaused = !action.enabled && !isDeleted;
  return (
    <div
      className={cn(`group flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors -mx-4`,
    {
      "opacity-70": isDeleted,
    }
    )}
    >
      <div className="flex items-center space-x-4">
        <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <h4 className="text-base font-medium text-gray-900">
          {action.title}
        </h4>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {isRecurring(action.schedule) && (
            <Repeat className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          <span className="text-base text-gray-600">
            {formatScheduleSimply(action.schedule)}
          </span>
        </div>
        <div className="flex items-center space-x-2 w-16 justify-end relative">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
          {isActive && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full group-hover:hidden absolute">
              Active
            </span>
          )}
          {isPaused && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full group-hover:hidden absolute">
              Paused
            </span>
          )}
          {isDeleted && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full group-hover:hidden absolute">
              Deleted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledActionCard;