import React, { createContext, useContext, ReactNode } from "react";
import { useRoutingStatus, type AgentRouting } from "@/hooks/useRoutingStatus";

const AgentRoutingContext = createContext<AgentRouting | undefined>(undefined);

interface AgentRoutingProviderProps {
  children: ReactNode;
}

/**
 * Provider for agent routing status state.
 * Manages transient routing status data from the server.
 */
export function AgentRoutingProvider({ children }: AgentRoutingProviderProps) {
  const { routingStatus, handleRoutingData, clearRoutingStatus } =
    useRoutingStatus();

  const contextValue: AgentRouting = {
    routingStatus,
    handleRoutingData,
    clearRoutingStatus,
  };

  return (
    <AgentRoutingContext.Provider value={contextValue}>
      {children}
    </AgentRoutingContext.Provider>
  );
}

/**
 * Hook to access agent routing context
 */
export function useAgentRouting() {
  const context = useContext(AgentRoutingContext);

  if (context === undefined) {
    throw new Error(
      "useAgentRouting must be used within an AgentRoutingProvider"
    );
  }

  return context;
}
