import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

type CartItem = {
  serviceId: string;
  serviceName: string;
  price: number;
  providerId: string;
  providerStripeAccountId?: string; // ID du compte Stripe Connect du prestataire
};

export async function POST(req: Request) {
  console.log("🔑 API Key starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 7));
  console.log("🔑 Is test mode:", process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'));
  try {
    const { cart, customerId } = await req.json() as {
      cart: CartItem[];
      customerId: string;
    };

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculer le montant en NOK (en centimes)
    const totalNOK = cart.reduce((sum, it) => sum + (it.price || 0), 0);
    const amount = Math.max(50, Math.round(totalNOK * 100));

    console.log("Creating payment intent:", { amount, customerId, cartItems: cart.length });

    // Grouper par prestataire
    const providerGroups = cart.reduce((acc, item) => {
      if (!acc[item.providerId]) {
        acc[item.providerId] = {
          providerId: item.providerId,
          stripeAccountId: item.providerStripeAccountId,
          items: [],
          totalAmount: 0,
        };
      }
      acc[item.providerId].items.push(item);
      acc[item.providerId].totalAmount += item.price;
      return acc;
    }, {} as Record<string, {
      providerId: string;
      stripeAccountId?: string;
      items: CartItem[];
      totalAmount: number;
    }>);

    const providers = Object.values(providerGroups);

    // CAS 1: Un seul prestataire avec compte Stripe Connect
    if (providers.length === 1 && providers[0].stripeAccountId) {
      const provider = providers[0];
      
      // Calculer les frais de plateforme (10% par exemple)
      const platformFeePercentage = 0.10; // 10%
      const platformFee = Math.round(amount * platformFeePercentage);

      console.log(`Single provider payment - Platform fee: ${platformFee / 100} NOK`);

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "nok",
        application_fee_amount: platformFee, // Frais de plateforme en centimes
        transfer_data: {
          destination: provider.stripeAccountId!, // Compte du prestataire
        },
        metadata: {
          customerId,
          providerId: provider.providerId,
          cart: JSON.stringify(cart.map(it => ({
            service: it.serviceName,
            provider: it.providerId,
          }))),
        },
      });

      console.log("Payment intent created with destination:", paymentIntent.id);

      console.log("Returning payment intent:", paymentIntent.id);
      
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // CAS 2: Plusieurs prestataires OU prestataire sans compte Connect
    // On crée un PaymentIntent standard et on gérera les transferts manuellement
    console.log(`Multiple providers (${providers.length}) or no Stripe accounts - using standard payment`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "nok",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerId,
        multipleProviders: providers.length > 1 ? "true" : "false",
        providersData: JSON.stringify(providers.map(p => ({
          providerId: p.providerId,
          amount: p.totalAmount,
          hasStripeAccount: !!p.stripeAccountId,
        }))),
        cart: JSON.stringify(cart.map(it => ({
          service: it.serviceName,
          provider: it.providerId,
        }))),
      },
    });

    console.log("Standard payment intent created:", paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error("Stripe PaymentIntent error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}