// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../../../lib/firebase"; // Ensure firebase is initialized
import { db, auth } from "../../../lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "provider" && !why.trim()) {
      setError("Please tell us why you want to work at Vela Services.");
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

      // Save user in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        email,
        role,
        ...(role === "provider" ? { why } : {}),
        createdAt: new Date().toISOString(),
      });

      if (!role) throw new Error("User role not found");

      // 🍪 Store the role in a cookie readable by middleware
      document.cookie = `role=${role}; path=/; max-age=604800`; // 1 week

      // Force a re-login to ensure auth state is fresh and cookies/session are set
      // This helps with SSR/Next.js edge cases where the user is not recognized as logged in
      await signInWithEmailAndPassword(auth, email, password);

      // Optionally, reload the page to ensure all client state is synced
      window.location.reload();

      router.push("/profile");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7C5E3C]">
          Sign Up
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-center text-red-600 text-sm">{error}</div>
        )}

        {/* Role Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {["customer", "provider"].map((r) => (
            <button
              key={r}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                role === r
                  ? "bg-[#BFA181] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setRole(r as "customer" | "provider")}
              type="button"
            >
              {r === "customer" ? "Customer" : "Provider"}
            </button>
          ))}
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7C5E3C]">
              Name
            </label>
            <input
              type="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
              autoComplete="name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#7C5E3C]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {role === "provider" && (
            <div>
              <label className="block text-sm font-medium text-[#7C5E3C]">
                Why do you want to work at Vela Services?
              </label>
              <input
                type="text"
                required
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#7C5E3C]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7C5E3C]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#BFA181] text-white py-2 rounded-md hover:bg-[#A68A64] transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create an account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7C5E3C]">
          Already have an account ?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#BFA181] hover:underline"
            type="button"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
