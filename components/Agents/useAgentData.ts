import { useEffect, useState } from "react";

// Define Agent type for agent metadata loaded from database
export interface Agent {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags?: string[];
}

export function useAgentData() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTag, setSelectedTag] = useState("Recommended");
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>(["Recommended"]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    fetch("/api/agent-templates")
      .then((res) => res.json())
      .then((data: Agent[]) => {
        setAgents(data);
        
        // Since action tags now mirror filter tags, we don't exclude them
        // All tags will appear as both filters and pills
        const uniqueTags = Array.from(
          new Set(
            data
              .flatMap((agent: Agent) => agent.tags || [])
              .filter((tag: string) => !!tag) // Just filter out empty tags
          )
        );
        
        const allTags = ["Recommended", ...uniqueTags];
        setTags(Array.from(new Set(allTags)));
        setLoading(false);
      });
  }, []);

  // Get all agents except the special card, filtered by the selected tag
  const filteredAgents = agents.filter(
    (agent) =>
      agent.title !== "Audience Segmentation" &&
      (selectedTag === "Recommended" ? true : agent.tags?.includes(selectedTag))
  );
  // Hide the "Audience Segmentation" card from UI - keep all other logic intact
  const gridAgents = filteredAgents;

  return {
    tags,
    selectedTag,
    setSelectedTag,
    loading,
    showAllTags,
    setShowAllTags,
    gridAgents,
  };
} 