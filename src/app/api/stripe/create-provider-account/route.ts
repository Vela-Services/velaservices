// src/app/api/stripe/create-provider-account/route.ts
export const runtime = "nodejs"; // ✅ obligatoire pour firebase-admin et Stripe

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const { email, providerId, country = "NO" } = await req.json();

    // 1️⃣ Crée le compte Stripe Connect
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

    // 2️⃣ Crée le lien d’onboarding
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/onboarding/refresh?account_id=${account.id}`,
      return_url: `${baseUrl}/onboarding/success?account_id=${account.id}`,
      type: "account_onboarding",
    });

    // 3️⃣ Sauvegarde dans Firestore via firebase-admin
    if (providerId) {
      await adminDb.collection("users").doc(providerId).set(
        {
          stripeAccountId: account.id,
          stripeOnboardingStatus: "pending",
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: link.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Create provider account error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
