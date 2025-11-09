import { Label } from "@/components/ui/label";
import type { SimpleModeSettings } from "@/lib/cron/deriveSimpleModeFromParts";
import { Sparkles } from "lucide-react";
import SimplePresetButtons from "./SimplePresetButtons";
import SimpleCustomizeDropdowns from "./SimpleCustomizeDropdowns";

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
          disabled={disabled}
          onPresetSelect={onPresetSelect}
        />
      </div>

      <SimpleCustomizeDropdowns
        simpleMode={simpleMode}
        disabled={disabled}
        onSimpleModeChange={onSimpleModeChange}
      />
    </>
  );
};

export default SimpleCronEditor;
