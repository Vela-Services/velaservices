"use client";

import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-[#fcf5eb] shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-[#BFA181] flex items-center justify-center mr-2 shadow-lg">
          {/* Simple Home Icon SVG */}
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
          Vela Services
        </span>
      </div>
      {/* Navigation Links */}
      <div className="hidden md:flex gap-8">
        <a href="#" className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition">
          Services
        </a>
        <a href="#" className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition">
          About
        </a>
        <a href="#" className="text-[#7C5E3C] hover:text-[#BFA181] font-medium transition">
          Contact
        </a>
      </div>
      {/* Auth Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-full border border-[#BFA181] text-[#BFA181] font-semibold hover:bg-[#F5E8D3]/80 transition">
          Sign In
        </button>
        <button className="px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
