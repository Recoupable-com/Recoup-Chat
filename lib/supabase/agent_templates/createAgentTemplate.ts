import supabase from "@/lib/supabase/serverClient";

export async function createAgentTemplate(params: {
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  isPrivate: boolean;
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
  return data;
}


