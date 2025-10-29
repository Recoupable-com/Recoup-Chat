"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HideMissingItemsToggleProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

export default function HideMissingItemsToggle({
  checked,
  onCheckedChange,
}: HideMissingItemsToggleProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="text-xs text-muted-foreground">
        {checked ? "Hiding items with missing info" : "Showing all items"}
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="hide-incomplete" className="text-xs">
          Hide items with missing info
        </Label>
        <Switch
          id="hide-incomplete"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </div>
  );
}
