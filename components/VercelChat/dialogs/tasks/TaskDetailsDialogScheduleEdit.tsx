import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { parseCronToHuman } from "@/lib/tasks/parseCronToHuman";

interface TaskDetailsDialogScheduleEditProps {
  cronExpression: string;
  onCronExpressionChange: (value: string) => void;
  disabled?: boolean;
}

const CRON_FIELDS: Array<{
  key: string;
  label: string;
  helper: string;
  placeholder: string;
}> = [
  {
    key: "minute",
    label: "Minute",
    helper: "0-59 • use '*' for every minute",
    placeholder: "e.g. 0, 15, */5",
  },
  {
    key: "hour",
    label: "Hour",
    helper: "0-23 • use '*' for every hour",
    placeholder: "e.g. 9, 14, */2",
  },
  {
    key: "dayOfMonth",
    label: "Day of Month",
    helper: "1-31 • use '*' for every day",
    placeholder: "e.g. 1, 15, */3",
  },
  {
    key: "month",
    label: "Month",
    helper: "1-12 or JAN-DEC • use '*' for every month",
    placeholder: "e.g. *, 1, 6-9",
  },
  {
    key: "dayOfWeek",
    label: "Day of Week",
    helper: "0-6 or SUN-SAT • use '*' for every day",
    placeholder: "e.g. MON, 1, 1-5",
  },
];

const parseCronParts = (cronExpression: string): string[] => {
  const parts = cronExpression.trim().split(/\s+/).slice(0, 5);
  while (parts.length < 5) {
    parts.push("*");
  }
  return parts;
};

const TaskDetailsDialogScheduleEdit: React.FC<
  TaskDetailsDialogScheduleEditProps
> = ({ cronExpression, onCronExpressionChange, disabled = false }) => {
  const parsedParts = useMemo(
    () => parseCronParts(cronExpression),
    [cronExpression]
  );
  const [fieldValues, setFieldValues] = useState<string[]>(parsedParts);

  useEffect(() => {
    setFieldValues(parsedParts);
  }, [parsedParts]);

  const handleFieldChange = (index: number) => (value: string) => {
    setFieldValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      const normalizedParts = updated.map((part) =>
        part.trim() === "" ? "*" : part.trim()
      );
      onCronExpressionChange(normalizedParts.join(" "));
      return updated;
    });
  };

  const normalizedCron = useMemo(() => {
    return fieldValues
      .map((part) => (part.trim() === "" ? "*" : part.trim()))
      .join(" ");
  }, [fieldValues]);

  const humanReadable = useMemo(() => {
    return parseCronToHuman(normalizedCron);
  }, [normalizedCron]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-700">When</label>
        <p className="text-[11px] text-gray-500">
          Cron format: minute hour day-of-month month day-of-week
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {CRON_FIELDS.map((field, index) => (
          <div key={field.key} className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              {field.label}
            </label>
            <Input
              disabled={disabled}
              value={fieldValues[index] ?? "*"}
              onChange={(event) => handleFieldChange(index)(event.target.value)}
              placeholder={field.placeholder}
              className="text-sm"
            />
            <p className="text-[11px] text-gray-500">{field.helper}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md bg-gray-50 px-3 py-2">
        <p className="text-xs font-medium text-gray-700">Summary</p>
        <p className="text-xs text-gray-600">{humanReadable}</p>
      </div>
    </div>
  );
};

export default TaskDetailsDialogScheduleEdit;
