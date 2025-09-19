import supabase from "@/lib/supabase/serverClient";

export type AgentTemplateUpdates = {
  title?: string;
  description?: string;
  prompt?: string;
  tags?: string[];
  is_private?: boolean;
};

export async function updateAgentTemplate(
  id: string,
  updates: AgentTemplateUpdates
) {
  const { data, error } = await supabase
    .from("agent_templates")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, title, description, prompt, tags, creator, is_private, created_at, favorites_count, updated_at"
    )
    .single();
  if (error) throw error;
  return data;
}


