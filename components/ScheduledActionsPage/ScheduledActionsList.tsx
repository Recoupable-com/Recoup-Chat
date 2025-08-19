import { Tables } from "@/types/database.types";
import ScheduledActionCard from "@/components/VercelChat/tools/ScheduledActionCard";
import ScheduledActionSkeleton from "./ScheduledActionSkeleton";

type ScheduledAction = Tables<"scheduled_actions">;

interface ScheduledActionsListProps {
  actions: ScheduledAction[];
  isLoading: boolean;
  isError: boolean;
}

const ScheduledActionsList: React.FC<ScheduledActionsListProps> = ({
  actions,
  isLoading,
  isError,
}) => {
  if (isError) {
    return <div className="text-sm text-red-600">Failed to load scheduled actions.</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ScheduledActionSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (actions.length === 0) {
    return <div className="text-sm text-gray-500">No scheduled actions found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => (
        <ScheduledActionCard key={action.id} action={action} />
      ))}
    </div>
  );
};

export default ScheduledActionsList;
