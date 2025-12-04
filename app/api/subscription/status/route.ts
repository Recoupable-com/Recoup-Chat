import { NextRequest } from "next/server";
import { getActiveSubscriptionDetails } from "@/lib/stripe/getActiveSubscriptionDetails";
import { getOrgSubscription } from "@/lib/stripe/getOrgSubscription";
import isActiveSubscription from "@/lib/stripe/isActiveSubscription";

export interface ProStatusResponse {
  isPro: boolean;
  proSource: {
    accountSubscription: boolean;
    orgSubscription: boolean;
  };
  subscription?: {
    id: string;
    status: string;
    source: "account" | "organization";
  };
}

/**
 * GET /api/subscription/status?accountId=xxx
 * Returns the account's pro status and which check passed
 */
export async function GET(req: NextRequest): Promise<Response> {
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!accountId) {
    return Response.json({ message: "accountId is required" }, { status: 400 });
  }

  try {
    // Check all pro sources in parallel (account subscription or org subscription)
    const [accountSubscription, orgSubscription] = await Promise.all([
      getActiveSubscriptionDetails(accountId),
      getOrgSubscription(accountId),
    ]);

    const proSource = {
      accountSubscription: isActiveSubscription(accountSubscription),
      orgSubscription: isActiveSubscription(orgSubscription),
    };

    const isPro = proSource.accountSubscription || proSource.orgSubscription;

    // Return the active subscription info based on which check actually passed
    // Prefer account subscription over org subscription if both are active
    let subscriptionInfo: ProStatusResponse["subscription"];
    if (proSource.accountSubscription && accountSubscription) {
      subscriptionInfo = {
        id: accountSubscription.id,
        status: accountSubscription.status,
        source: "account",
      };
    } else if (proSource.orgSubscription && orgSubscription) {
      subscriptionInfo = {
        id: orgSubscription.id,
        status: orgSubscription.status,
        source: "organization",
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
