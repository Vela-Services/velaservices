import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

type CartItem = {
  serviceId: string;
  serviceName: string;
  price: number;
  date: string;
  times: string[];
  providerId: string;
  providerName?: string;
  subservices?: Record<string, number>;
};

export async function POST(req: Request) {
  try {
    const { cart, customerId } = (await req.json()) as {
      cart: CartItem[];
      customerId: string;
    };

    const totalNOK = cart.reduce((sum, it) => sum + (it.price || 0), 0);
    const amount = Math.max(50, Math.round(totalNOK * 100));

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "nok",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("PI create error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
