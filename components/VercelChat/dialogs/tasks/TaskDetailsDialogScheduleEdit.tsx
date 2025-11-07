import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeSelect from "./TimeSelect";

interface TaskDetailsDialogScheduleEditProps {
  frequency: string;
  time: string;
  onFrequencyChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  disabled?: boolean;
}

const TaskDetailsDialogScheduleEdit: React.FC<
  TaskDetailsDialogScheduleEditProps
> = ({
  frequency,
  time,
  onFrequencyChange,
  onTimeChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700">When</label>
      <div className="flex gap-2">
        <Select
          value={frequency}
          onValueChange={onFrequencyChange}
          disabled={disabled}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Once">Once</SelectItem>
          </SelectContent>
        </Select>
        <TimeSelect
          value={time}
          onValueChange={onTimeChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TaskDetailsDialogScheduleEdit;
