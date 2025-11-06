/**
 * Formats hour and minute strings into a 12-hour time format (e.g., "2:30 PM")
 */
export const formatTime = (hour: string, minute: string): string => {
  const hourNum = parseInt(hour);
  const minuteNum = parseInt(minute);
  const period = hourNum >= 12 ? "PM" : "AM";
  const displayHour =
    hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  return `${displayHour}:${minuteNum.toString().padStart(2, "0")} ${period}`;
};
