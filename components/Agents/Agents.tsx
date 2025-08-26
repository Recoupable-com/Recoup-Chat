import { useRouter } from "next/navigation";
import AgentTags from "./AgentTags";
import AgentCard from "./AgentCard";
import { useAgentData } from "./useAgentData";
import type { Agent } from "./useAgentData";

const Agents = () => {
  const { push } = useRouter();
  const {
    tags,
    selectedTag,
    setSelectedTag,
    loading,
    showAllTags,
    setShowAllTags,
    gridAgents,
  } = useAgentData();

  const handleAgentClick = (agent: Agent) => {
    push(`/chat?q=${encodeURIComponent(agent.prompt)}`);
  };

  return (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12 flex flex-col h-full min-h-0">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4">
        Agents
      </p>
      <p className="text-lg text-gray-500 text-center md:text-left md:mb-4 font-light font-inter max-w-2xl">
        <span className="sm:hidden">
          Smarter label teams, powered by agents.
        </span>
        <span className="hidden sm:inline">
          Unlock the potential of your roster with intelligent, task-focused
          agents.
        </span>
      </p>
      <div className="container flex flex-col h-full w-full flex-1 min-h-0">
        <AgentTags
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showAllTags={showAllTags}
          setShowAllTags={setShowAllTags}
        />
        <div className="flex flex-col flex-1 overflow-y-auto scrollable pt-4 md:pt-6">
          {loading ? (
            <div className="text-center text-gray-400 py-12">
              Loading agents...
            </div>
          ) : gridAgents.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No agents found for this tag.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8 pr-1 md:pr-2">
              {gridAgents.map((agent) => (
                <AgentCard
                  key={agent.title}
                  agent={agent}
                  onClick={() => handleAgentClick(agent)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agents;
