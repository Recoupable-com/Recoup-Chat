import { NextRequest } from "next/server";
import { verifyPrivyFromRequest, requireAuth } from "@/lib/auth/server";
import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!,
);

export async function GET(req: NextRequest) {
  const claims = await verifyPrivyFromRequest(req);
  console.log("claims", claims?.userId);
  const error = requireAuth(claims);
  const user = await privy.getUser(claims!.userId);
  console.log("user", user);
  if (error) return error;

  const userId = claims!.userId; // Server-side authenticated user id from Privy

  return Response.json(
    {
      ok: true,
      userId,
      claims,
    },
    { status: 200 },
  );
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;


