import { UIMessageStreamWriter } from "ai";
import { ROUTING_STATUS_DATA_TYPE } from "@/lib/consts";

export type RoutingStatusData = {
  status: "analyzing" | "complete";
  message: string;
  agent?: string;
  reason?: string;
};

/**
 * Writes routing status to the UI stream if writer is provided.
 */
export function writeRoutingStatus(
  writer: UIMessageStreamWriter | undefined,
  status: "analyzing" | "complete",
  message: string,
  agent?: string,
  reason?: string
): void {
  if (!writer) return;

  writer.write({
    type: ROUTING_STATUS_DATA_TYPE,
    id: "routing-status", // Use ID for reconciliation
    data: {
      status,
      message,
      agent,
      reason,
    },
  });
}
