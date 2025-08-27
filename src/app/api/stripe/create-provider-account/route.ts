import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" });

export async function POST(req: Request) {
  try {
    const { email, } = await req.json(); // userId = uid Firebase

    // 1) Crée le compte Express
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // TODO: sauvegarde account.id (ex: users/{userId}.stripeAccountId) dans Firestore côté serveur

    // 2) Lien d’onboarding
    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://tonsite.com/onboarding/refresh",
      return_url: "https://tonsite.com/onboarding/success",
      type: "account_onboarding",
    });

    return NextResponse.json({ accountId: account.id, onboardingUrl: link.url });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("PI create error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
