"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../../lib/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAuth } from "../../hooks/useAuth";
import { createMissionsFromCart } from "../../../lib/createMission";
import { CartItem, UserProfile } from "@/types/types";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "react-hot-toast";

// Stripe (clé publique)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  // 🔹 Charger le profil user Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setProfile(userDoc.exists() ? (userDoc.data() as UserProfile) : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const options = useMemo(
    () => ({
      appearance: { theme: "flat" as const },
    }),
    []
  );

  // Si panier vide
  if (cart.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow">
          Your cart is empty.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-[#7C5E3C] mb-6">Payment</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">
          {/* Résumé commande */}
          <section>
            <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4">
              Order Summary
            </h2>
            <ul className="divide-y divide-gray-200 max-h-56 overflow-y-auto mb-4">
              {cart.map((item, i) => (
                <li key={i} className="py-3 flex justify-between">
                  <div>
                    <div className="font-medium">{item.serviceName}</div>
                    <div className="text-sm text-gray-500">
                      {item.date} — {item.times?.join(", ")}
                    </div>
                    <div className="text-xs text-gray-400">
                      Provider: {item.providerName || "N/A"}
                    </div>
                  </div>
                  <div className="font-semibold text-[#BFA181]">
                    {item.price} NOK
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold text-[#7C5E3C]">Total</span>
              <span className="font-bold text-[#BFA181]">{totalPrice} NOK</span>
            </div>
          </section>

          {/* Paiement */}
          <section>
            {stripePromise && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  cart={cart}
                  userId={user?.uid ?? ""}
                  profile={profile}
                  clearCart={clearCart}
                />
              </Elements>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// 💳 CheckoutForm — Gère le paiement et la post-validation
// --------------------------------------------------------
function CheckoutForm({
  cart,
  userId,
  profile,
  clearCart,
}: {
  cart: CartItem[];
  userId: string;
  profile?: UserProfile | null;
  clearCart: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not loaded yet");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1️⃣ Créer le PaymentIntent
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customerId: userId }),
      });

      const { clientSecret, paymentIntentId } = await res.json();

      if (!res.ok || !clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // 2️⃣ Confirmer le paiement
      const { error: stripeErr, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: profile?.displayName || "Anonymous",
              email: profile?.email || undefined,
            },
          },
        });

      if (stripeErr) throw new Error(stripeErr.message || "Payment failed");
      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        throw new Error("Payment not succeeded");
      }

      // 3️⃣ Créer les missions (client → Firestore)
      await createMissionsFromCart(
        cart,
        userId,
        profile?.displayName ?? "",
        profile?.address ?? "",
        profile?.phone ?? "",
        profile?.email ?? "Anonymous",
        paymentIntent.id
      );

      // 4️⃣ Créer les pending_transfers (serveur → via admin SDK)
      const afterSuccessRes = await fetch("/api/stripe/after-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          paymentIntentId: paymentIntent.id,
        }),
      });

      if (!afterSuccessRes.ok) {
        const data = await afterSuccessRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create pending transfers");
      }

      console.log(profile?.email, "email");

      await fetch(`/api/email/send-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile?.email,
          cart,
          totalAmount: cart.reduce((a, i) => a + i.price, 0),
          paymentIntentId,
        }),
      });
      // 5️⃣ Nettoyer le panier et toast
      await clearCart();
      toast.success(`Payment of ${paymentIntent.amount / 100} NOK successful!`);
    } catch (err) {
      console.error("💥 Payment error:", err);
      let message = "Payment failed";
      if (err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        message = (err as { message: string }).message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#7C5E3C] mb-2">
        Payment Details
      </h2>

      <div className="rounded-md border p-3 bg-white">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full py-3 rounded-full font-bold text-lg shadow-md transition bg-[#BFA181] text-white hover:bg-[#A68A64] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing
          ? "Processing..."
          : `Pay ${cart.reduce((acc, item) => acc + item.price, 0)} NOK`}
      </button>

      <div className="text-xs text-gray-500 text-center mt-2">
        Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
      </div>
    </form>
  );
}
