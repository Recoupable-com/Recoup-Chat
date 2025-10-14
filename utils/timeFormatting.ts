/**
 * Formats a duration in seconds to a human-readable string.
 * Examples:
 *   - 30 seconds -> "30 seconds"
 *   - 60 seconds -> "1 minute"
 *   - 90 seconds -> "1 minute"
 *   - 120 seconds -> "2 minutes"
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted time string
 */
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins === 0) {
    return `${secs} seconds`;
  }
  
  if (secs === 0) {
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  }
  
  return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
}

/**
 * Calculates progress percentage based on elapsed and total time.
 * 
 * @param elapsedSeconds - Time elapsed in seconds
 * @param totalSeconds - Total expected duration in seconds
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercent(elapsedSeconds: number, totalSeconds: number): number {
  return Math.min((elapsedSeconds / totalSeconds) * 100, 100);
}

