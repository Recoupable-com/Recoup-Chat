import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";

interface StatusSwitchProps {
  taskId: string;
  isActive: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  disabled?: boolean;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({
  taskId,
  isActive,
  onStatusChange,
  disabled = false,
}) => {
  const { updateAction, isLoading } = useUpdateScheduledAction();

  const handleToggle = async (checked: boolean) => {
    try {
      await updateAction({
        actionId: taskId,
        updates: { enabled: checked },
        onSuccess: (updatedData) => {
          onStatusChange?.(updatedData.enabled ?? false);
        },
        successMessage: checked ? "Task activated" : "Task deactivated",
      });
    } catch {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`status-${taskId}`}
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={disabled || isLoading}
        className="data-[state=checked]:bg-green-600"
      />
      <Label 
        htmlFor={`status-${taskId}`} 
        className="text-xs font-medium cursor-pointer select-none"
      >
        {isActive ? "Active" : "Paused"}
      </Label>
    </div>
  );
};

export default StatusSwitch;
