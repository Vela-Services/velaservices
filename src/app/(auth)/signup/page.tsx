// app/signup/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../../../lib/firebase";
import { db, auth } from "../../../lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  // Only allow "customer" role for now
  const role = "customer" as const;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false); // New state for T&C
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // For accessibility: focus error message
  const errorRef = useRef<HTMLDivElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // Already logged in, redirect to home or profile
        router.replace("/profile");
      } else {
        setAuthChecked(true);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // Password strength check (simple)
  const passwordStrength = (() => {
    if (!password) return "";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Add at least one number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Add at least one special character.";
    return "";
  })();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // New: Must agree to terms and conditions
    if (!agreeTerms) {
      setError("You must agree to the Terms and Conditions to sign up.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordStrength) {
      setError(passwordStrength);
      return;
    }
    try {
      setLoading(true);

      // Create the account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with displayName
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);
      console.log("Email verification sent"); 
      console.log(userCredential.user);
      

      // Save user in Firestore, include emailVerified field
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        email,
        role,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      // 🍪 Store the role in a cookie readable by middleware
      document.cookie = `role=${role}; path=/; max-age=604800`;

      setVerificationSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render signup page/form until we have checked auth state
  if (!authChecked) {
    // Could optionally show a spinner instead
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E8D3] to-[#E8D9C1] px-4">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-3xl shadow-2xl border border-[#E5D3B3]">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[#7C5E3C] tracking-tight">
          Create your Vela account
        </h2>

        {/* Error Message */}
        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            className="mb-4 text-center text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium shadow-sm animate-shake"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Success Message for Verification */}
        {verificationSent && (
          <div className="mb-4 text-center text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm font-medium shadow-sm">
            <span>
              A verification email has been sent to <b>{email}</b>.<br />
              Please check your inbox and verify your email before logging in.
            </span>
          </div>
        )}

        {/* Role Selector (disabled for provider) */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className="px-5 py-2 rounded-full text-base font-semibold transition bg-[#BFA181] text-white shadow-md cursor-default"
            type="button"
            disabled
            aria-pressed="true"
          >
            Customer
          </button>
          <button
            className="px-5 py-2 rounded-full text-base font-semibold transition bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            type="button"
            disabled
            aria-disabled="true"
            title="Provider sign up is handled manually. Please contact us."
          >
            Provider
          </button>
        </div>
        <div className="mb-6 text-center text-xs text-gray-500">
          Want to become a provider?{" "}
          <a
            href="mailto:hello@velaservices.com"
            className="text-[#BFA181] hover:underline font-medium"
          >
            Contact us
          </a>
        </div>

        {/* Signup Form */}
        {!verificationSent && (
          <form
            onSubmit={handleSignup}
            className="space-y-5"
            autoComplete="off"
            aria-label="Sign up form"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#7C5E3C] mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#E5D3B3] rounded-lg px-4 py-2 text-base text-[#7C5E3C] bg-[#F9F6F1] focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:bg-white transition"
                autoComplete="name"
                disabled={loading}
                placeholder="Your full name"
                maxLength={50}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#7C5E3C] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E5D3B3] rounded-lg px-4 py-2 text-base text-[#7C5E3C] bg-[#F9F6F1] focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:bg-white transition"
                autoComplete="email"
                disabled={loading}
                placeholder="you@email.com"
                maxLength={100}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#7C5E3C] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E5D3B3] rounded-lg px-4 py-2 text-base text-[#7C5E3C] bg-[#F9F6F1] focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:bg-white transition pr-12"
                  autoComplete="new-password"
                  disabled={loading}
                  placeholder="Create a password"
                  minLength={8}
                  maxLength={64}
                  aria-describedby="passwordHelp"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BFA181] hover:text-[#7C5E3C] focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18M1 12s4-7 11-7 11 7 11 7-4 7-11 7c-2.5 0-4.7-.6-6.6-1.6M9.5 9.5a3 3 0 104.2 4.2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
              <div
                id="passwordHelp"
                className={`mt-1 text-xs ${
                  passwordStrength ? "text-red-500" : "text-gray-400"
                }`}
                aria-live="polite"
              >
                {passwordStrength
                  ? passwordStrength
                  : "At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character."}
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-[#7C5E3C] mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#E5D3B3] rounded-lg px-4 py-2 text-base text-[#7C5E3C] bg-[#F9F6F1] focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:bg-white transition pr-12"
                  autoComplete="new-password"
                  disabled={loading}
                  placeholder="Re-enter your password"
                  minLength={8}
                  maxLength={64}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BFA181] hover:text-[#7C5E3C] focus:outline-none"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showConfirm ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18M1 12s4-7 11-7 11 7 11 7-4 7-11 7c-2.5 0-4.7-.6-6.6-1.6M9.5 9.5a3 3 0 104.2 4.2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="mt-1 text-xs text-red-500" aria-live="polite">
                  Passwords do not match.
                </div>
              )}
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 mt-2">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading}
                required
                className="mt-1 accent-[#BFA181] focus:ring-[#BFA181]"
              />
              <label htmlFor="agreeTerms" className="text-xs text-[#7C5E3C] select-none">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#BFA181]">
                  Terms and Conditions
                </a>
                .
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:from-[#A68A64] hover:to-[#BFA181] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#BFA181] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#7C5E3C]">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#BFA181] hover:underline font-semibold"
            type="button"
            disabled={loading}
          >
            Log in
          </button>
        </p>
      </div>
      <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
