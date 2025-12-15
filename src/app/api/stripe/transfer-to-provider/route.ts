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

    // --- Fee structure:
    // - Customer pays: providerPrice * 1.05 (5% platform fee added)
    // - Provider sets price that includes 10% cut for Véla
    // - Total Véla takes: 10% from provider + 5% from customer = 15% total
    // 
    // Calculation:
    // - totalAmount = providerPrice * 1.05 (what customer paid)
    // - providerPrice = totalAmount / 1.05 (base price provider set)
    // - Provider receives: providerPrice * 0.9 (90% of their set price, as 10% goes to Véla)
    // - Véla keeps: 10% of providerPrice + 5% of totalAmount = 15% total
    const totalAmount = Number(amount); // e.g. 1050.00 NOK (providerPrice * 1.05)
    const providerPrice = Math.round((totalAmount / 1.05) * 100) / 100; // provider's set price (includes 10% for Véla)
    const providerPriceInCents = Math.round(providerPrice * 100); // in øre/cents

    // --- Calculate provider payout and Véla's take
    // Provider gets 90% of the price they set (10% goes to Véla)
    const PROVIDER_PERCENTAGE = 0.90; // Provider receives 90% of their set price
    const providerAmount = Math.round(providerPriceInCents * PROVIDER_PERCENTAGE);
    
    // Véla's total take: 10% from provider + 5% from customer
    const velaFromProvider = Math.round(providerPriceInCents * 0.10); // 10% of provider price (in cents)
    const totalAmountInCents = Math.round(totalAmount * 100); // total customer payment in cents
    const velaFromCustomer = Math.round(totalAmountInCents * 0.05); // 5% of total customer payment (in cents)
    const totalVelaTake = velaFromProvider + velaFromCustomer;

    // Calculate fees for reporting
    const customerPlatformFee = Math.round((totalAmount * 0.05) * 100) / 100; // 5% from customer in NOK
    const providerPlatformFee = Math.round((providerPrice * 0.10) * 100) / 100; // 10% from provider in NOK
    const totalPlatformFee = customerPlatformFee + providerPlatformFee; // Total 15%

    console.log("💰 [API] Transfer details:", {
      totalAmount,
      providerPrice,
      providerPriceInCents,
      providerAmount,
      velaFromProvider: velaFromProvider / 100,
      velaFromCustomer: velaFromCustomer / 100,
      totalVelaTake: totalVelaTake / 100,
      customerPlatformFee,
      providerPlatformFee,
      totalPlatformFee,
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
        providerPrice: providerPrice.toString(),
        customerPlatformFee: customerPlatformFee.toString(),
        providerPlatformFee: providerPlatformFee.toString(),
        totalPlatformFee: totalPlatformFee.toString(),
      },
    });

    console.log(`✅ [API] Transfer created: ${transfer.id}`);

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      amount: providerAmount / 100, // amount sent to provider (NOK) - 90% of their set price
      customerPlatformFee, // 5% platform fee from customer (NOK)
      providerPlatformFee, // 10% platform fee from provider (NOK)
      totalPlatformFee, // total platform fee (NOK) - 15% total
      providerPrice, // provider's set price (NOK)
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
