// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../../lib/firebase"; // Ensure firebase is initialized

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // Fix type error: explicitly type as string
  const [password, setPassword] = useState<string>(""); // Fix type error: explicitly type as string
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Optionally, you can store the role in localStorage or context if needed
      // localStorage.setItem("role", role);
      // Redirect to home or dashboard
      router.push("/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7C5E3C]">
          Sign In
        </h2>

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

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-center text-red-600 text-sm">{error}</div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7C5E3C]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7C5E3C]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#BFA181] text-white py-2 rounded-md hover:bg-[#A68A64] transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7C5E3C]">
          No account yet?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-[#BFA181] hover:underline"
            type="button"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
