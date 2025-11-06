import { Fragment } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeOptions } from "@/lib/tasks/generateTimeOptions";

interface TimeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const TimeSelect = ({ value, onValueChange, disabled }: TimeSelectProps) => {
  const options = generateTimeOptions();
  let previousPeriodLabel: string | null = null;

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="flex-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] p-1">
        {options.map((option, index) => {
          const showHeader = option.periodLabel !== previousPeriodLabel;
          previousPeriodLabel = option.periodLabel;

          return (
            <Fragment key={option.value}>
              {showHeader && (
                <div
                  className={`px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 ${
                    index === 0 ? "first:mt-0" : "mt-2"
                  }`}
                >
                  {option.periodLabel}
                </div>
              )}
              <SelectItem value={option.value} className="py-2">
                {option.label}
              </SelectItem>
            </Fragment>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
