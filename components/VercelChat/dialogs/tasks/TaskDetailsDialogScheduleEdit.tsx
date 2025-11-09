import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseCronToHuman } from "@/lib/tasks/parseCronToHuman";
import { Calendar, Clock, Settings, Sparkles } from "lucide-react";

interface TaskDetailsDialogScheduleEditProps {
  cronExpression: string;
  onCronExpressionChange: (value: string) => void;
  disabled?: boolean;
}

const PRESET_SCHEDULES = [
  { label: "Every day at 9:00 AM", value: "0 9 * * *", icon: "☀️" },
  { label: "Every weekday at 9:00 AM", value: "0 9 * * 1-5", icon: "💼" },
  { label: "Every Monday at 9:00 AM", value: "0 9 * * 1", icon: "📅" },
  { label: "Every hour", value: "0 * * * *", icon: "⏰" },
  { label: "Every day at noon", value: "0 12 * * *", icon: "🌞" },
  { label: "Every day at 6:00 PM", value: "0 18 * * *", icon: "🌆" },
  { label: "First day of every month", value: "0 9 1 * *", icon: "📆" },
];

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

const parseCronParts = (cronExpression = "* * * * *"): string[] => {
  const parts = (cronExpression || "* * * * *").trim().split(/\s+/).slice(0, 5);
  while (parts.length < 5) {
    parts.push("*");
  }
  return parts;
};

interface SimpleModeSettings {
  frequency: "hourly" | "daily" | "weekdays" | "weekly" | "monthly";
  time: string;
  dayOfWeek: string;
  dayOfMonth: string;
}

const DEFAULT_SIMPLE_MODE: SimpleModeSettings = {
  frequency: "daily",
  time: "09:00",
  dayOfWeek: "1",
  dayOfMonth: "1",
};

const padTimePart = (value: number) => value.toString().padStart(2, "0");

const deriveSimpleModeFromParts = (
  parts: string[]
): SimpleModeSettings | null => {
  const [minute, hour, dayOfMonth, , dayOfWeek] = parts;

  const hourNum = Number.parseInt(hour, 10);
  const minuteNum = Number.parseInt(minute, 10);

  if (
    Number.isNaN(hourNum) ||
    Number.isNaN(minuteNum) ||
    hourNum < 0 ||
    hourNum > 23 ||
    minuteNum < 0 ||
    minuteNum > 59
  ) {
    return null;
  }

  const time = `${padTimePart(hourNum)}:${padTimePart(minuteNum)}`;

  if (
    minute === "0" &&
    hour === "*" &&
    dayOfMonth === "*" &&
    dayOfWeek === "*"
  ) {
    return {
      frequency: "hourly",
      time,
      dayOfWeek: "1",
      dayOfMonth: "1",
    };
  }

  if (dayOfMonth === "*" && dayOfWeek === "*") {
    return {
      frequency: "daily",
      time,
      dayOfWeek: "1",
      dayOfMonth: "1",
    };
  }

  if (dayOfMonth === "*" && dayOfWeek === "1-5") {
    return {
      frequency: "weekdays",
      time,
      dayOfWeek: "1",
      dayOfMonth: "1",
    };
  }

  if (dayOfMonth === "*" && /^[0-6]$/.test(dayOfWeek)) {
    return {
      frequency: "weekly",
      time,
      dayOfWeek,
      dayOfMonth: "1",
    };
  }

  if (dayOfWeek === "*" && /^[1-9]|[12][0-9]|3[01]$/.test(dayOfMonth)) {
    return {
      frequency: "monthly",
      time,
      dayOfWeek: "1",
      dayOfMonth,
    };
  }

  return null;
};

const TaskDetailsDialogScheduleEdit: React.FC<
  TaskDetailsDialogScheduleEditProps
