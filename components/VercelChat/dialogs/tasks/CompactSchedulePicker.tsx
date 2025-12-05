"use client";

import { Clock, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCronEditor from "@/hooks/useCronEditor";

interface CompactSchedulePickerProps {
  cronExpression: string;
  onCronExpressionChange: (value: string) => void;
  disabled?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: "hourly", label: "Every hour" },
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const TIME_OPTIONS = [
  { value: "06:00", label: "6:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "21:00", label: "9:00 PM" },
];

const CompactSchedulePicker: React.FC<CompactSchedulePickerProps> = ({
  cronExpression,
  onCronExpressionChange,
  disabled = false,
}) => {
  const { simpleMode, handleSimpleModeChange, humanReadable } = useCronEditor({
    cronExpression,
    onCronExpressionChange,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal h-10 px-3"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate text-sm">{humanReadable}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Frequency</Label>
            <Select
              value={simpleMode.frequency}
              onValueChange={(value) =>
                handleSimpleModeChange("frequency", value)
              }
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {simpleMode.frequency !== "hourly" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Time</Label>
              <Select
                value={simpleMode.time}
                onValueChange={(value) => handleSimpleModeChange("time", value)}
                disabled={disabled}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2 border-t">
            {humanReadable}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompactSchedulePicker;
