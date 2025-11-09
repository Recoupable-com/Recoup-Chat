import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import parseCronParts from "@/lib/cron/parseCronParts";

export interface AdvancedCronEditorField {
  key: string;
  label: string;
  helper: string;
  placeholder: string;
}

interface AdvancedCronEditorProps {
  cronExpression: string;
  onFieldChange: (index: number, value: string) => void;
  disabled?: boolean;
}

const CRON_FIELDS: AdvancedCronEditorField[] = [
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

const AdvancedCronEditor: React.FC<AdvancedCronEditorProps> = ({
  cronExpression,
  onFieldChange,
  disabled = false,
}) => {
  const fieldValues = parseCronParts(cronExpression);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-medium text-muted-foreground">
          Cron Expression
        </Label>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Format: minute hour day-of-month month day-of-week
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {CRON_FIELDS.map((field, index) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.key} className="text-xs font-medium">
              {field.label}
            </Label>
            <Input
              id={field.key}
              disabled={disabled}
              value={fieldValues[index] ?? "*"}
              onChange={(event) => onFieldChange(index, event.target.value)}
              placeholder={field.placeholder}
              className="text-sm font-mono"
            />
            <p className="text-[11px] text-muted-foreground">{field.helper}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedCronEditor;
