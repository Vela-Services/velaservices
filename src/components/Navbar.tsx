"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

import { FaShoppingCart } from "react-icons/fa";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

import "flag-icons/css/flag-icons.min.css";

// Flag icons (SVGs inline for simplicity)
const EN_FLAG = (
  <span className="inline-block w-6 h-6 align-middle">
    <span className="fi fi-gb"></span>
  </span>
);
const NO_FLAG = (
  <span className="inline-block w-6 h-6 align-middle">
    <span className="fi fi-no"></span>{" "}
  </span>
);

const languages = [
  { code: "en", label: EN_FLAG, name: "English" },
  { code: "no", label: NO_FLAG, name: "Norsk" },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, profile, isCustomer, isProvider, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const [language, setLanguage] = useState("en");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const langBtnRef = useRef<HTMLButtonElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { cart } = useCart();

  // Click outside to close language menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        langMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node) &&
        langBtnRef.current &&
        !langBtnRef.current.contains(e.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    }
    if (langMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langMenuOpen]);


  // Navigation links for both desktop and mobile, now BIGGER
  const navLinks = (
    <>
      <Link
        href="/home"
        className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
        style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>

      {isCustomer && (
        <Link
          href="/customerServices"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
          style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
          onClick={() => setMenuOpen(false)}
        >
          Services
        </Link>
      )}
      {isProvider && (
        <Link
          href="/providerServices"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
          style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
          onClick={() => setMenuOpen(false)}
        >
          Services
        </Link>
      )}
      {isProvider && (
        <Link
          href="/dashboard"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
          style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
      {isCustomer && (
        <Link
          href="/orders"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
          style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
          onClick={() => setMenuOpen(false)}
        >
          Orders
        </Link>
      )}
      <Link
        href="/becomeProvider"
        className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
        style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
        onClick={() => setMenuOpen(false)}
      >
        Become a Provider
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="flex-1 text-center text-black hover:text-[#BFA181] font-semibold transition px-5 py-4 rounded text-lg md:text-2xl"
          style={{ minWidth: 0, fontFamily: "var(--font-Cormorant_Garamond)" }}
          onClick={() => setMenuOpen(false)}
        >
          Admin
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
        className="relative px-4 py-2 rounded-full text-white font-semibold hover:text-black hover:cursor-pointer transition"
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

  // Language switcher, always shown in the navbar
  const langButton = (
    <div className="relative">
      <button
        ref={langBtnRef}
        onClick={() => setLangMenuOpen((t) => !t)}
        className="px-2 py-2 rounded-full hover:bg-[#BFA181]/10 transition flex items-center gap-1"
        aria-label="Change language"
      >
        {language === "en" ? EN_FLAG : NO_FLAG}
        <span className="sr-only">
          {language === "en" ? "Switch to Norwegian" : "Switch to English"}
        </span>
        <svg
          className={`ml-1 w-3 h-3 transition-transform ${
            langMenuOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.586l3.71-3.355a.75.75 0 1 1 1.04 1.085l-4.24 3.84a.75.75 0 0 1-1.04 0l-4.24-3.84a.75.75 0 0 1 .02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {langMenuOpen && (
        <div
          ref={langMenuRef}
          className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50 border flex flex-col animate-fade-in"
        >
          {languages.map((lang) => {
            // Disable the language button if it's not 'en'
            const isDisabled = lang.code !== "en";
            return (
              <button
                key={lang.code}
                onClick={() => {
                  if (isDisabled) return;
                  setLanguage(lang.code);
                  setLangMenuOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left ${
                  language === lang.code ? "font-bold" : ""
                } ${
                  !isDisabled
                    ? "hover:bg-[#BFA181]/20"
                    : "opacity-50 cursor-not-allowed"
                }`}
                aria-current={language === lang.code}
                disabled={isDisabled}
                title={isDisabled ? "Coming soon!" : undefined}
              >
                {lang.label}
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // Profile button (only shown if logged in)
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
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-15 h-15 rounded-full object-cover hover:border-4"
          />
        ) : (
          // Default profile avatar SVG
          <span className="w-15 h-15 flex items-center justify-center bg-[#BFA181]/10 rounded-full overflow-hidden">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#E5D3B3" />
              <circle cx="20" cy="16" r="7" fill="#BFA181" />
              <ellipse cx="20" cy="29" rx="11" ry="7" fill="#BFA181" />
            </svg>
          </span>
        )}
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
      className="px-6 py-2 rounded-3xl bg-[#203826] text-white font-semibold shadow-md hover:bg-[#BFA181] hover:text-[#203826] transition-colors duration-200 text-base md:text-lg flex items-center gap-3 border-2 border-[#203826] hover:border-[#BFA181] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BFA181]"
      aria-label="Login"
    >
      <span className="flex items-center">
        <span>Login</span>
      </span>
    </button>
  ) : null;

  // Mobile menu content
  const mobileMenu = (
    <div className="md:hidden absolute top-full left-0 w-full bg-[#F5E8D3] shadow-lg border-t border-[#e5dbc9] flex flex-col gap-6 px-6 py-6 animate-fade-in z-50">
      <div className="flex flex-col gap-4">{navLinks}</div>
      <div className="flex flex-col gap-3 mt-4">
        {langButton}
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
          onClick={() => router.push("/home")}
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
          {langButton}
          {cartButton}
          {profileButton}
          {loginButton}
        </div>
        {/* Mobile burger button */}
        <button
          className="md:hidden flex items-center justify-center p-3 rounded focus:outline-none z-50 relative min-w-[44px] min-h-[44px]"
          style={{ touchAction: 'manipulation' }}
          aria-label="Open menu"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          type="button"
        >
          <svg
            className="w-7 h-7 text-[#7C5E3C] pointer-events-none"
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
      <div className="bg-[#5EB6A6] h-10"></div>
    </nav>
  );
};

export default Navbar;
