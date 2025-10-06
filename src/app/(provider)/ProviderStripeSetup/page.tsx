"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function ProviderStripeSetupPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    accountId?: string;
    onboardingStatus?: "pending" | "active";
    chargesEnabled?: boolean;
  }>({});

  const loadStripeStatus = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const providerDoc = await getDoc(doc(db, "users", user.uid));
      if (providerDoc.exists()) {
        const data = providerDoc.data();
        setStripeStatus({
          accountId: data.stripeAccountId,
          onboardingStatus: data.stripeOnboardingStatus,
          chargesEnabled: data.stripeChargesEnabled,
        });
      }
    } catch (error) {
      console.error("Error loading Stripe status:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadStripeStatus();
  }, [loadStripeStatus]);

  const startOnboarding = async () => {
    if (!user?.email) {
      toast.error("User email required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-provider-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          providerId: user.uid,
          country: "NO", // or "NO" as needed
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Redirect to Stripe onboarding
      window.location.href = data.onboardingUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const refreshOnboarding = async () => {
    if (!stripeStatus.accountId) return;

    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const response = await fetch("/api/stripe/refresh-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: stripeStatus.accountId,
          refreshUrl: `${baseUrl}/onboarding/refresh`,
          returnUrl: `${baseUrl}/onboarding/success`,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      window.location.href = data.onboardingUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!stripeStatus.accountId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-400">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Payment setup required
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              To receive your payments, you need to set up your Stripe Connect account. This process is secure and only takes a few minutes.
            </p>
            <div className="mt-4">
              <button
                onClick={startOnboarding}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Setting up..." : "Set up payments"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    stripeStatus.onboardingStatus === "pending"
  ) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-400">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-orange-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Setup in progress
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your Stripe account setup is in progress. You will be able to receive payments once all information is validated.
            </p>
            <div className="mt-4">
              <button
                onClick={refreshOnboarding}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Redirecting..." : "Complete setup"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-400">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">
            Payments set up
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Your Stripe account is set up and you can receive payments. Transfers will be made automatically after job validation.
          </p>
        </div>
      </div>
    </div>
  );
}
