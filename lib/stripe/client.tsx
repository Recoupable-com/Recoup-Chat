import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SK as string);

export default stripeClient;
