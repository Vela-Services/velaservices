import { useState, useMemo } from "react";
import { User } from "firebase/auth";
import { UserProfile } from "@/types/types";
import {
  createProfileSteps,
  calculateProfileCompletion,
  type ProfileStep,
  type StripeStatus,
} from "@/lib/profileUtils";

export function useProfileCompletion(
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
) {
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  const steps = useMemo(() => {
    return createProfileSteps(
      user,
      profile,
      stripeStatus,
      services,
      availability,
      handlers
    );
  }, [user, profile, stripeStatus, services, availability, handlers]);

  const visibleSteps = useMemo(() => {
    return steps.filter(
      (step) => !step.providerOnly || profile?.role === "provider"
    );
  }, [steps, profile?.role]);

  const completion = useMemo(() => {
    return calculateProfileCompletion(steps, profile);
  }, [steps, profile]);

  return {
    steps: visibleSteps,
    completion,
    showWalkthrough,
    setShowWalkthrough,
  };
}

