import supabase from "@/lib/supabase/serverClient";
import type { AgentTemplateRow } from "@/types/AgentTemplates";

export async function listAgentTemplatesWithFavourites(userId?: string | null) {
  if (userId && userId !== "undefined") {
    const { data, error } = await supabase
      .from("agent_templates")
      .select(
        "id, title, description, prompt, tags, creator, is_private, created_at, favorites_count, updated_at"
      )
      .or(`creator.eq.${userId},is_private.eq.false`)
      .order("title");
    if (error) throw error;

    const { data: favs, error: favError } = await supabase
      .from("agent_template_favorites")
      .select("template_id")
      .eq("user_id", userId);
    if (favError) throw favError;

    const favouriteIds = new Set<string>((favs || []).map((f: { template_id: string }) => f.template_id));
    const withFavourite = (data || []).map((t: AgentTemplateRow) => ({
      ...t,
      is_favourite: favouriteIds.has(t.id),
    }));
    return withFavourite;
  }

  const { data, error } = await supabase
    .from("agent_templates")
    .select(
      "id, title, description, prompt, tags, creator, is_private, created_at, favorites_count, updated_at"
    )
    .eq("is_private", false)
    .order("title");
  if (error) throw error;
  const withFavourite = (data || []).map((t: AgentTemplateRow) => ({ ...t, is_favourite: false }));
  return withFavourite;
}


