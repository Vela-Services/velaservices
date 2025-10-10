// app/login/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import "../../../lib/firebase";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiMail, FiLock } from "react-icons/fi";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPilotPopup, setShowPilotPopup] = useState<boolean>(false);
  const [pendingRedirect, setPendingRedirect] = useState<null | string>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
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
  // Show popup and wait for user to acknowledge before redirecting
  const handleLoginSuccess = (role: string) => {
    setShowPilotPopup(true);
    if (role === "customer") {
      setPendingRedirect("/customerServices");
    } else {
      setPendingRedirect("/providerServices");
    }
  };

  const handlePilotPopupClose = () => {
    setShowPilotPopup(false);
    if (pendingRedirect) {
      router.push(pendingRedirect);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const realRole = userData?.role;

      if (!realRole) throw new Error("User role not found");

      document.cookie = `role=${realRole}; path=/; max-age=604800`;

      handleLoginSuccess(realRole);
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

  if (authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{
        background: "radial-gradient(ellipse at 60% 40%, #F5E8D3 60%, #FFFDF8 100%)"
      }}>
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-[#BFA181] text-3xl mb-1" />
          <span className="text-[#BFA181] text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 60% 40%, #F5E8D3 60%, #FFFDF8 100%)",
      }}
    >
      {/* Pilot Popup */}
      {showPilotPopup && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/30 transition-all">
          <div
            className="bg-[#FFFDF8] border border-[#BFA181] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-3 relative animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pilot-popup-title"
            style={{
              boxShadow: COLORS.shadow,
            }}
          >
            <span
              className="absolute top-3 right-3 text-[#BFA181] cursor-pointer text-2xl"
              title="Close"
              tabIndex={0}
              onClick={handlePilotPopupClose}
            >
              &times;
            </span>
            <h3
              id="pilot-popup-title"
              className="text-2xl font-bold text-center mb-4 text-[#7C5E3C]"
            >
              VÉLA Pilot Phase 🚧
            </h3>
            <p className="text-center text-[#3E2C18] mb-4">
              Welcome to the pilot phase of VÉLA!<br />
              Please note: you might encounter bugs or incomplete features. Your feedback is invaluable in helping us improve the platform.
            </p>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-[#BFA181] text-sm mb-2">
                To report an issue or suggestion, please email:&nbsp;
                <a
                  href="mailto:info.velaservices@gmail.com"
                  className="underline hover:text-[#A68A64]"
                >
                  info.velaservices@gmail.com
                </a>
              </span>
              <button
                className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-semibold hover:from-[#A68A64] hover:to-[#BFA181] transition focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                onClick={handlePilotPopupClose}
                autoFocus
              >
                Continue to VÉLA
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl px-8 py-10 relative"
        style={{
          boxShadow: COLORS.shadow,
          border: `1.5px solid ${COLORS.border}`,
        }}
      >
        {/* Decorative Accent */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#BFA181]/20 rounded-full blur-2xl pointer-events-none" />
        <h2
          className="text-3xl font-extrabold mb-8 text-center"
          style={{ color: COLORS.textSecondary, letterSpacing: "-0.5px" }}
        >
          Welcome Back
        </h2>
        <p className="text-center text-[#7C5E3C] mb-8 text-sm">
          Sign in to your account to continue
        </p>

        {/* Error Message */}
        {error && (
          <div
            className="mb-5 text-center px-4 py-2 rounded-xl text-sm"
            style={{
              background: "#FFF0F0",
              color: COLORS.error,
              border: `1px solid ${COLORS.error}33`,
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold mb-1"
              style={{ color: COLORS.textSecondary }}
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BFA181]">
                <FiMail size={18} />
              </span>
              <input
                id="email"
                ref={emailInputRef}
                type="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="pl-10 pr-3 py-3 w-full rounded-xl border border-[#E5D3B3] bg-[#F8F6F2] text-[#3E2C18] placeholder-[#BFA181] text-sm focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                placeholder="you@email.com"
                autoComplete="email"
                disabled={loading}
                aria-label="Email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold mb-1"
              style={{ color: COLORS.textSecondary }}
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BFA181]">
                <FiLock size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="pl-10 pr-10 py-3 w-full rounded-xl border border-[#E5D3B3] bg-[#F8F6F2] text-[#3E2C18] placeholder-[#BFA181] text-sm focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                placeholder="Your password"
                autoComplete="current-password"
                disabled={loading}
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#BFA181] hover:text-[#A68A64] focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M2 2l16 16M10 4c-4.418 0-8 4-8 6s3.582 6 8 6 8-4 8-6c0-1.09-.57-2.36-1.54-3.54M10 14a4 4 0 100-8 4 4 0 000 8z"
                      stroke="#BFA181"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
                      stroke="#BFA181"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="3"
                      stroke="#BFA181"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white py-3 rounded-xl font-semibold text-base shadow-md hover:from-[#A68A64] hover:to-[#BFA181] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#BFA181] disabled:opacity-60"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-[#7C5E3C]">
            No account yet?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-[#BFA181] font-semibold hover:underline focus:underline focus:outline-none transition"
              type="button"
              tabIndex={0}
            >
              Create an account
            </button>
          </p>
          <button
            type="button"
            className="text-xs text-[#BFA181] hover:underline focus:underline focus:outline-none transition"
            onClick={() => router.push("/forgot-password")}
            tabIndex={0}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
