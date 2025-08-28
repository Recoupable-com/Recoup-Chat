import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId && userId !== "undefined") {
      const { data, error } = await supabase
        .from("agent_templates")
        .select("id, title, description, prompt, tags, creator, is_private")
        .or(`creator.eq.${userId},is_private.eq.false`) // user-owned OR any public
        .order("title");

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // No userId: return any public templates only
    const { data, error } = await supabase
      .from("agent_templates")
      .select("id, title, description, prompt, tags, creator, is_private")
      .eq("is_private", false)
      .order("title");

    if (error) throw error;
    return NextResponse.json(data || []);
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
      .select("id, title, description, prompt, tags, creator, is_private")
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating agent template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0; 