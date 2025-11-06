export interface TimeOption {
  value: string;
  label: string;
  periodLabel: string;
}

const TIME_PERIODS = [
  { label: "Early Morning", startHour: 0, endHour: 5 },
  { label: "Morning", startHour: 6, endHour: 11 },
  { label: "Afternoon", startHour: 12, endHour: 17 },
  { label: "Evening", startHour: 18, endHour: 23 },
];

export const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = [];

  TIME_PERIODS.forEach((periodConfig) => {
    for (
      let hour = periodConfig.startHour;
      hour <= periodConfig.endHour;
      hour++
    ) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? "PM" : "AM";
        const timeStr = `${hour12}:${minute.toString().padStart(2, "0")} ${amPm}`;

        options.push({
          value: timeStr,
          label: timeStr,
          periodLabel: periodConfig.label,
        });
      }
    }
  });

  return options;
};
