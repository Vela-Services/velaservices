import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// It's assumed that STRIPE_SECRET_KEY is set in your environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-07-30.basil",
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      paymentIntentId,
      refundType,
      refundPercentage,
      orderId,
    } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing paymentIntentId" },
        { status: 400 }
      );
    }
    if (
      typeof refundType !== "string" ||
      typeof refundPercentage !== "number" ||
      (refundType !== "full" && refundType !== "partial" && refundType !== "none")
    ) {
      return NextResponse.json({ error: "Invalid refund type/percentage" }, { status: 400 });
    }

    // refundType: "full", "partial", "none"
    // refundPercentage: 1, 0.5, or 0

    if (refundType === "none" || refundPercentage === 0) {
      // No refund, just return result for logging
      return NextResponse.json({
        refundId: null,
        refundType: "none",
        status: "no_refund",
        message: "No refund applicable due to late cancellation.",
      });
    }

    // Fetch the PaymentIntent to get the amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "PaymentIntent not found" },
        { status: 404 }
      );
    }

    // PaymentIntent amount is in the smallest currency unit (e.g., cents)
    let refundAmount = paymentIntent.amount;
    if (refundType === "partial" && refundPercentage < 1) {
      // Partial refund: multiply amount by refundPercentage (typically 0.5)
      refundAmount = Math.round(paymentIntent.amount * refundPercentage);
    }
    // For full refund, refundAmount is the full paymentIntent.amount

    // Some platforms may pass fullPrice in NOK, which should match paymentIntent.amount.
    // If you want, you can verify amount here, but trust Stripe for now.

    // Create the refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
      metadata: {
        reason: "cancellation",
        orderId: orderId || "",
        refundType,
        calculated_by: "api/stripe/refund-on-cancel",
      },
      reason: "requested_by_customer",
    });

    return NextResponse.json({
      refundId: refund.id,
      refundType,
      refundedAmount: refundAmount,
      currency: paymentIntent.currency,
      stripeRefund: refund,
      status: "refunded",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

