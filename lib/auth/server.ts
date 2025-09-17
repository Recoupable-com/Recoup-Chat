import { NextRequest } from "next/server";
import { PrivyClient, type AuthTokenClaims } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!,
);

export type VerifiedAuth = Pick<
  AuthTokenClaims,
  "appId" | "userId" | "issuer" | "issuedAt" | "expiration" | "sessionId"
>;

export const extractBearer = (req: NextRequest): string | null => {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice("Bearer ".length);
  return null;
};

export const extractPrivyToken = (req: NextRequest): string | null => {
  return extractBearer(req) || req.cookies.get("privy-token")?.value || null;
};

export async function verifyPrivyFromRequest(req: NextRequest): Promise<VerifiedAuth | null> {
  const token = extractPrivyToken(req);
  if (!token) return null;
  try {
    const claims = await privy.verifyAuthToken(token);
    return {
      appId: claims.appId,
      userId: claims.userId,
      issuer: claims.issuer,
      issuedAt: claims.issuedAt,
      expiration: claims.expiration,
      sessionId: claims.sessionId,
    };
  } catch {
    return null;
  }
}

export function requireAuth(claims: VerifiedAuth | null) {
  if (!claims) {
    return Response.json({ message: "Authentication required" }, { status: 401 });
  }
  return null;
}


