import React from "react";
import { CreateTasksResult } from "@/lib/tools/tasks/createTasks";
import ScheduledActionCard from "../ScheduledActionCard";
import CreateScheduledActionsError from "../CreateScheduledActionsError";
import { CheckCircle, Calendar } from "lucide-react";
import ScheduledActionDetailsDialog from "../../dialogs/ScheduledActionDetailsDialog";

interface CreateTasksSuccessProps {
  result: CreateTasksResult;
}

const CreateTasksSuccess: React.FC<CreateTasksSuccessProps> = ({
  result,
}) => {
  const { actions, message, error } = result;

  // Error state
  if (error) {
    return <CreateScheduledActionsError message={message} error={error} />;
  }

  // Success state
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-2xl">
      {/* Success Header */}
      <div className="flex items-start space-x-3 mb-4">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800 flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>
              {actions.length === 0 
                ? "Tasks processed successfully"
                : actions.length === 1 
                  ? "1 task created successfully" 
                  : `${actions.length} tasks created successfully`
              }
            </span>
          </h3>
        </div>
      </div>

      {/* Actions List */}
      {actions.length > 0 && (
        <div className="space-y-3">
          <div className="space-y-2">
            {actions.map((action, index) => (
              <ScheduledActionDetailsDialog 
                key={action.id || index} 
                action={action}
               >
                <ScheduledActionCard action={action} />
              </ScheduledActionDetailsDialog>
            ))}
          </div>
        </div>
      )}

      {/* Empty state (shouldn't happen in success, but just in case) */}
      {actions.length === 0 && (
        <div className="text-center py-4">
          <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-600">
            No tasks to display
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateTasksSuccess;

