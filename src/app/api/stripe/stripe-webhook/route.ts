import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",  // Version stable 2025 ; change si besoin
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // CORS pour permettre Stripe (same-origin par défaut en Next.js)
  const origin = req.headers.get("origin");
  const response = NextResponse.json({ received: true });

  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "POST");
  response.headers.set("Access-Control-Allow-Headers", "stripe-signature, Content-Type");

  if (req.method === "OPTIONS") {
    return response;
  }

  try {
    const body = await req.text();  // Raw body pour signature (essentiel sur Netlify)
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;
      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object);
        // Ajoute ici : update mission payée, ex. updateDoc pour commande
        break;
      case "transfer.created":
        await handleTransferCreated(event.data.object as Stripe.Transfer);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return response;
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// Tes handlers inchangés
async function handleAccountUpdated(account: Stripe.Account) {
  const providerId = account.metadata?.providerId;
  if (!providerId) return;

  const status = account.charges_enabled ? "active" : "pending";
  
  await updateDoc(doc(db, "providers", providerId), {
    stripeOnboardingStatus: status,
    stripeChargesEnabled: account.charges_enabled,
    stripePayoutsEnabled: account.payouts_enabled,
    updatedAt: new Date(),
  });
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  const missionId = transfer.metadata?.missionId;
  if (missionId) {
    await updateDoc(doc(db, "missions", missionId), {
      transferId: transfer.id,
      transferStatus: "completed",
      transferredAt: new Date(),
    });
  }
}