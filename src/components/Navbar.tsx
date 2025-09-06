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

  // // Close menu on route change
  // useEffect(() => {
  //   const handleRouteChange = () => setMenuOpen(false);
  //   // Next.js router events are not available in app dir, so we skip this for now
  //   // If you use page router, you can add: router.events.on('routeChangeStart', handleRouteChange)
  //   // For now, we close menu on click of any link/button
  //   return () => {};
  // }, []);

  const navLinks = (
    <>
      <Link
        href="/"
        className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      {profile && profile.role === "customer" && (
        <Link
          href="/customer/services"
          className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
          onClick={() => setMenuOpen(false)}
        >
          Services
        </Link>
      )}
      {profile && profile.role === "provider" && (
        <Link
          href="/provider/services"
          className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
          onClick={() => setMenuOpen(false)}
        >
          Services
        </Link>
      )}
      {profile && profile.role === "provider" && (
        <Link
          href="/provider/dashboard"
          className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
      {profile && profile.role === "customer" && (
        <Link
          href="/customer/orders"
          className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
          onClick={() => setMenuOpen(false)}
        >
          Orders
        </Link>
      )}
    </>
  );

  const authButtons = user ? (
    <div className="flex flex-col md:flex-row gap-3">
      {user && profile && profile.role === "customer" && (
        <button
          onClick={() => {
            setMenuOpen(false);
            router.push("/cart");
          }}
          className="relative px-4 py-2 rounded-full text-[#7C5E3C] font-semibold hover:text-black hover:cursor-pointer transition"
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
      )}
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/profile");
        }}
        className="relative px-4 py-2 rounded-full text-[#7C5E3C] font-semibold hover:text-black hover:cursor-pointer transition"
      >
        <span className="relative inline-block">
          <FaUser className="text-3xl" />
        </span>
      </button>
    </div>
  ) : (
    <div className="flex flex-col md:flex-row gap-3">
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/login");
        }}
        className="px-4 py-2 rounded-full border border-[#BFA181] text-[#BFA181] font-semibold hover:bg-[#F5E8D3]/80 transition"
      >
        Login
      </button>
      {/* <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/signup");
        }}
        className="px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
      >
        Sign Up
      </button> */}
    </div>
  );

  return (
    <nav className="w-full bg-[#fcf5eb] shadow-md px-6 flex items-center justify-between relative z-30">
      <div className="flex items-center">
        <div
          onClick={() => router.push("/")}
          className="w-28 h-28 flex items-center justify-center mr-4 cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          <img
            src="/VELA_WHITE_LOGO.svg"
            alt="Véla Logo"
            className="drop-shadow-lg"
            style={{
              objectFit: "contain",
              width: "6.5rem", // 104px, bigger than w-24 (96px)
              height: "6.5rem",
              maxWidth: "100%",
              maxHeight: "100%",
              display: "block",
            }}
          />
        </div>
      </div>
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-8">{navLinks}</div>
      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex gap-3">{authButtons}</div>
      {/* Mobile Burger Button */}
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
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#F5E8D3] shadow-lg border-t border-[#e5dbc9] flex flex-col gap-6 px-6 py-6 animate-fade-in z-40">
          <div className="flex flex-col gap-4">{navLinks}</div>
          <div className="flex flex-col gap-3 mt-4">{authButtons}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
