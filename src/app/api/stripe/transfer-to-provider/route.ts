import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PROD!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  console.log("🔵 [API] /api/transfer-to-provider called");

  try {
    const {
      amount, // This is the total amount paid by the customer (including platform fee)
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

    // --- Remove platform fee (10%) from total amount
    // amount is the total paid by customer (including 10% platform fee)
    // We want to remove the 10% platform fee before calculating commission and payout
    // subtotal = total / 1.1
    const totalAmount = Number(amount); // e.g. 1100.00 NOK
    const subtotal = Math.round((totalAmount / 1.1) * 100) / 100; // in NOK, rounded to 2 decimals
    const subtotalInCents = Math.round(subtotal * 100); // in øre/cents

    // --- Calculate commission and payout
    const COMMISSION_RATE = 0.075; // 7.5 %
    const commission = Math.round(subtotalInCents * COMMISSION_RATE);
    const providerAmount = subtotalInCents - commission;

    // Calculate platform fee for reporting
    const platformFee = Math.round((totalAmount - subtotal) * 100) / 100; // in NOK

    console.log("💰 [API] Transfer details:", {
      totalAmount,
      subtotal,
      subtotalInCents,
      providerAmount,
      commission,
      platformFee,
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
        originalAmount: totalAmount.toString(),
        subtotal: subtotal.toString(),
        commission: (commission / 100).toString(),
        platformFee: platformFee.toString(),
      },
    });

    console.log(`✅ [API] Transfer created: ${transfer.id}`);

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      amount: providerAmount / 100, // amount sent to provider (NOK)
      commission: commission / 100, // commission taken (NOK)
      platformFee, // platform fee (NOK)
      subtotal, // subtotal (NOK, before platform fee)
      totalAmount, // total paid by customer (NOK)
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
