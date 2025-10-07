"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAuth } from "../../hooks/useAuth";
import { createMissionsFromCart } from "@/lib/createMission";
import { CartItem, UserProfile } from "@/types/types";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        setProfile(docSnap.exists() ? (docSnap.data() as UserProfile) : null);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  if (!cart.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow">Your cart is empty.</div>
      </div>
    );

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#fcf5eb] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-[#7C5E3C] mb-6">Payment</h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">
          {/* Résumé */}
          <section>
            <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4">Summary</h2>
            <ul className="divide-y divide-gray-200 max-h-56 overflow-y-auto mb-4">
              {cart.map((item, i) => (
                <li key={i} className="py-3 flex justify-between">
                  <div>
                    <div className="font-medium">{item.serviceName}</div>
                    <div className="text-sm text-gray-500">
                      {item.date} — {item.times?.join(", ")}
                    </div>
                    <div className="text-xs text-gray-400">
                      Provider: {item.providerName}
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
            <Elements stripe={stripePromise} options={{ appearance: { theme: "flat" } }}>
              <CheckoutForm
                cart={cart}
                userId={user?.uid ?? ""}
                profile={profile}
                clearCart={clearCart}
              />
            </Elements>
          </section>
        </div>
      </div>
    </div>
  );
}

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

  const totalAmount = cart.reduce((a, i) => a + i.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1️⃣ Crée PaymentIntent
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customerId: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const { clientSecret, paymentIntentId, stripeAccountId } = data;

      // 2️⃣ Confirme le paiement
      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: profile?.displayName ?? "Customer",
              email: profile?.email,
            },
          },
        }
      );
      if (stripeErr) throw new Error(stripeErr.message);
      if (paymentIntent?.status !== "succeeded") throw new Error("Payment not succeeded");

      // 3️⃣ Crée missions
      await createMissionsFromCart(
        cart,
        userId,
        profile?.displayName ?? "",
        profile?.address ?? "",
        profile?.phone ?? "",
        profile?.email ?? "",
        paymentIntentId,
        stripeAccountId
      );

      // 4️⃣ Envoie reçu
      await fetch("/api/email/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile?.email,
          cart,
          totalAmount,
          paymentIntentId,
        }),
      });

      // ✅ Succès
      clearCart();
      toast.success(`Payment of ${totalAmount} NOK successful!`);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || "Payment failed");
        toast.error(err.message || "Payment failed");
      } else {
        console.error(err);
        setError("Payment failed");
        toast.error("Payment failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#7C5E3C] mb-2">Payment Details</h2>
      <div className="rounded-md border p-3 bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}
      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full py-3 rounded-full font-bold text-lg bg-[#BFA181] text-white hover:bg-[#A68A64] disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay ${totalAmount} NOK`}
      </button>
      <div className="text-xs text-gray-500 text-center mt-2">
        Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
      </div>
    </form>
  );
}
