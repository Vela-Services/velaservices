"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import Link from "next/link";


const Navbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
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
      <a
        href="/home"
        className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
        onClick={() => setMenuOpen(false)}
      >
        Services
      </a>
      <a
        href="#"
        className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
        onClick={() => setMenuOpen(false)}
      >
        About
      </a>
      <a
        href="#"
        className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition block md:inline"
        onClick={() => setMenuOpen(false)}
      >
        Contact
      </a>
    </>
  );

  const authButtons = user ? (
    <div className="flex flex-col md:flex-row gap-3">
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/cart");
        }}
        className="px-4 py-2 rounded-full text-[#7C5E3C] font-semibold hover:text-black hover:cursor-pointer transition"
      >
        <FaShoppingCart className="text-3xl" />
      </button>
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/profile");
        }}
        className="px-4 py-2 rounded-full text-[#7C5E3C] font-semibold hover:text-black hover:cursor-pointer transition"
      >
        <FaUser className="text-3xl" />
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
      <button
        onClick={() => {
          setMenuOpen(false);
          router.push("/signup");
        }}
        className="px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
      >
        Sign Up
      </button>
    </div>
  );

  return (
    <nav className="w-full bg-[#fcf5eb] shadow-md px-6 py-4 flex items-center justify-between relative z-30">
      <div className="flex items-center">
        <div
          onClick={() => router.push("/")}
          className="w-10 h-10 rounded-full bg-[#BFA181] flex items-center justify-center mr-2 shadow-lg cursor-pointer"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-[#7C5E3C] tracking-tight">
          Véla
        </span>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-[#fcf5eb] shadow-lg border-t border-[#e5dbc9] flex flex-col gap-6 px-6 py-6 animate-fade-in z-40">
          <div className="flex flex-col gap-4">{navLinks}</div>
          <div className="flex flex-col gap-3 mt-4">{authButtons}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
