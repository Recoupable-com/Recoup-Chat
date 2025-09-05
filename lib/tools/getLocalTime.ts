import { tool } from "ai";
import { z } from "zod";

export interface LocalTimeResponse {
  status: "success";
  localTime: string;
  timezone: string;
  offsetMinutes: number;
  localeString: string;
  timezoneSource: "provided" | "server";
}

const getLocalTime = tool({
  description:
    "Get the current local time/date (now). Use for time/date/clock queries. Accepts optional IANA timezone; otherwise uses server locale.",
  inputSchema: z.object({
    timezone: z
      .string()
      .describe(
        "Optional IANA timezone like 'America/New_York'. If omitted, server local timezone is used."
      )
      .optional(),
  }),
  execute: async ({ timezone }: { timezone?: string }): Promise<LocalTimeResponse> => {
    const now = new Date();

    const resolvedTimeZone =
      timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const timezoneSource: "provided" | "server" = timezone ? "provided" : "server";

    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: resolvedTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value || "";
    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = get("hour");
    const minute = get("minute");
    const second = get("second");

    const localeString = new Intl.DateTimeFormat(undefined, {
      timeZone: resolvedTimeZone,
      hour12: false,
    }).format(now);

    const offsetLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: resolvedTimeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value;

    const offsetMinutes = (() => {
      if (!offsetLabel) return 0;
      const match = offsetLabel.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (!match) return 0;
      const sign = match[1] === "+" ? 1 : -1;
      const hours = parseInt(match[2] || "0", 10);
      const minutes = parseInt(match[3] || "0", 10);
      return sign * (hours * 60 + minutes);
    })();

    return {
      status: "success",
      localTime: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
      timezone: resolvedTimeZone,
      offsetMinutes,
      localeString,
      timezoneSource,
    };
  },
});

export default getLocalTime;


