"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message ||
            "Failed to send password reset email. Please check your email address."
        );
      } else {
        setError("Failed to send password reset email. Please check your email address.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#7C5E3C] mb-4 text-center">
          Reset Your Password
        </h2>
        <p className="mb-6 text-[#3B2F1E] text-center">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        {sent ? (
          <div className="text-green-600 text-center font-semibold">
            Password reset email sent! Please check your inbox.
            <button
              className="block mt-6 mx-auto px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#7C5E3C] mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#BFA181] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFA181] bg-[#F9F5EF]"
                placeholder="your@email.com"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <a
            href="/profile"
            className="text-[#BFA181] hover:underline text-sm"
          >
            &larr; Back to Profile
          </a>
        </div>
      </div>
    </div>
  );
}
