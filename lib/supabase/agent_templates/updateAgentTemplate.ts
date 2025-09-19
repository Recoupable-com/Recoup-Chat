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

// Helper function to update agent template shares
async function updateAgentTemplateShares(templateId: string, emails: string[]) {
  // First, delete existing shares
  const { error: deleteError } = await supabase
    .from("agent_template_shares")
    .delete()
    .eq("template_id", templateId);

  if (deleteError) throw deleteError;

  // Then create new shares if emails provided
  if (emails && emails.length > 0) {
    // Get user accounts by email
    const { data: users, error: usersError } = await supabase
      .from("accounts")
      .select("id, email")
      .in("email", emails);

    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      // If no users found, we could either throw an error or silently continue
      // For now, we'll silently continue as the emails might be for future users
      return;
    }

    // Create share records for found users
    const sharesData = users.map(user => ({
      template_id: templateId,
      user_id: user.id,
    }));

    const { error: sharesError } = await supabase
      .from("agent_template_shares")
      .upsert(sharesData, {
        onConflict: "template_id,user_id",
        ignoreDuplicates: true
      });

    if (sharesError) throw sharesError;
  }
}


