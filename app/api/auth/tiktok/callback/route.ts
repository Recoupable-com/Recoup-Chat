import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/tiktok/callback
 * 
 * Proxy endpoint that forwards TikTok OAuth callback to Composio.
 * TikTok requires redirect URIs on verified domains, so we use our domain
 * and forward the OAuth params to Composio's callback handler.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Forward all query params to Composio's callback
  const composioCallbackUrl = new URL("https://backend.composio.dev/api/v1/auth-apps/add");
  
  // Copy all params from TikTok's callback
  searchParams.forEach((value, key) => {
    composioCallbackUrl.searchParams.set(key, value);
  });

  // Redirect to Composio to complete the OAuth flow
  return NextResponse.redirect(composioCallbackUrl.toString());
}