> = ({ cronExpression, onCronExpressionChange, disabled = false }) => {
  const parsedParts = useMemo(
    () => parseCronParts(cronExpression),
    [cronExpression]
  );
  const [fieldValues, setFieldValues] = useState<string[]>(parsedParts);
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [simpleMode, setSimpleMode] = useState<SimpleModeSettings>(() => {
    return deriveSimpleModeFromParts(parsedParts) ?? DEFAULT_SIMPLE_MODE;
  });

  useEffect(() => {
    setFieldValues(parsedParts);
    const derived = deriveSimpleModeFromParts(parsedParts);
    if (derived) {
      setSimpleMode(derived);
    }
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

  const handlePresetClick = (cronValue: string) => {
    onCronExpressionChange(cronValue);
  };

  const handleSimpleModeChange = (
    field: keyof SimpleModeSettings,
    value: string
  ) => {
    setSimpleMode((prev) => {
      const updated = { ...prev, [field]: value };

      const [hour, minute] =
        updated.frequency === "hourly" ? ["*", "0"] : updated.time.split(":");

      let cron = "* * * * *";

      switch (updated.frequency) {
        case "hourly":
          cron = `0 * * * *`;
          break;
        case "daily":
          cron = `${minute} ${hour} * * *`;
          break;
        case "weekdays":
          cron = `${minute} ${hour} * * 1-5`;
          break;
        case "weekly":
          cron = `${minute} ${hour} * * ${updated.dayOfWeek}`;
          break;
        case "monthly":
          cron = `${minute} ${hour} ${updated.dayOfMonth} * *`;
          break;
      }

      onCronExpressionChange(cron);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4" />
            Schedule
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Choose when this task should run
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setMode((prev) => (prev === "simple" ? "advanced" : "simple"))
          }
          disabled={disabled}
          className="text-xs"
        >
          <Settings className="mr-1 h-3 w-3" />
          {mode === "simple" ? "Advanced" : "Simple"}
        </Button>
      </div>

      {mode === "simple" ? (
        <>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Quick Presets
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SCHEDULES.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    cronExpression.trim() === preset.value
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handlePresetClick(preset.value)}
                  disabled={disabled}
                  className="h-auto justify-start px-3 py-2 text-xs"
                >
                  <span className="mr-2">{preset.icon}</span>
                  <span className="text-balance">{preset.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t pt-2">
            <Label className="flex items-center gap-1.5 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Or customize
            </Label>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="frequency" className="text-xs">
                  How often?
                </Label>
                <Select
                  value={simpleMode.frequency}
                  onValueChange={(value) =>
                    handleSimpleModeChange(
                      "frequency",
                      value as SimpleModeSettings["frequency"]
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="daily">Every day</SelectItem>
                    <SelectItem value="weekdays">Every weekday</SelectItem>
                    <SelectItem value="weekly">Every week</SelectItem>
                    <SelectItem value="monthly">Every month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {simpleMode.frequency !== "hourly" && (
                <div className="space-y-1.5">
                  <Label htmlFor="time" className="text-xs">
                    At what time?
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={simpleMode.time}
                    onChange={(event) =>
                      handleSimpleModeChange("time", event.target.value)
                    }
                    disabled={disabled}
                    className="text-sm"
                  />
                </div>
              )}

              {simpleMode.frequency === "weekly" && (
                <div className="space-y-1.5">
                  <Label htmlFor="dayOfWeek" className="text-xs">
                    On which day?
                  </Label>
                  <Select
                    value={simpleMode.dayOfWeek}
                    onValueChange={(value) =>
                      handleSimpleModeChange("dayOfWeek", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger id="dayOfWeek">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {simpleMode.frequency === "monthly" && (
                <div className="space-y-1.5">
                  <Label htmlFor="dayOfMonth" className="text-xs">
                    On which day of the month?
                  </Label>
                  <Select
                    value={simpleMode.dayOfMonth}
                    onValueChange={(value) =>
                      handleSimpleModeChange("dayOfMonth", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger id="dayOfMonth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, index) => index + 1).map(
                        (day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
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
                  onChange={(event) =>
                    handleFieldChange(index)(event.target.value)
                  }
                  placeholder={field.placeholder}
                  className="text-sm font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  {field.helper}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-muted/50 px-4 py-3">
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground">
              This task will run:
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {humanReadable}
            </p>
            <p className="mt-1 text-[11px] font-mono text-muted-foreground">
              {normalizedCron}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsDialogScheduleEdit;
