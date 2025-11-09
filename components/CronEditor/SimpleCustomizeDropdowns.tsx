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
import { Calendar } from "lucide-react";

interface SimpleCustomizeDropdownsProps {
  simpleMode: SimpleModeSettings;
  disabled?: boolean;
  onSimpleModeChange: (field: keyof SimpleModeSettings, value: string) => void;
}

const SimpleCustomizeDropdowns: React.FC<SimpleCustomizeDropdownsProps> = ({
  simpleMode,
  disabled = false,
  onSimpleModeChange,
}) => {
  return (
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
              onValueChange={(value) => onSimpleModeChange("dayOfWeek", value)}
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
              onValueChange={(value) => onSimpleModeChange("dayOfMonth", value)}
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
  );
};

export default SimpleCustomizeDropdowns;
