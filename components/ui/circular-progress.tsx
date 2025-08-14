import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type CircularProgressProps = {
  children: ReactNode; // Elements goes here
  progress?: number; // 0 - 100
  className?: string; // size container, e.g., "h-8 w-8"
  strokeWidth?: number; // deprecated alias for thickness
  thickness?: number; // ring thickness in px
  gap?: number; // gap between element edge and inner ring (px)
  trackClassName?: string;
  progressClassName?: string;
};

const clampProgress = (value: number): number => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};

const CircularProgress = ({
  children,
  progress = 0,
  className,
  strokeWidth = 2,
  thickness,
  gap,
  trackClassName,
  progressClassName,
}: CircularProgressProps) => {
  const clamped = clampProgress(progress);
  const ringThickness = typeof thickness === "number" ? thickness : strokeWidth;
  const ringGap = typeof gap === "number" ? gap : 1;
  const ringOffset = ringThickness + ringGap;

  return (
    <div className={cn("relative inline-block rounded-full", className)}>
      {children}
      <div
        className={cn(
          "absolute inset-0 rounded-full pointer-events-none text-muted-foreground/20",
          trackClassName,
        )}
        style={{
          width: `calc(100% + ${ringOffset * 2}px)`,
          height: `calc(100% + ${ringOffset * 2}px)`,
          top: -ringOffset,
          left: -ringOffset,
          background: `conic-gradient(from 0deg, currentColor 0 360deg)`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), black 0)` as CSSProperties["WebkitMask"],
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), black 0)` as CSSProperties["mask"],
        }}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-full pointer-events-none text-primary",
          progressClassName,
        )}
        style={{
          width: `calc(100% + ${ringOffset * 2}px)`,
          height: `calc(100% + ${ringOffset * 2}px)`,
          top: -ringOffset,
          left: -ringOffset,
          background: `conic-gradient(from 0deg, currentColor ${clamped * 3.6}deg, transparent 0)`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), black 0)` as CSSProperties["WebkitMask"],
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), black 0)` as CSSProperties["mask"],
        }}
      />
    </div>
  );
};

export default CircularProgress;

