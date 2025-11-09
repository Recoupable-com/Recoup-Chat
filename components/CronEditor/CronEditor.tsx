import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Settings } from "lucide-react";
import SimpleCronEditor from "./SimpleCronEditor";
import AdvancedCronEditor from "./AdvancedCronEditor";
import useCronEditor from "@/hooks/useCronEditor";

export interface CronEditorProps {
  cronExpression: string;
  onCronExpressionChange: (value: string) => void;
  disabled?: boolean;
}

const CronEditor: React.FC<CronEditorProps> = ({
  cronExpression,
  onCronExpressionChange,
  disabled = false,
}) => {
  const {
    mode,
    setMode,
    simpleMode,
    handleSimpleModeChange,
    handlePresetClick,
    handleFieldChange,
    normalizedCron,
    humanReadable,
  } = useCronEditor({ cronExpression, onCronExpressionChange });

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
        <SimpleCronEditor
          cronExpression={cronExpression}
          simpleMode={simpleMode}
          disabled={disabled}
          onPresetSelect={handlePresetClick}
          onSimpleModeChange={handleSimpleModeChange}
        />
      ) : (
        <AdvancedCronEditor
          cronExpression={normalizedCron}
          onFieldChange={(index, value) => handleFieldChange(index)(value)}
          disabled={disabled}
        />
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

export default CronEditor;
