import Stripe from "stripe";
import stripeClient from "./client";
import { v4 as uuidV4 } from "uuid";

const createSession = async (accountId: string) => {
  const metadata = {
    accountId,
  };
  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: "usd",
    unit_amount: 2000,
    product_data: {
      name: "Recoup Pro",
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
  };
  const session = await stripeClient.checkout.sessions.create(sessionData);
  return session;
};

export default createSession;
