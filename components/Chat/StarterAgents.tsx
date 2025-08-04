"use client";

import { useRouter } from "next/navigation";
import { useAgentData, type Agent } from "../Agents/useAgentData";
import StarterAgentCard from "./StarterAgentCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StarterAgentsProps {
  isVisible: boolean;
}

export function StarterAgents({ isVisible }: StarterAgentsProps) {
  const { gridAgents, loading } = useAgentData();
  const { push } = useRouter();

  // Show the first 3 agents from the available grid agents
  const agents = gridAgents.slice(0, 3);

  const handleAgentClick = (agent: Agent) => {
    push(`/chat?q=${encodeURIComponent(agent.prompt)}`);
  };

  if (loading || gridAgents.length === 0) return null;

  return (
    <TooltipProvider>
      <div 
        className={`w-full mt-8 transition-opacity duration-500 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-medium">
            NEW
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="text-lg leading-[1.3] tracking-[-0.25px] font-semibold text-black font-plus_jakarta_sans cursor-help">
                Quick Start
              </h3>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm text-xs p-2">
              <div className="space-y-1">
                <p className="font-medium">Examples:</p>
                <p>• &ldquo;Analyze my artist's fan segments&rdquo;</p>
                <p>• &ldquo;Give me a social media health check&rdquo;</p>
                <p>• &ldquo;Find collaboration opportunities&rdquo;</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent: Agent, index: number) => (
            <div
              key={agent.title}
              className="transition-all duration-300 ease-out"
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <StarterAgentCard agent={agent} onClick={() => handleAgentClick(agent)} />
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default StarterAgents;