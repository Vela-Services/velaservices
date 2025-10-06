"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";

function OnboardingSuccessContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("account_id"); // Stripe returns `account_id`
  const { user } = useAuth();

  useEffect(() => {
    const syncStripeStatus = async () => {
      if (!accountId || !user?.uid) return;

      try {
        const res = await fetch("/api/stripe/sync-account-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId,
            providerId: user.uid,
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        toast.success("✅ Stripe connected successfully!");
      } catch (err) {
        console.error("❌ Sync Stripe error:", err);
        toast.error("Error while syncing Stripe");
      } finally {
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    };

    syncStripeStatus();
  }, [accountId, user?.uid]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Setup complete!
        </h1>
        <p className="text-gray-600">
          Your Stripe account has been successfully configured. You will be redirected...
        </p>
      </div>
    </div>
  );
}

export default function OnboardingSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingSuccessContent />
    </Suspense>
  );
}