"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User, UserProfile } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useCart } from "@/lib/CartContext";

import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { cart } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setProfile(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Navigation links for both desktop and mobile
  const navLinks = (
    <>
      <Link
        href="/"
        className="flex-1 text-center text-black hover:text-[#BFA181] font-medium transition px-3 py-2 rounded"
        onClick={() => setMenuOpen(false)}
        style={{ minWidth: 0 }}
      >
        Home
      </Link>
      <Link
        href="/becomeProvider"
        className="flex-1 text-center text-black hover:text-[#BFA181] font-medium transition px-3 py-2 rounded"
        onClick={() => setMenuOpen(false)}
        style={{ minWidth: 0 }}
      >
        Become a Provider
      </Link>
      {profile && profile.role === "customer" && (
        <Link
          href="/customerServices"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-medium transition px-3 py-2 rounded"
          onClick={() => setMenuOpen(false)}
          style={{ minWidth: 0 }}
        >
          Services
        </Link>
      )}
      {profile && profile.role === "provider" && (
        <Link
          href="/providerServices"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-medium transition px-3 py-2 rounded"
          onClick={() => setMenuOpen(false)}
          style={{ minWidth: 0 }}
        >
          Services
        </Link>
      )}
      {profile && profile.role === "provider" && (
        <Link
          href="/dashboard"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-medium transition px-3 py-2 rounded"
          onClick={() => setMenuOpen(false)}
          style={{ minWidth: 0 }}
        >
          Dashboard
        </Link>
      )}
      {profile && profile.role === "customer" && (
        <Link
          href="/orders"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-medium transition px-3 py-2 rounded"
          onClick={() => setMenuOpen(false)}
          style={{ minWidth: 0 }}
        >
          Orders
        </Link>
      )}
    </>
  );

  // Only show cart button for customers
  const cartButton =
    user && profile && profile.role === "customer" ? (
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/cart");
        }}
        className="relative px-4 py-2 rounded-full text-black font-semibold hover:text-black hover:cursor-pointer transition"
        style={{ overflow: "visible" }}
        aria-label="Cart"
      >
        <span className="relative inline-block">
          <FaShoppingCart className="text-3xl" />
          {cart.length > 0 && (
            <span
              className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md border-2 border-white"
              style={{
                minWidth: "1.25rem",
                minHeight: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {cart.length}
            </span>
          )}
        </span>
      </button>
    ) : null;

  // Profile button (always shown if logged in)
  const profileButton = user ? (
    <button
      onClick={() => {
        setMenuOpen(false);
        router.push("/profile");
      }}
      className="relative px-4 py-2 rounded-full text-black font-semibold hover:text-black hover:cursor-pointer transition"
      aria-label="Profile"
    >
      <span className="relative inline-block">
        <FaUser className="text-3xl" />
      </span>
    </button>
  ) : null;

  // Login button (if not logged in)
  const loginButton = !user ? (
    <button
      onClick={() => {
        setMenuOpen(false);
        router.push("/login");
      }}
      className="px-4 py-2 rounded-full border border-[#BFA181] text-[#BFA181] font-semibold hover:bg-[#F5E8D3]/80 transition"
    >
      Login
    </button>
  ) : null;

  // Mobile menu content
  const mobileMenu = (
    <div className="md:hidden absolute top-full left-0 w-full bg-[#F5E8D3] shadow-lg border-t border-[#e5dbc9] flex flex-col gap-6 px-6 py-6 animate-fade-in z-40">
      <div className="flex flex-col gap-4">{navLinks}</div>
      <div className="flex flex-col gap-3 mt-4">
        {cartButton}
        {profileButton}
        {loginButton}
      </div>
    </div>
  );

  return (
    <nav className="w-full relative z-30">
      {/* First line: Logo left, profile/cart/login right */}
      <div className="flex items-center justify-between bg-[#5EB6A6] px-6 py-2">
        {/* Logo (left) */}
        <div
          onClick={() => router.push("/")}
          className="w-40 h-40 flex items-center justify-start cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          <img
            src="/VELA_BLACK_LOGO.svg"
            alt="Véla Logo"
            className="drop-shadow-lg"
            style={{
              objectFit: "contain",
              width: "10.5rem",
              height: "10.5rem",
              maxWidth: "100%",
              maxHeight: "100%",
              display: "block",
            }}
          />
        </div>
        {/* Desktop right-side buttons */}
        <div className="hidden md:flex items-center gap-3">
          {cartButton}
          {profileButton}
          {loginButton}
        </div>
        {/* Mobile burger button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            className="w-7 h-7 text-[#7C5E3C]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              // X icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Burger icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Second line: Navigation links with different background */}
      <div className="hidden md:flex w-full bg-[#F5E8D3] px-6 py-2 border-b border-[#e5dbc9]">
        <div className="flex w-full justify-between items-center gap-2">
          {navLinks}
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && mobileMenu}
    </nav>
  );
};

export default Navbar;
