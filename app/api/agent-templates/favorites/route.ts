import { NextResponse } from "next/server";
import { addAgentTemplateFavorite } from "@/lib/supabase/agent_templates/addAgentTemplateFavorite";
import { removeAgentTemplateFavorite } from "@/lib/supabase/agent_templates/removeAgentTemplateFavorite";
import type { ToggleFavoriteRequest, ToggleFavoriteResponse } from "@/types/AgentTemplates";
import { NEW_API_BASE_URL } from "@/lib/consts";

export const runtime = "edge";

const SUNSET_DAYS = 90;

function getDeprecationHeaders(): Record<string, string> {
  const sunsetDate = new Date();
  sunsetDate.setDate(sunsetDate.getDate() + SUNSET_DAYS);

  return {
    Deprecation: "true",
    Sunset: sunsetDate.toUTCString(),
    Link: `<${NEW_API_BASE_URL}/api/agent-templates/favorites>; rel="deprecation"`,
  };
}

/**
 * @deprecated This endpoint is deprecated. Use recoup-api directly at recoup-api.vercel.app/api/agent-templates/favorites
 */
export async function POST(request: Request) {
  const deprecationHeaders = getDeprecationHeaders();

  try {
    const { templateId, userId, isFavourite }: ToggleFavoriteRequest = await request.json();

    if (!templateId || !userId) {
      return NextResponse.json(
        { error: "Missing templateId or userId" },
        { status: 400, headers: deprecationHeaders }
      );
    }

    if (isFavourite) {
      await addAgentTemplateFavorite(templateId, userId);
    } else {
      await removeAgentTemplateFavorite(templateId, userId);
    }

    return NextResponse.json(
      { success: true } as ToggleFavoriteResponse,
      { headers: deprecationHeaders }
    );
  } catch (error) {
    console.error("Error toggling favourite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favourite" } as ToggleFavoriteResponse,
      { status: 500, headers: deprecationHeaders }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;


