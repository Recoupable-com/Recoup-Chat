import React from "react";
import ScheduledActionCard from "../ScheduledActionCard";
import { CheckCircle2 } from "lucide-react";
import ScheduledActionDetailsDialog from "../../dialogs/ScheduledActionDetailsDialog";
import { UpdateTaskResult } from "@/lib/tools/tasks/updateTask";

const UpdateTaskSuccess = ({ result }: { result: UpdateTaskResult }) => {
  const { actions, message } = result;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h3 className="text-sm font-semibold text-gray-900">Tasks</h3>
        </div>
        <p className="text-xs text-gray-600 mt-1">{message}</p>
      </div>

      {/* Actions List */}
      <div className="p-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {actions.map((action) => (
            <ScheduledActionDetailsDialog key={action.id} action={action}>
              <ScheduledActionCard action={action} />
            </ScheduledActionDetailsDialog>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskSuccess;
