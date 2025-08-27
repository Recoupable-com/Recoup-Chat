import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Define Agent type for agent metadata loaded from database
export interface Agent {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags?: string[];
  is_private?: boolean;
  creator?: string | null;
}

export function useAgentData() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTag, setSelectedTag] = useState("Recommended");
  const [tags, setTags] = useState<string[]>(["Recommended"]);
  const [showAllTags, setShowAllTags] = useState(false);
  
  const { data, isPending } = useQuery<Agent[]>({
    queryKey: ["agent-templates"],
    queryFn: async (): Promise<Agent[]> => {
      const res = await fetch("/api/agent-templates");
      if (!res.ok) throw new Error("Failed to fetch agent templates");
      return (await res.json()) as Agent[];
    },
    retry: 1,
  });

  useEffect(() => {
    if (!data) return;
    setAgents(data);
    // Action tags that should NOT appear in top filters (now multi-word)
    const actionTags = ["Deep Research", "Send Report", "Email Outreach", "Scheduled Action", "Creative Content"];
    // Build a unique tag list from all agents, excluding action tags
    const uniqueTags = Array.from(
      new Set(
        data
          .flatMap((agent: Agent) => agent.tags || [])
          .filter((tag: string) => !!tag && !actionTags.includes(tag))
      )
    );
    const allTags = ["Recommended", ...uniqueTags];
    setTags(Array.from(new Set(allTags)));
  }, [data]);

  const loading = isPending;

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