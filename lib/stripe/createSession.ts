import Stripe from "stripe";
import stripeClient from "./client";
import { v4 as uuidV4 } from "uuid";

const createSession = async (accountId: string, successUrl: string) => {
  const metadata = {
    accountId,
  };
  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: "usd",
    unit_amount: 2000,
    product_data: {
      name: "Recoup Pro",
    },
    recurring: {
      interval: "month",
      interval_count: 1,
    },
  };

  const sessionData: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price_data: priceData,
        quantity: 1,
      },
    ],
    mode: "subscription",
    client_reference_id: uuidV4(),
    metadata,
    subscription_data: {
      metadata,
    },
    success_url: successUrl,
  };
  const session = await stripeClient.checkout.sessions.create(sessionData);
  return session;
};

export default createSession;
