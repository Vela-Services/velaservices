"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";

function OnboardingSuccessContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("account_id"); // Stripe returns `account_id`
  const { user, loading: authLoading } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const syncStripeStatus = async () => {
      // Wait for auth to be ready
      if (authLoading) {
        console.log("⏳ Waiting for auth to load...");
        return;
      }

      if (!accountId || !user?.uid) {
        console.log("⏳ Missing accountId or user:", { accountId, userId: user?.uid });
        return;
      }

      // Prevent multiple syncs
      if (syncing || synced) {
        console.log("⏭️ Sync already in progress or completed");
        return;
      }

      setSyncing(true);

      try {
        console.log("🔄 Syncing Stripe status...", { accountId, providerId: user.uid });
        const res = await fetch("/api/stripe/sync-account-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId,
            providerId: user.uid,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.error) {
          console.error("❌ Sync error response:", data);
          throw new Error(data.error);
        }

        console.log("✅ Sync successful:", data);
        setSynced(true);
        toast.success(
          `✅ Stripe connected! Status: ${data.onboardingStatus} (Charges: ${data.chargesEnabled ? "enabled" : "disabled"})`
        );

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 3000);
      } catch (err) {
        console.error("❌ Sync Stripe error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Error syncing Stripe: ${errorMessage}`);
        
        // Still redirect even on error, but after a longer delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 5000);
      } finally {
        setSyncing(false);
      }
    };

    syncStripeStatus();
  }, [accountId, user?.uid, authLoading, syncing, synced]);

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