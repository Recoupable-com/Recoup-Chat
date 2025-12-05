import { useCallback, useEffect, useMemo, useState } from "react";
import parseCronParts from "@/lib/cron/parseCronParts";
import deriveSimpleModeFromParts, {
  SimpleModeSettings,
} from "@/lib/cron/deriveSimpleModeFromParts";
import { parseCronToHuman } from "@/lib/tasks/parseCronToHuman";

export interface UseCronEditorArgs {
  cronExpression: string;
  onCronExpressionChange: (value: string) => void;
}

const DEFAULT_SIMPLE_MODE: SimpleModeSettings = {
  frequency: "daily",
  time: "09:00",
  dayOfWeek: "1",
  dayOfMonth: "1",
};

const computeCronFromSimpleMode = (settings: SimpleModeSettings): string => {
  const [hour, minute] =
    settings.frequency === "hourly" ? ["*", "0"] : settings.time.split(":");

  switch (settings.frequency) {
    case "hourly":
      return "0 * * * *";
    case "daily":
      return `${minute} ${hour} * * *`;
    case "weekdays":
      return `${minute} ${hour} * * 1-5`;
    case "weekly":
      return `${minute} ${hour} * * ${settings.dayOfWeek}`;
    case "monthly":
      return `${minute} ${hour} ${settings.dayOfMonth} * *`;
    default:
      return "* * * * *";
  }
};

const useCronEditor = ({
  cronExpression,
  onCronExpressionChange,
}: UseCronEditorArgs) => {
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

  const handleFieldChange = useCallback(
    (index: number) => (value: string) => {
      setFieldValues((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
      // Call onChange after state update
      setTimeout(() => {
        setFieldValues((current) => {
          const normalizedParts = current.map((part) =>
            part.trim() === "" ? "*" : part.trim()
          );
          onCronExpressionChange(normalizedParts.join(" "));
          return current;
        });
      }, 0);
    },
    [onCronExpressionChange]
  );

  const handlePresetClick = useCallback(
    (cronValue: string) => {
      onCronExpressionChange(cronValue);
      const derived = deriveSimpleModeFromParts(parseCronParts(cronValue));
      if (derived) {
        setSimpleMode(derived);
      }
    },
    [onCronExpressionChange]
  );

  const handleSimpleModeChange = useCallback(
    (field: keyof SimpleModeSettings, value: string) => {
      const updated = { ...simpleMode, [field]: value };
      setSimpleMode(updated);
      // Compute and call onChange after state update
      const cron = computeCronFromSimpleMode(updated);
      setTimeout(() => {
        onCronExpressionChange(cron);
      }, 0);
    },
    [simpleMode, onCronExpressionChange]
  );

  const normalizedCron = useMemo(() => {
    return fieldValues
      .map((part) => (part.trim() === "" ? "*" : part.trim()))
      .join(" ");
  }, [fieldValues]);

  const humanReadable = useMemo(() => {
    return parseCronToHuman(normalizedCron);
  }, [normalizedCron]);

  return {
    mode,
    setMode,
    simpleMode,
    handleSimpleModeChange,
    handlePresetClick,
    handleFieldChange,
    normalizedCron,
    humanReadable,
  };
};

export default useCronEditor;
