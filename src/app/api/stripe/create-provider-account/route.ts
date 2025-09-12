import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const { email, providerId, country = "FR" } = await req.json();

    const account = await stripe.accounts.create({
      type: "express",
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: { providerId },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/onboarding/refresh?account_id=${account.id}`,
      return_url: `${baseUrl}/onboarding/success?account_id=${account.id}`,
      type: "account_onboarding",
    });

    if (providerId) {
      await updateDoc(doc(db, "providers", providerId), {
        stripeAccountId: account.id,
        stripeOnboardingStatus: "pending",
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: link.url,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Create provider account error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
