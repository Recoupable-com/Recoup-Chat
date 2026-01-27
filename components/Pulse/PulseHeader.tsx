"use client";

import { usePulseToggle } from "@/hooks/usePulseToggle";
import PulseToggle from "./PulseToggle";
import PulseToggleSkeleton from "./PulseToggleSkeleton";

const PulseHeader = () => {
  const { active, isInitialLoading, isToggling, togglePulse } = usePulseToggle();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold tracking-tight">{formattedDate}</h1>
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
  );
};

export default PulseHeader;
