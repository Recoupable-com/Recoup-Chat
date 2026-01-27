"use client";

import PulseToggle from "./PulseToggle";
import PulseToggleSkeleton from "./PulseToggleSkeleton";

interface PulseHeaderProps {
  active: boolean;
  isInitialLoading: boolean;
  isToggling: boolean;
  onToggle: (active: boolean) => void;
}

const PulseHeader = ({
  active,
  isInitialLoading,
  isToggling,
  onToggle,
}: PulseHeaderProps) => {
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
          onToggle={onToggle}
        />
      )}
    </div>
  );
};

export default PulseHeader;
