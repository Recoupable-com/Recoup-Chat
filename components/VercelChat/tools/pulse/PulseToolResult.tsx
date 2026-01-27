"use client";

import { usePulseToggle } from "@/hooks/usePulseToggle";
import PulseToggle from "@/components/Pulse/PulseToggle";
import PulseToggleSkeleton from "@/components/Pulse/PulseToggleSkeleton";
import { CheckCircle, XCircle, Activity } from "lucide-react";

export type PulseToolResultType = {
  pulse: {
    id: string | null;
    account_id: string;
    active: boolean;
  };
  error?: string;
};

interface PulseToolResultProps {
  result: PulseToolResultType;
  isUpdate?: boolean;
}

export default function PulseToolResult({
  result,
  isUpdate = false,
}: PulseToolResultProps) {
  const { active, isInitialLoading, isToggling, togglePulse } =
    usePulseToggle();

  if (result.error) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 border border-red-200 my-1 w-fit">
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-4 w-4 text-red-600" />
        </div>
        <div>
          <p className="font-medium text-sm text-red-800">
            {isUpdate ? "Failed to update pulse" : "Failed to get pulse"}
          </p>
          <p className="text-xs text-red-600">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 max-w-sm shadow-sm">
      <div className="flex items-start space-x-3 mb-3">
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>
              {isUpdate ? "Pulse updated" : "Pulse status"}
            </span>
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <span className="text-sm text-muted-foreground">Daily notifications</span>
        {isInitialLoading ? (
          <PulseToggleSkeleton />
        ) : (
          <PulseToggle
            active={active}
            isToggling={isToggling}
            onToggle={togglePulse}
          />
        )}
      </div>
    </div>
  );
}
