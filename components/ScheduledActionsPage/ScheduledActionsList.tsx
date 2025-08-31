import { Tables } from "@/types/database.types";
import ScheduledActionCard from "@/components/VercelChat/tools/ScheduledActionCard";
import ScheduledActionSkeleton from "./ScheduledActionSkeleton";
import ScheduledActionDetailsDialog from "./ScheduledActionDetailsDialog";

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
    return <div className="text-sm text-red-600">Failed to load scheduled actions</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ScheduledActionSkeleton />
        <ScheduledActionSkeleton />
        <ScheduledActionSkeleton />
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You have no scheduled tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <ScheduledActionCard key={action.id} action={action} />
      ))}
      <ScheduledActionDetailsDialog />
    </div>
  );
};

export default ScheduledActionsList;
