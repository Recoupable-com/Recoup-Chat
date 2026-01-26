"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PulseToggleProps {
  active: boolean;
  isLoading: boolean;
  onToggle: (active: boolean) => void;
}

export default function PulseToggle({
  active,
  isLoading,
  onToggle,
}: PulseToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="pulse-active" className="text-sm text-muted-foreground">
        {active ? "Active" : "Inactive"}
      </Label>
      <Switch
        id="pulse-active"
        checked={active}
        onCheckedChange={onToggle}
        disabled={isLoading}
      />
    </div>
  );
}
