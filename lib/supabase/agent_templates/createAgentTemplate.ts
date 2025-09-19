import supabase from "@/lib/supabase/serverClient";

export async function createAgentTemplate(params: {
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  isPrivate: boolean;
  shareEmails?: string[];
  userId?: string | null;
}) {
  const { data, error } = await supabase
    .from("agent_templates")
    .insert({
      title: params.title,
      description: params.description,
      prompt: params.prompt,
      tags: params.tags,
      is_private: params.isPrivate,
      creator: params.userId ?? null,
    })
    .select("id, title, description, prompt, tags, creator, is_private, created_at, favorites_count")
    .single();
  if (error) throw error;

  // Handle email sharing if agent is private and emails are provided
  if (params.isPrivate && params.shareEmails && params.shareEmails.length > 0) {
    await createAgentTemplateShares(data.id, params.shareEmails);
  }

  return data;
}

// Helper function to create agent template shares
async function createAgentTemplateShares(templateId: string, emails: string[]) {
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


