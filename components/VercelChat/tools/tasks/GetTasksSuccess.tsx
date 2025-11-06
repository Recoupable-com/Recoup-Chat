import React from "react";
import { ListTodo, CheckCircle2 } from "lucide-react";
import { GetTasksResult } from "@/lib/tools/tasks/getTasks";
import TaskCard from "./TaskCard";
import TaskDetailsDialog from "../../dialogs/tasks/TaskDetailsDialog";

export interface GetTasksSuccessProps {
  result: GetTasksResult;
}

const GetTasksSuccess: React.FC<GetTasksSuccessProps> = ({ result }) => {
  const { tasks, message } = result;

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

      {/* Tasks List */}
      <div className="p-4">
        {tasks.length === 0 ? (
          <div className="text-center py-6">
            <ListTodo className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {tasks.map((task) => (
              <TaskDetailsDialog key={task.id} action={task}>
                <TaskCard task={task} />
              </TaskDetailsDialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetTasksSuccess;
