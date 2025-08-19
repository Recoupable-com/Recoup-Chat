import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";

interface StatusSwitchProps {
  actionId: string;
  isActive: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  disabled?: boolean;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({
  actionId,
  isActive,
  onStatusChange,
  disabled = false,
}) => {
  const { updateAction, isLoading } = useUpdateScheduledAction();

  const handleToggle = async (checked: boolean) => {
    try {
      await updateAction({
        actionId,
        updates: { enabled: checked },
        onSuccess: (updatedData) => {
          onStatusChange?.(updatedData.enabled ?? false);
        },
        successMessage: checked ? "Action activated" : "Action deactivated",
      });
    } catch {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`status-${actionId}`}
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={disabled || isLoading}
        className="data-[state=checked]:bg-green-600"
      />
      <Label 
        htmlFor={`status-${actionId}`} 
        className="text-xs font-medium cursor-pointer select-none"
      >
        {isActive ? "Active" : "Paused"}
      </Label>
    </div>
  );
};

export default StatusSwitch;
