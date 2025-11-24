import { useState } from "react";
import { User, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useEmailVerification(user: User | null) {
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendVerificationEmail = async () => {
    if (!user || !user.email) return;

    setResendingEmail(true);
    setEmailResent(false);
    setError(null);

    try {
      if (typeof window !== "undefined") {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/profile`,
        });
      } else {
        await sendEmailVerification(user);
      }
      setEmailResent(true);
      // Reload user to get latest verification status
      await user.reload();
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setEmailResent(false);
      }, 5000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send verification email. Please try again.";
      setError(errorMessage);
    } finally {
      setResendingEmail(false);
    }
  };

  return {
    resendingEmail,
    emailResent,
    error,
    resendVerificationEmail,
    setError,
  };
}

