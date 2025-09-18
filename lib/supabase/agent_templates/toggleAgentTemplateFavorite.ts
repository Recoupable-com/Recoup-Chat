import supabase from "@/lib/supabase/serverClient";

export async function toggleAgentTemplateFavorite(
  templateId: string,
  userId: string,
  isFavourite: boolean
) {
  if (isFavourite) {
    const { error } = await supabase
      .from("agent_template_favorites")
      .insert({ template_id: templateId, user_id: userId })
      .select("template_id")
      .maybeSingle();
    
    if (error && error.code !== "23505") {
      throw error; // ignore unique violation
    }
  } else {
    const { error } = await supabase
      .from("agent_template_favorites")
      .delete()
      .eq("template_id", templateId)
      .eq("user_id", userId);
    
    if (error) {
      throw error;
    }
  }
}
