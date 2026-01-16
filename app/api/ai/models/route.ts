import { getAvailableModels } from "@/lib/ai/getAvailableModels";
import { NEW_API_BASE_URL } from "@/lib/consts";

const SUNSET_DAYS = 90;

function getDeprecationHeaders(): Record<string, string> {
  const sunsetDate = new Date();
  sunsetDate.setDate(sunsetDate.getDate() + SUNSET_DAYS);

  return {
    Deprecation: "true",
    Sunset: sunsetDate.toUTCString(),
    Link: `<${NEW_API_BASE_URL}/api/ai/models>; rel="deprecation"`,
  };
}

/**
 * GET /api/ai/models
 *
 * @deprecated This endpoint is deprecated. Use recoup-api directly at recoup-api.vercel.app/api/ai/models
 *
 * Server-side endpoint that proxies `getAvailableModels()` so that the
 * client can fetch model metadata without requiring server-side imports
 * of `@ai-sdk/gateway`.
 */
export async function GET() {
  const deprecationHeaders = getDeprecationHeaders();

  try {
    const models = await getAvailableModels();
    return Response.json({ models }, { headers: deprecationHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 500, headers: deprecationHeaders });
  }
}

// Disable caching to always serve the latest model list.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
