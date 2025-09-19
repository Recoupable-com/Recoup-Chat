import supabase from "@/lib/supabase/serverClient";
import { updateAgentTemplateShares } from "./updateAgentTemplateShares";

export type AgentTemplateUpdates = {
  title?: string;
  description?: string;
  prompt?: string;
  tags?: string[];
  is_private?: boolean;
};

export async function updateAgentTemplate(
  id: string,
  updates: AgentTemplateUpdates,
  shareEmails?: string[]
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

  // Handle email sharing updates if shareEmails is provided
  // Note: userId is used for permission checking at the API level, not needed here
  if (typeof shareEmails !== "undefined") {
    await updateAgentTemplateShares(id, shareEmails);
  }

  return data;
}