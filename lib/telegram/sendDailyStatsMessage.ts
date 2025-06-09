import { DailyStats } from "../handleDailyStats";
import { sendMessage } from "./sendMessage";

/**
 * Sends a formatted daily stats message to Telegram.
 */
export async function sendDailyStatsMessage({
  newRoomsCount,
  roomsDelta,
  newMemoriesCount,
  memoriesDelta,
}: DailyStats) {
  const statsMessage = `📊 *Recoup Daily Stats*

*New Rooms (24h):* ${newRoomsCount} (${roomsDelta >= 0 ? "+" : ""}${roomsDelta.toFixed(1)}% vs prev)
*New Memories (24h):* ${newMemoriesCount} (${memoriesDelta >= 0 ? "+" : ""}${memoriesDelta.toFixed(1)}% vs prev)`;
  await sendMessage(statsMessage, { parse_mode: "Markdown" });
}
