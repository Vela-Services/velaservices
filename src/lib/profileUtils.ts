import { User } from "firebase/auth";
import { UserProfile } from "@/types/types";

export type ProfileStep = {
  key: string;
  label: string;
  description: string;
  completed: boolean;
  action?: () => void;
  highlight?: boolean;
  providerOnly?: boolean;
  stripeStep?: boolean;
};

export type StripeStatus = {
  accountId?: string;
  onboardingStatus?: "pending" | "active" | "incomplete";
  chargesEnabled?: boolean;
};

/**
 * Creates profile completion steps based on user and profile data
 */
export function createProfileSteps(
  user: User | null,
  profile: UserProfile | null,
  stripeStatus: StripeStatus,
  services: string[],
  availability: boolean,
  handlers: {
    onEdit: () => void;
    onEditBio: () => void;
    onResendEmail: () => void;
    onPhotoClick: () => void;
  }
): ProfileStep[] {
  return [
    {
      key: "displayName",
      label: "Add your name",
      description: "Share your name with others.",
      completed: !!profile?.displayName,
      action: handlers.onEdit,
      highlight: !profile?.displayName,
    },
    {
      key: "email",
      label: "Verify your email",
      description: user?.emailVerified
        ? "Your email is verified."
        : "Verify your email to secure your account.",
      completed: !!user?.email && user?.emailVerified,
      action: handlers.onResendEmail,
      highlight: !!user?.email && !user?.emailVerified,
    },
    {
      key: "phone",
      label: "Add your phone number",
      description: "Make it easy for others to contact you.",
      completed: !!profile?.phone,
      action: handlers.onEdit,
      highlight: !profile?.phone,
    },
    {
      key: "address",
      label: "Add your address",
      description: "Share your location.",
      completed: !!profile?.address,
      action: handlers.onEdit,
      highlight: !profile?.address,
    },
    {
      key: "bio",
      label: "Write a short bio",
      description: "Share your story.",
      completed: !!profile?.why,
      action: handlers.onEditBio,
      highlight: !profile?.why,
    },
    {
      key: "photo",
      label: "Add a profile picture",
      description: "A friendly face builds trust.",
      completed: !!user?.photoURL || !!profile?.photoURL,
      action: handlers.onPhotoClick,
      highlight: !(user?.photoURL || profile?.photoURL),
    },
    // Provider-specific steps
    {
      key: "stripe",
      label: "Set up payments (Stripe)",
      description: "Enable payments and payouts.",
      completed:
        profile?.role === "provider"
          ? !!stripeStatus.accountId &&
            stripeStatus.onboardingStatus === "active"
          : true,
      action: undefined, // handled in Stripe card
      providerOnly: true,
      stripeStep: true,
      highlight:
        profile?.role === "provider" &&
        (!stripeStatus.accountId ||
          stripeStatus.onboardingStatus !== "active" ||
          !stripeStatus.chargesEnabled),
    },
    {
      key: "services",
      label: "Add your services",
      description: "Show what services you offer.",
      completed:
        profile?.role === "provider" ? services && services.length > 0 : true,
      action: () => alert("Service management coming soon!"),
      providerOnly: true,
      highlight:
        profile?.role === "provider" && (!services || services.length === 0),
    },
    {
      key: "availability",
      label: "Set your availability",
      description: "Show when you're available.",
      completed: profile?.role === "provider" ? !!availability : true,
      action: () => alert("Availability management coming soon!"),
      providerOnly: true,
      highlight: profile?.role === "provider" && !availability,
    },
  ];
}

/**
 * Calculates profile completion percentage
 */
export function calculateProfileCompletion(
  steps: ProfileStep[],
  profile: UserProfile | null
): number {
  const visibleSteps = steps.filter(
    (step) => !step.providerOnly || profile?.role === "provider"
  );
  const completedSteps = visibleSteps.filter((step) => step.completed).length;
  return Math.round((completedSteps / visibleSteps.length) * 100);
}

