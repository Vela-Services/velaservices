import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const { amount, stripeAccountId, missionId, description } = await req.json();

    // Calcul de la commission (10%)
    const COMMISSION_RATE = 0.10;
    const commission = Math.round(amount * COMMISSION_RATE);
    const providerAmount = amount - commission;

    const transfer = await stripe.transfers.create({
      amount: providerAmount,
      currency: "nok",
      destination: stripeAccountId,
      metadata: {
        missionId,
        originalAmount: amount.toString(),
        commission: commission.toString(),
      },
      description: description || `Paiement mission ${missionId}`,
    });

    return NextResponse.json({
      transferId: transfer.id,
      amount: providerAmount,
      commission,
      status: transfer.object,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Transfer error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}