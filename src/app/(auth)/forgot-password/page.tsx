"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "@/lib/firebase"; // Initialize Firebase
import { FiMail } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const COLORS = {
  background: "#F8F6F2",
  card: "#FFFDF8",
  accent: "#BFA181",
  accentDark: "#A68A64",
  accentLight: "#E8D8C3",
  text: "#3E2C18",
  textSecondary: "#7C5E3C",
  border: "#E5D3B3",
  error: "#E57373",
  inputBg: "#F5E8D3",
  inputBorder: "#BFA181",
  shadow: "0 4px 24px 0 rgba(191,161,129,0.10)",
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err) {
      // Use a type guard to avoid 'any'
      function isFirebaseError(obj: unknown): obj is { code?: string; message?: string } {
        return (
          typeof obj === "object" &&
          obj !== null &&
          ("code" in obj || "message" in obj)
        );
      }

      if (
        isFirebaseError(err) &&
        (err.code === "auth/user-not-found" || err.code === "auth/invalid-email")
      ) {
        setSuccess(
          "If an account with that email exists, a password reset link has been sent."
        );
      } else {
        let message = "Failed to send reset email. Please try again later.";
        if (isFirebaseError(err) && typeof err.message === "string") {
          message = err.message;
        }
        setError(message);
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, #F5E8D3 60%, #FFFDF8 100%)",
      }}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        style={{
          background: COLORS.card,
          boxShadow: COLORS.shadow,
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.text }}>
          Forgot Password
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: COLORS.textSecondary }}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: COLORS.textSecondary }}
            >
              Email address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#BFA181]">
                <FiMail />
              </span>
              <input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#BFA181] bg-[#F5E8D3] text-[#3E2C18] focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white py-3 rounded-xl font-semibold text-base shadow-md hover:from-[#A68A64] hover:to-[#BFA181] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#BFA181] disabled:opacity-60"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            className="text-xs text-[#BFA181] hover:underline focus:underline focus:outline-none transition"
            onClick={() => router.push("/login")}
            tabIndex={0}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
