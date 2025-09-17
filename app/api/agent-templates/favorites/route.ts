import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";
import type { ToggleFavoriteRequest, ToggleFavoriteResponse } from "@/types/AgentTemplates";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { templateId, userId, isFavourite }: ToggleFavoriteRequest = await request.json();

    if (!templateId || !userId) {
      return NextResponse.json({ error: "Missing templateId or userId" }, { status: 400 });
    }

    if (isFavourite) {
      const { error } = await supabase
        .from("agent_template_favorites")
        .insert({ template_id: templateId, user_id: userId })
        .select("template_id")
        .maybeSingle();
      if (error && error.code !== "23505") throw error; // ignore unique violation
    } else {
      const { error } = await supabase
        .from("agent_template_favorites")
        .delete()
        .eq("template_id", templateId)
        .eq("user_id", userId);
      if (error) throw error;
    }

    return NextResponse.json({ success: true } as ToggleFavoriteResponse);
  } catch (error) {
    console.error("Error toggling favourite:", error);
    return NextResponse.json({ error: "Failed to toggle favourite" } as ToggleFavoriteResponse, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;


