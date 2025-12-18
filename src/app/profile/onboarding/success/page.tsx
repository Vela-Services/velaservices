"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ProfileOnboardingSuccessRedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page, preserving account_id query parameter
    const accountId = searchParams.get("account_id");
    const redirectUrl = accountId
      ? `/profile?account_id=${accountId}`
      : "/profile";
    
    router.replace(redirectUrl);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600 mt-4">Redirecting...</p>
      </div>
    </div>
  );
}

export default function ProfileOnboardingSuccessRedirect() {
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
      <ProfileOnboardingSuccessRedirectContent />
    </Suspense>
  );
}

