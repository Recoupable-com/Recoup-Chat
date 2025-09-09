import Stripe from "stripe";
import stripeClient from "./client";
import { v4 as uuidV4 } from "uuid";

const createSession = async (accountId: string, successUrl: string) => {
  const metadata = {
    accountId,
  };

  const sessionData: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: "price_1RyDFD00JObOnOb53PcVOeBz",
        quantity: 1,
      },
    ],
    mode: "subscription",
    client_reference_id: uuidV4(),
    metadata,
    subscription_data: {
      metadata,
      trial_period_days: 30,
    },
    success_url: successUrl,
  };
  const session = await stripeClient.checkout.sessions.create(sessionData);
  return session;
};

export default createSession;
