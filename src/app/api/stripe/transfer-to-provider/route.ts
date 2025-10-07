import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  console.log("🔵 [API] /api/transfer-to-provider called");

  try {
    const {
      amount,
      stripeAccountId,
      missionId,
      description,
      paymentIntentId,
    } = await req.json();

    console.log("🟢 [API] Received body:", {
      amount,
      stripeAccountId,
      missionId,
      paymentIntentId,
    });

    // --- Validations
    if (!stripeAccountId) {
      return NextResponse.json(
        { error: "stripeAccountId is required" },
        { status: 400 }
      );
    }

    if (!paymentIntentId) {
      return NextResponse.json(
        {
          error:
            "paymentIntentId is required — cannot create transfer without source transaction",
        },
        { status: 400 }
      );
    }

    // --- Retrieve PaymentIntent
    console.log(`📦 [API] Retrieving PaymentIntent ${paymentIntentId}...`);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent.latest_charge) {
      return NextResponse.json(
        { error: "No charge found for this payment intent" },
        { status: 400 }
      );
    }

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        {
          error: `Payment intent status is ${paymentIntent.status}, must be succeeded`,
        },
        { status: 400 }
      );
    }

    // --- Calculate commission and payout
    const COMMISSION_RATE = 0.1; // 10 %
    const amountInCents = Math.round(Number(amount) * 100);
    const commission = Math.round(amountInCents * COMMISSION_RATE);
    const providerAmount = amountInCents - commission;

    console.log("💰 [API] Transfer details:", {
      amount,
      amountInCents,
      providerAmount,
      commission,
      missionId,
      stripeAccountId,
      chargeId: paymentIntent.latest_charge,
    });

    // --- Create transfer
    const transfer = await stripe.transfers.create({
      amount: providerAmount,
      currency: "nok",
      destination: stripeAccountId,
      source_transaction: paymentIntent.latest_charge as string,
      description: description || `Mission ${missionId} payout`,
      metadata: {
        missionId,
        paymentIntentId,
        originalAmount: amount.toString(),
        commission: (commission / 100).toString(),
      },
    });

    console.log(`✅ [API] Transfer created: ${transfer.id}`);

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      amount: providerAmount / 100,
      commission: commission / 100,
      status: transfer.object,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("🔥 [API] Transfer error:", errorMessage);

    if (errorMessage.includes("destination")) {
      return NextResponse.json(
        { error: "Invalid Stripe account ID or account not connected" },
        { status: 400 }
      );
    }

    if (errorMessage.includes("source_transaction")) {
      return NextResponse.json(
        { error: "Cannot create transfer: source transaction is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
