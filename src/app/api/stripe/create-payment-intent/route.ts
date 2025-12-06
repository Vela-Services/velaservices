import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

type CartItem = {
  serviceId: string;
  serviceName: string;
  price: number;
  providerId: string;
};

export async function POST(req: Request) {
  try {
    const { cart, customerId, promoCode } = (await req.json()) as {
      cart: CartItem[];
      customerId: string;
      promoCode?: {
        code: string;
        discountType: "percentage" | "fixed";
        discountValue: number;
        discountAmount: number;
      } | null;
    };

    if (!cart?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Tous les items sont du même provider
    const providerId = cart[0].providerId;

    // 🔍 Récupérer le compte Stripe du provider depuis Firestore
    const providerSnap = await adminDb.collection("users").doc(providerId).get();
    if (!providerSnap.exists) {
      return NextResponse.json(
        { error: `Provider ${providerId} not found` },
        { status: 404 }
      );
    }

    const providerData = providerSnap.data();
    const providerStripeAccountId = providerData?.stripeAccountId;

    if (!providerStripeAccountId) {
      return NextResponse.json(
        { error: "Provider Stripe Account ID missing in Firestore" },
        { status: 400 }
      );
    }

    // 💰 Calcul du montant total (en øre)
    const totalAmountNOK = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    
    // Apply promo code discount if present
    const discountAmount = promoCode?.discountAmount || 0;
    const finalAmountNOK = Math.max(0, totalAmountNOK - discountAmount);
    
    const amount = Math.max(50, Math.round(finalAmountNOK * 100));

    console.log("🧾 Creating PaymentIntent (platform funds):", {
      amount,
      providerId,
      providerStripeAccountId,
      customerId,
      promoCode: promoCode?.code,
      discountAmount,
    });

    // ⚡ Créer le PaymentIntent (sur ton compte plateforme)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "nok",
      metadata: {
        customerId,
        providerId,
        providerStripeAccountId,
        cart: JSON.stringify(cart.map((i) => i.serviceName)),
        promoCode: promoCode?.code || "",
        discountAmount: discountAmount.toString(),
      },
    });

    console.log("✅ PaymentIntent created:", paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      stripeAccountId: providerStripeAccountId,
    });
  } catch (error) {
    console.error("💥 Stripe error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
