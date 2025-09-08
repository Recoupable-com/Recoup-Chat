import stripeClient from "@/lib/stripe/client";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const successUrl = body.successUrl;
  const referenceId = body.referenceId;
  const metadata = body.metadata;
  const isSubscription = body.isSubscription;
  const productName = body.productName;
  const totalPrice = body.totalPrice;

  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: "usd",
    unit_amount: isSubscription ? 2000 : totalPrice,
    product_data: {
      name: productName,
    },
  };

  if (isSubscription)
    priceData.recurring = {
      interval: "month",
      interval_count: 1,
    };

  try {
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      success_url: successUrl as string,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: isSubscription ? "subscription" : "payment",
      client_reference_id: referenceId,
      metadata,
    };
    if (isSubscription) {
      sessionData.subscription_data = {
        metadata,
      };
    }
    const session = await stripeClient.checkout.sessions.create(sessionData);

    return Response.json({ data: session }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
