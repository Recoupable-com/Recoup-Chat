import React from "react";
import TaskCard from "./TaskCard";
import { CheckCircle, Calendar } from "lucide-react";
import TaskDetailsDialog from "../../dialogs/tasks/TaskDetailsDialog";
import { UpdateTaskResult } from "@/lib/tools/tasks/updateTask";
import TaskError from "./TaskError";

const UpdateTaskSuccess = ({ result }: { result: UpdateTaskResult }) => {
  const { task, message, error } = result;

  // Error state
  if (error) {
    return (
      <TaskError
        message={message}
        error={error}
        title="Failed to Update Task"
      />
    );
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
            <span>Task updated successfully</span>
          </h3>
        </div>
      </div>

      {/* Task Card */}
      {task && task.id && (
        <div className="space-y-3">
          <TaskDetailsDialog action={task}>
            <TaskCard task={task} />
          </TaskDetailsDialog>
        </div>
      )}

      {/* Empty state (shouldn't happen in success, but just in case) */}
      {(!task || !task.id) && (
        <div className="text-center py-4">
          <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-600">No task to display</p>
        </div>
      )}
    </div>
  );
};

export default UpdateTaskSuccess;
