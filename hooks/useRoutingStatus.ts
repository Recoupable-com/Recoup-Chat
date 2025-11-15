import { useState } from "react";

export type RoutingStatus = {
  status: "analyzing" | "complete";
  message: string;
  agent?: string;
  reason?: string;
} | null;

/**
 * Hook for managing routing status state.
 * Handles transient routing status data from the server.
 */
export function useRoutingStatus() {
  const [routingStatus, setRoutingStatus] = useState<RoutingStatus>(null);

  const handleRoutingData = (data: unknown) => {
    const routingData = data as RoutingStatus;
    setRoutingStatus(routingData);
  };

  const clearRoutingStatus = () => {
    setRoutingStatus(null);
  };

  return {
    routingStatus,
    handleRoutingData,
    clearRoutingStatus,
  };
}
