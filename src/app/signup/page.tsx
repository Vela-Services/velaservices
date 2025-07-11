// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [email, setEmail] = useState("");
  const [why, setWhy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", { email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7C5E3C]">
          Sign Up
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
            >
              {r === "customer" ? "Customer" : "Provider"}
            </button>
          ))}
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
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
            />
          </div>

          {role === "provider" && (
            <div>
              <label className="block text-sm font-medium text-[#7C5E3C]">
                Why do you want to work at Vela Services?
              </label>
              <input
              type="why"
              required
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#BFA181] text-white py-2 rounded-md hover:bg-[#A68A64] transition"
          >
            Create an account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7C5E3C]">
          Already have an account ?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#BFA181] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
