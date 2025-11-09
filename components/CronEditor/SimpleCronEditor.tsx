import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SimpleModeSettings } from "@/lib/cron/deriveSimpleModeFromParts";
import { Calendar, Sparkles } from "lucide-react";
import SimplePresetButtons from "./SimplePresetButtons";

const PRESET_SCHEDULES = [
  { label: "Every day at 9:00 AM", value: "0 9 * * *", icon: "☀️" },
  { label: "Every weekday at 9:00 AM", value: "0 9 * * 1-5", icon: "💼" },
  { label: "Every Monday at 9:00 AM", value: "0 9 * * 1", icon: "📅" },
  { label: "Every hour", value: "0 * * * *", icon: "⏰" },
  { label: "Every day at noon", value: "0 12 * * *", icon: "🌞" },
  { label: "Every day at 6:00 PM", value: "0 18 * * *", icon: "🌆" },
  { label: "First day of every month", value: "0 9 1 * *", icon: "📆" },
];

interface SimpleCronEditorProps {
  cronExpression: string;
  simpleMode: SimpleModeSettings;
  disabled?: boolean;
  onPresetSelect: (cronValue: string) => void;
  onSimpleModeChange: (field: keyof SimpleModeSettings, value: string) => void;
}

const SimpleCronEditor: React.FC<SimpleCronEditorProps> = ({
  cronExpression,
  simpleMode,
  disabled = false,
  onPresetSelect,
  onSimpleModeChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          Quick Presets
        </Label>
        <SimplePresetButtons
          cronExpression={cronExpression}
          presets={PRESET_SCHEDULES}
          disabled={disabled}
          onPresetSelect={onPresetSelect}
        />
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
                onSimpleModeChange(
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
                  onSimpleModeChange("time", event.target.value)
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
                  onSimpleModeChange("dayOfWeek", value)
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
                  onSimpleModeChange("dayOfMonth", value)
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
  );
};

export default SimpleCronEditor;
