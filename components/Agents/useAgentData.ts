import { useUserProvider } from "@/providers/UserProvder";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ToggleFavoriteRequest } from "@/types/agentTemplates";
import type { AgentTemplateRow } from "@/types/agentTemplates";

type Agent = AgentTemplateRow;

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
    queryFn: async (): Promise<Agent[]> => {
      const res = await fetch(`/api/agent-templates?userId=${userData?.id}`);
      if (!res.ok) throw new Error("Failed to fetch agent templates");
      return (await res.json()) as Agent[];
    },
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
      (selectedTag === "Recommended" ? true : agent.tags?.includes(selectedTag)) &&
      (isPrivate ? agent.is_private === true : agent.is_private !== true)
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
    isPrivate,
    togglePrivate,
    handleToggleFavorite: async (templateId: string, nextFavourite: boolean) => {
      if (!userData?.id || !templateId) return;
      const body: ToggleFavoriteRequest = { templateId, userId: userData.id, isFavourite: nextFavourite };
      const res = await fetch("/api/agent-templates/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await res.json(); // parsed for completeness; response not used now
      // Invalidate templates list so is_favourite and favorites_count refresh
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
    },
  };
} 