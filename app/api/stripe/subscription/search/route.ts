import stripeClient from "@/lib/stripe/client";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!accountId) {
    return Response.json({ message: "accountId is required" }, { status: 400 });
  }

  try {
    const subscriptions = await stripeClient.subscriptions.list({
      limit: 100,
      current_period_end: {
        gt: parseInt(Number(Date.now() / 1000).toFixed(0), 10),
      },
    });

    const activeSubscriptions = subscriptions?.data?.filter(
      (subscription: Stripe.Subscription) =>
        subscription.metadata?.accountId === accountId
    );

    return Response.json({ data: activeSubscriptions }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
