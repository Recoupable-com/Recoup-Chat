import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import type { AgentTemplateRow } from "@/types/agentTemplates";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId && userId !== "undefined") {
      const { data, error } = await supabase
        .from("agent_templates")
        .select("id, title, description, prompt, tags, creator, is_private, created_at, favorites_count, updated_at")
        .or(`creator.eq.${userId},is_private.eq.false`) // user-owned OR any public
        .order("title");

      if (error) throw error;
      // Fetch user's favourites and merge into response as is_favourite
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

      return NextResponse.json(withFavourite);
    }

    // No userId: return any public templates only
    const { data, error } = await supabase
      .from("agent_templates")
      .select("id, title, description, prompt, tags, creator, is_private, created_at, favorites_count, updated_at")
      .eq("is_private", false)
      .order("title");

    if (error) throw error;
    // No user: include is_favourite=false for consistency
    const withFavourite = (data || []).map((t: AgentTemplateRow) => ({ ...t, is_favourite: false }));
    return NextResponse.json(withFavourite);
  } catch (error) {
    console.error('Error fetching agent templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      prompt,
      tags,
      isPrivate,
      userId,
    }: {
      title: string;
      description: string;
      prompt: string;
      tags: string[];
      isPrivate: boolean;
      userId?: string | null;
    } = body;

    const { data, error } = await supabase
      .from("agent_templates")
      .insert({
        title,
        description,
        prompt,
        tags,
        is_private: isPrivate,
        creator: userId ?? null,
      })
      .select("id, title, description, prompt, tags, creator, is_private, created_at, favorites_count")
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating agent template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, userId } = (await request.json()) as { id: string; userId: string };
    if (!id || !userId) {
      return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
    }

    // Verify ownership
    const { data: template, error: fetchError } = await supabase
      .from("agent_templates")
      .select("id, creator")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!template || template.creator !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("agent_templates")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0; 