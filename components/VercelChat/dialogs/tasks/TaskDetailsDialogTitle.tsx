import { Input } from "@/components/ui/input";

interface TaskDetailsDialogTitleProps {
  value: string;
  onChange: (value: string) => void;
  canEdit: boolean;
}

const TaskDetailsDialogTitle: React.FC<TaskDetailsDialogTitleProps> = ({
  value,
  onChange,
  canEdit,
}) => {
  if (canEdit) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Name</label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm"
          placeholder="Enter task name"
          disabled={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
        Name
      </div>
      <div className="text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
        <p className="break-words">{value}</p>
      </div>
    </div>
  );
};

export default TaskDetailsDialogTitle;
