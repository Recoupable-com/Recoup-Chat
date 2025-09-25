import { useUserProvider } from "@/providers/UserProvder";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AgentTemplateRow } from "@/types/AgentTemplates";

export type Agent = AgentTemplateRow;

const fetchAgentTemplates = async (userData: {id: string}): Promise<Agent[]> => {
  const res = await fetch(`/api/agent-templates?userId=${userData?.id}`);
  if (!res.ok) throw new Error("Failed to fetch agent templates");
  return (await res.json()) as Agent[];
}

export function useAgentData() {
  const { userData } = useUserProvider();
  const queryClient = useQueryClient();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTag, setSelectedTag] = useState("Recommended");
  const [tags, setTags] = useState<string[]>(["Recommended"]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const { data, isPending } = useQuery<Agent[]>({
    queryKey: ["agent-templates"],
    queryFn: () => fetchAgentTemplates(userData),
    retry: 1,
    enabled: !!userData?.id,
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

  // Toggle function to switch between public and private agent visibility
  const togglePrivate = () => setIsPrivate(!isPrivate);

  // Get all agents except the special card, filtered by the selected tag and public/private
  const filteredAgents = agents.filter(
    (agent) =>
      agent.title !== "Audience Segmentation" &&
      (selectedTag === "Recommended"
        ? true
        : agent.tags?.includes(selectedTag)) &&
      (isPrivate ? agent.is_private === true : agent.is_private !== true)
  );
  // Hide the "Audience Segmentation" card from UI - keep all other logic intact
  const gridAgents = filteredAgents;

  // Prefetch agent data for better performance on hover
  const prefetchAgents = () => {
    if (userData?.id) {
      queryClient.prefetchQuery({
        queryKey: ["agent-templates"],
        queryFn: () => fetchAgentTemplates(userData),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  };

  return {
    tags,
    selectedTag,
    setSelectedTag,
    loading,
    showAllTags,
    setShowAllTags,
    gridAgents,
    isPrivate,
    togglePrivate,
    prefetchAgents,
  };
}
