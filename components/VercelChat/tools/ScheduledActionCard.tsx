import React from "react";
import { Calendar, Clock, Play, Pause, Trash2 } from "lucide-react";
import { formatScheduledActionDate } from "@/lib/utils/formatScheduledActionDate";
import { parseCronToHuman } from "@/lib/utils/cronUtils";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";

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
      className={cn(`border rounded-xl p-4 transition-all ${
        action.enabled 
          ? "border-green-200 bg-green-50/30" 
          : "border-gray-200 bg-gray-50/30"
      }`,
    {
      "bg-red-50/30 border-red-200 opacity-70": isDeleted,
    }
    )}
    >
      {/* Action Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
              {action.title}
            </h4>
            {isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Play className="h-3 w-3 mr-1" />
                Active
              </span>
            )}
            {isPaused && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <Pause className="h-3 w-3 mr-1" />
                Paused
              </span>
            )}
            {isDeleted && (
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <Trash2 className="h-3 w-3 mr-1" />
                Deleted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Prompt */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {action.prompt}
        </p>
      </div>

      {/* Schedule Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.65rem]">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
          <span className="font-medium">Schedule:</span>
          <span>{parseCronToHuman(action.schedule)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
          <span className="font-medium">Next run:</span>
          <span>{formatScheduledActionDate(action.next_run)}</span>
        </div>
      </div>

      {/* Last Run */}
      {action.last_run && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="font-medium">Last run:</span>
            <span>{formatScheduledActionDate(action.last_run)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledActionCard;