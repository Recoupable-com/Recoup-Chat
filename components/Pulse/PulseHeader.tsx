"use client";

import PulseToggle from "./PulseToggle";

interface PulseHeaderProps {
  active: boolean;
  isLoading: boolean;
  onToggle: (active: boolean) => void;
}

const PulseHeader = ({ active, isLoading, onToggle }: PulseHeaderProps) => {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold tracking-tight">{formattedDate}</h1>
      <PulseToggle active={active} isLoading={isLoading} onToggle={onToggle} />
    </div>
  );
};

export default PulseHeader;
