"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../lib/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAuth } from "../../lib/useAuth";
import { createMissionsFromCart } from "../../lib/createMission";
import { CartItem, UserProfile } from "@/types/types";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

import { toast } from "react-hot-toast";


// Stripe appearance theme must be a valid literal, not a string
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

  // Fix: theme must be a literal, not a string
  const options = useMemo(
    () => ({
      appearance: { theme: "flat" as const },
    }),
    []
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow">
          Your cart is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-[#7C5E3C] mb-6">Payment</h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">
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
                  </div>
                  <div className="font-semibold text-[#BFA181]">
                    {item.price}NOK
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold text-[#7C5E3C]">Total</span>
              <span className="font-bold text-[#BFA181]">{totalPrice}NOK</span>
            </div>
          </section>

          <section>
            {/* Fix: Only render Elements if stripePromise is loaded */}
            {stripePromise && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  cart={cart}
                  userId={user?.uid ?? ""}
                  profile={profile}
                  onSuccess={async (paymentIntentId: string) => {
                    await createMissionsFromCart(
                      cart,
                      user?.uid ?? "",
                      profile?.displayName ?? "",
                      profile?.address ?? "",
                      profile?.phone ?? "",
                      profile?.email ?? "Anonymous",
                      paymentIntentId
                    );
                    await clearCart();
                  }}
                />
              </Elements>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({
  cart,
  userId,
  onSuccess,
}: {
  cart: CartItem[];
  userId: string;
  profile: UserProfile | null;
  onSuccess: (paymentIntentId: string) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    // 1) Crée le PaymentIntent sur le serveur
    const piRes = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, customerId: userId }),
    });
    const { clientSecret, paymentIntentId, error: piErr } = await piRes.json();
    if (piErr || !clientSecret) {
      setProcessing(false);
      setError(piErr || "Failed to start payment.");
      return;
    }

    // 2) Confirme le paiement côté client
    const { error: confirmErr, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

    if (confirmErr || !paymentIntent) {
      setProcessing(false);
      setError(confirmErr?.message || "Payment failed.");
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // 3) Crée les missions après succès
      await onSuccess(paymentIntentId);
      toast.success(`Payment of ${paymentIntent.amount / 100} NOK successful!`);
      setSucceeded(true);
    } else {
      setError("Payment not completed.");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={pay} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#7C5E3C] mb-2">
        Payment Details
      </h2>
      {/* Fix: Ensure CardElement is always rendered and visible */}
      <div className="rounded-md border p-3 bg-white">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#3B2F1E",
                "::placeholder": { color: "#BFA181" },
                fontFamily: "inherit",
              },
              invalid: {
                color: "#e5424d",
                iconColor: "#e5424d",
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={processing || !stripe}
        className={`w-full py-3 rounded-full font-bold text-lg shadow-md transition ${
          processing
            ? "bg-[#BFA181]/60 text-white cursor-not-allowed"
            : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
        }`}
      >
        {processing ? "Processing..." : "Pay"}
      </button>
      {succeeded && (
        <div className="text-green-600 text-sm mt-2">Payment successful!</div>
      )}
    </form>
  );
}
