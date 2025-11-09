import { Tables } from "@/types/database.types";
import TaskCard from "@/components/VercelChat/tools/tasks/TaskCard";
import TaskSkeleton from "./TaskSkeleton";
import TaskDetailsDialog from "@/components/VercelChat/dialogs/tasks/TaskDetailsDialog";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";

type ScheduledAction = Tables<"scheduled_actions">;

interface TasksListProps {
  tasks: ScheduledAction[];
  isLoading: boolean;
  isError: boolean;
}

const TasksList: React.FC<TasksListProps> = ({ tasks, isLoading, isError }) => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const isArtistSelected = !!selectedArtist;

  if (isError) {
    return <div className="text-sm text-red-600">Failed to load tasks</div>;
  }

  if (isLoading || !isArtistSelected || !userData) {
    return (
      <div className="space-y-4">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          You have no scheduled tasks for this artist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Scheduled</h3>
      </div>
      {tasks.map((task, index) => (
        <TaskDetailsDialog key={task.id} task={task}>
          <div
            className={
              index !== tasks.length - 1 ? "border-b border-gray-100" : ""
            }
          >
            <TaskCard task={task} />
          </div>
        </TaskDetailsDialog>
      ))}
    </div>
  );
};

export default TasksList;
