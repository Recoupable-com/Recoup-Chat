import { NextRequest } from "next/server";
import { getActiveSubscriptionDetails } from "@/lib/stripe/getActiveSubscriptionDetails";
import { getOrgSubscription } from "@/lib/stripe/getOrgSubscription";
import isActiveSubscription from "@/lib/stripe/isActiveSubscription";

export interface ProStatusResponse {
  isPro: boolean;
  proSource: {
    userSubscription: boolean;
    orgSubscription: boolean;
  };
  subscription?: {
    id: string;
    status: string;
    source: "user" | "org";
  };
}

/**
 * GET /api/subscription/status?accountId=xxx
 * Returns the user's pro status and which check passed
 */
export async function GET(req: NextRequest): Promise<Response> {
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!accountId) {
    return Response.json({ message: "accountId is required" }, { status: 400 });
  }

  try {
    // Check all pro sources in parallel (user subscription or org subscription)
    const [userSubscription, orgSubscription] = await Promise.all([
      getActiveSubscriptionDetails(accountId),
      getOrgSubscription(accountId),
    ]);

    const proSource = {
      userSubscription: isActiveSubscription(userSubscription),
      orgSubscription: isActiveSubscription(orgSubscription),
    };

    // Log for debugging
    console.log(`[Pro Status] accountId: ${accountId}`, proSource);

    const isPro = proSource.userSubscription || proSource.orgSubscription;

    // Return the active subscription info based on which check actually passed
    // Prefer user subscription over org subscription if both are active
    let subscriptionInfo: ProStatusResponse["subscription"];
    if (proSource.userSubscription && userSubscription) {
      subscriptionInfo = {
        id: userSubscription.id,
        status: userSubscription.status,
        source: "user",
      };
    } else if (proSource.orgSubscription && orgSubscription) {
      subscriptionInfo = {
        id: orgSubscription.id,
        status: orgSubscription.status,
        source: "org",
      };
    }

    const response: ProStatusResponse = {
      isPro,
      proSource,
      subscription: subscriptionInfo,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("[Pro Status] Error:", error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

