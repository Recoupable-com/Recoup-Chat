"use client";

import { AnimatePresence, motion, MotionProps } from "motion/react";
import { memo, useEffect, useState, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: ReactNode[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Simple, consistent interval - no complex calculations
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]); // Only depend on length and duration

  return (
    <span className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={`word-${index}`} // Use index-based key for ReactNode
          className={cn(className)}
          {...motionProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default memo(WordRotate);
