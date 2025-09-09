import stripeClient from "@/lib/stripe/client";
import { getActiveSubscriptionDetails } from "@/lib/stripe/getActiveSubscriptionDetails";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const accountId = body.accountId;
  const returnUrl = body.returnUrl;

  try {
    // Find the active subscription for this account
    const activeSubscription = await getActiveSubscriptionDetails(accountId);

    if (!activeSubscription) {
      return Response.json(
        { message: "No active subscription found for this account" },
        { status: 404 }
      );
    }

    // Create billing portal session using the customer from the subscription
    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: activeSubscription.customer as string,
      return_url: returnUrl,
    });

    return Response.json({ data: portalSession }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
