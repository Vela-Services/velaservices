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
import { FaLock, FaShieldAlt, FaCcStripe } from "react-icons/fa";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb]">
        <div className="bg-white rounded-xl p-8 shadow text-[#7C5E3C] font-medium">Your cart is empty.</div>
      </div>
    );

    const totalWithFee = cart.reduce((acc, item) => acc + item.price, 0);
    const subtotal = Math.round((totalWithFee / 1.1) * 100) / 100; // rounded to 2 decimals
    const platformFee = Math.round((totalWithFee - subtotal) * 100) / 100; // rounded to 2 decimals

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FaLock className="text-[#BFA181] text-2xl" />
            <span className="text-[#7C5E3C] text-lg font-semibold">Secure Payment</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#7C5E3C] mb-1 tracking-tight">Payment</h1>
          <p className="text-[#7C5E3C]/70 text-base text-center max-w-lg">
            Enter your payment details below. Your information is encrypted and processed securely.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 grid md:grid-cols-2 gap-10 border border-[#F5E8D3]">
          {/* Summary */}
          <section>
            <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
              <FaCcStripe className="text-[#BFA181]" /> Order Summary
            </h2>
            <ul className="divide-y divide-gray-200 max-h-56 overflow-y-auto mb-4">
              {cart.map((item, i) => (
                <li key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-[#7C5E3C]">{item.serviceName}</div>
                    <div className="text-sm text-gray-500">
                      {item.date} — {item.times?.join(", ")}
                    </div>
                    <div className="text-xs text-gray-400">
                      Provider: {item.providerName}
                    </div>
                  </div>
                  <div className="font-semibold text-[#BFA181] text-lg">
                    {item.price} NOK
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1 border-t pt-3">
              <div className="flex justify-between">
                <span className="text-[#7C5E3C]">Subtotal</span>
                <span className="text-[#BFA181]">{subtotal} NOK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C5E3C]">Platform Fee (10%)</span>
                <span className="text-[#BFA181]">{platformFee} NOK</span>
              </div>
              <div className="flex justify-between font-semibold mt-1 border-t pt-2">
                <span className="font-semibold text-[#7C5E3C]">Total</span>
                <span className="font-bold text-[#BFA181] text-xl">{totalWithFee} NOK</span>
              </div>
              <div className="text-xs text-[#BFA181] mt-2 flex items-center gap-1">
                <FaShieldAlt className="inline text-[#BFA181]" />
                The platform fee helps us maintain and improve our service.
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-[#7C5E3C]/70 bg-[#F5E8D3] rounded-lg p-3">
              <FaLock className="text-[#BFA181]" />
              <span>
                All payments are processed securely via Stripe. Your card details are never stored on our servers.
              </span>
            </div>
          </section>

          {/* Payment */}
          <section>
            <Elements
              stripe={stripePromise}
              options={{
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#7C5E3C",
                    colorBackground: "#fff",
                    colorText: "#7C5E3C",
                    colorDanger: "#e3342f",
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                    borderRadius: "8px",
                  },
                  rules: {
                    ".Input": {
                      border: "1.5px solid #BFA181",
                      boxShadow: "none",
                      padding: "12px",
                      fontSize: "16px",
                    },
                    ".Tab, .Label": {
                      color: "#7C5E3C",
                    },
                  },
                },
              }}
            >
              <CheckoutForm
                cart={cart}
                userId={user?.uid ?? ""}
                profile={profile}
                clearCart={clearCart}
                subtotal={subtotal}
                platformFee={platformFee}
                totalAmount={totalWithFee}
              />
            </Elements>
          </section>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 text-xs text-[#7C5E3C]/70">
          <div className="flex items-center gap-1">
            <FaLock className="text-[#BFA181]" />
            <span>
              Your payment is protected with 256-bit SSL encryption.
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaShieldAlt className="text-[#BFA181]" />
            <span>
              We never store your card details. Payments are handled by Stripe, a PCI DSS Level 1 certified provider.
            </span>
          </div>
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
  subtotal,
  platformFee,
  totalAmount,
}: {
  cart: CartItem[];
  userId: string;
  profile?: UserProfile | null;
  clearCart: () => void;
  subtotal: number;
  platformFee: number;
  totalAmount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          subtotal,
          platformFee,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-[#fcf5eb]/40 rounded-2xl p-6 shadow border border-[#F5E8D3]"
      aria-label="Secure payment form"
    >
      <h2 className="text-xl font-semibold text-[#7C5E3C] mb-2 flex items-center gap-2">
        <FaLock className="text-[#BFA181]" />
        Payment Details
      </h2>
      <div className="rounded-lg border-2 border-[#BFA181] p-4 bg-white flex flex-col gap-2 shadow-sm">
        <label className="text-sm text-[#7C5E3C] font-medium mb-1" htmlFor="card-element">
          Card Information
        </label>
        <div id="card-element" className="rounded-md">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#7C5E3C",
                  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                  "::placeholder": { color: "#BFA181" },
                  backgroundColor: "#fff",
                  padding: "12px 0",
                },
                invalid: {
                  color: "#e3342f",
                },
              },
            }}
          />
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-[#7C5E3C]/70">
          <FaShieldAlt className="text-[#BFA181]" />
          <span>Payments are encrypted and processed securely by Stripe.</span>
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded flex items-center gap-2 border border-red-200">
          <FaLock className="text-red-400" />
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full py-3 rounded-full font-bold text-lg bg-[#BFA181] text-white hover:bg-[#A68A64] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition"
        aria-label={`Pay ${totalAmount} NOK securely`}
      >
        {processing ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <FaLock className="text-white" />
            {`Pay ${totalAmount} NOK`}
          </>
        )}
      </button>
      <div className="text-xs text-[#7C5E3C]/60 text-center mt-2">
        By clicking `&quot;`Pay`&quot;`, you agree to our <a href="/terms" className="underline hover:text-[#BFA181]">Terms of Service</a> and <a href="/privacy" className="underline hover:text-[#BFA181]">Privacy Policy</a>.
      </div>
    </form>
  );
}
