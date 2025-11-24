import React, { Suspense } from "react";
import { UserProfile } from "@/types/types";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { ProfileStep } from "@/lib/profileUtils";

const ProviderStripeSetup = React.lazy(() =>
  import("../../../(provider)/ProviderStripeSetup/page").then((mod) => ({
    default: mod.default,
  }))
);

interface ProfileWalkthroughProps {
  steps: ProfileStep[];
  completion: number;
  showWalkthrough: boolean;
  resendingEmail: boolean;
  emailResent: boolean;
  profile: UserProfile | null;
  onClose: () => void;
}

export function ProfileWalkthrough({
  steps,
  completion,
  showWalkthrough,
  resendingEmail,
  emailResent,
  profile,
  onClose,
}: ProfileWalkthroughProps) {
  if (completion === 100) return null;

  return (
    <div className="mb-6 bg-white/90 rounded-2xl shadow-lg border border-white/30 p-5 relative">
      <div className="flex items-center mb-3">
        <IoAlertCircleOutline className="text-yellow-500 mr-2" size={22} />
        <h3 className="text-lg font-bold text-gray-800">Complete your profile</h3>
      </div>
      <p className="text-gray-600 mb-4 text-sm">
        To unlock all features and get the most out of the platform, please complete
        your profile. Follow the steps below:
      </p>
      <ol className="space-y-3">
        {steps.map((step) => (
          <li
            key={step.key}
            className={`flex items-start space-x-3 ${
              step.highlight ? "bg-yellow-50 border-l-4 border-yellow-300" : ""
            } rounded-xl px-2 py-2`}
          >
            <div className="pt-1">
              {step.completed ? (
                <IoCheckmarkCircleOutline
                  className="text-green-500"
                  size={20}
                />
              ) : (
                <IoCloseCircleOutline className="text-gray-300" size={20} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span
                  className={`font-medium ${
                    step.completed
                      ? "text-green-700"
                      : step.highlight
                      ? "text-yellow-800"
                      : "text-gray-700"
                  }`}
                >
                  {step.label}
                </span>
                {step.highlight && !step.completed && step.action && (
                  <button
                    onClick={step.action}
                    disabled={step.key === "email" && resendingEmail}
                    className="ml-2 text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-900 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step.key === "email"
                      ? resendingEmail
                        ? "Sending..."
                        : emailResent
                        ? "Sent!"
                        : "Resend Email"
                      : "Complete"}
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-500">{step.description}</span>
              {/* Stripe step: show inline Stripe onboarding if not complete */}
              {step.stripeStep &&
                profile?.role === "provider" &&
                !step.completed && (
                  <div className="mt-2">
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center py-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                          <span className="text-gray-600 text-xs">
                            Loading Stripe...
                          </span>
                        </div>
                      }
                    >
                      <ProviderStripeSetup />
                    </Suspense>
                  </div>
                )}
            </div>
          </li>
        ))}
      </ol>
      {completion === 100 ? (
        <div className="mt-4 flex items-center text-green-700 font-semibold">
          <IoCheckmarkCircleOutline className="mr-2" size={20} />
          Your profile is 100% complete! You&apos;re ready to go.
        </div>
      ) : (
        <div className="mt-4 flex items-center text-yellow-700 font-semibold">
          <IoAlertCircleOutline className="mr-2" size={20} />
          {100 - completion}% left to complete your profile.
        </div>
      )}
      {showWalkthrough && (
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
}

