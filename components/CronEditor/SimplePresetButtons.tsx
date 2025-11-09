import { Button } from "@/components/ui/button";

interface SimplePreset {
  label: string;
  value: string;
  icon: string;
}

interface SimplePresetButtonsProps {
  cronExpression: string;
  presets: SimplePreset[];
  disabled?: boolean;
  onPresetSelect: (cronValue: string) => void;
}

const SimplePresetButtons: React.FC<SimplePresetButtonsProps> = ({
  cronExpression,
  presets,
  disabled = false,
  onPresetSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant={
            cronExpression.trim() === preset.value ? "default" : "outline"
          }
          size="sm"
          onClick={() => onPresetSelect(preset.value)}
          disabled={disabled}
          className="h-auto justify-start px-3 py-2 text-xs"
        >
          <span className="mr-2">{preset.icon}</span>
          <span className="text-balance">{preset.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default SimplePresetButtons;
