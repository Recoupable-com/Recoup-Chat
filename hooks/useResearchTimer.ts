/**
 * useResearchTimer.ts
 * Custom hook for managing research timer state and rotating activity messages.
 * Single responsibility: Handle timer logic for research progress displays.
 */

import { useState, useEffect } from "react";

const ACTIVITY_MESSAGES = [
  "gathering sources and creating your report",
  "searching hundreds of sources",
  "analyzing expert insights",
  "synthesizing research data",
  "compiling comprehensive analysis",
];

interface UseResearchTimerResult {
  elapsedSeconds: number;
  messageIndex: number;
  activityMessages: string[];
}

/**
 * Manages elapsed time tracking and rotating activity messages for research operations.
 * 
 * @param isActive - Whether the timer should be running
 * @returns Object containing elapsed seconds, current message index, and available messages
 */
export function useResearchTimer(isActive: boolean): UseResearchTimerResult {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Timer for elapsed time - increments every second when active
  useEffect(() => {
    if (!isActive) {
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive]);

  // Rotate activity messages every 5 seconds when active
  useEffect(() => {
    if (!isActive) {
      setMessageIndex(0);
      return;
    }

    const messageTimer = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % ACTIVITY_MESSAGES.length);
    }, 5000);
    
    return () => clearInterval(messageTimer);
  }, [isActive]);

  return {
    elapsedSeconds,
    messageIndex,
    activityMessages: ACTIVITY_MESSAGES,
  };
}

