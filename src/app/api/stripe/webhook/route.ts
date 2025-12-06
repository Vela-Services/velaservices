import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;

    const needsMoreInfo =
      Array.isArray(account.requirements?.currently_due) &&
      account.requirements.currently_due.length > 0;
    const chargesEnabled = account.charges_enabled;
    const payoutsEnabled = account.payouts_enabled;

    const snapshot = await adminDb
      .collection("users")
      .where("stripeAccountId", "==", account.id)
      .get();
  
    for (const doc of snapshot.docs) {
      // Update Firestore status based on Stripe state
      await doc.ref.set(
        {
          stripeOnboardingStatus: needsMoreInfo
            ? "incomplete"
            : chargesEnabled
            ? "active"
            : "pending",
          stripeChargesEnabled: chargesEnabled,
          stripePayoutsEnabled: payoutsEnabled,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }
  
    console.log(
      `✅ Account ${account.id} updated → ${needsMoreInfo ? "incomplete" : chargesEnabled ? "active" : "pending"}`
    );
  }
  

  return NextResponse.json({ received: true });
}
