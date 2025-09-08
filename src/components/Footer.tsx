"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#E2CBAA] pt-10 pb-6 px-4 text-[#7C5E3C] text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
        {/* Logo & Description */}
        <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0">
          <div className="mb-3 flex justify-center lg:justify-start w-full">
            <img
              src="/VELA_WHITE_LOGO.svg"
              alt="Véla Logo"
              className="drop-shadow-lg"
              style={{
                objectFit: "contain",
                width: "6.5rem",
                height: "6.5rem",
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
              }}
            />
          </div>
          <p className="mb-2 max-w-xs">
            <span className="font-bold">VÉLA</span> is Norway’s all-in-one home
            services platform. Book professional cleaning, childcare, and
            petcare with one trusted provider in one seamless booking. Fast,
            flexible, and reliable.
          </p>
        </div>
        {/* Company Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0">
          <h3 className="font-semibold text-base mb-2">Contact</h3>
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <FaMapMarkerAlt className="text-[#BFA181]" />
            <span>Oslo, Norway</span>
          </div>
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <FaEnvelope className="text-[#BFA181]" />
            <a
              href="mailto:info.velaservices@gmail.com"
              className="hover:underline break-all"
            >
              info.velaservices@gmail.com
            </a>
          </div>
        </div>
        {/* For Customers */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0">
          <h3 className="font-semibold text-base mb-2">For Customers</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/customer/services" className="hover:underline">
                Book a Service
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                View Cart
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:underline">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>
        {/* For Providers */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0">
          <h3 className="font-semibold text-base mb-2">For Providers</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/login" className="hover:underline">
                Become a Provider
              </Link>
            </li>
            <li>
              <Link href="/provider/dashboard" className="hover:underline">
                Provider Dashboard
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:underline">
                My Provider Profile
              </Link>
            </li>
            <li>
              <Link href="/provider/faq" className="hover:underline">
                Provider FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Provider Support
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="font-semibold text-base mb-2">Connect with Us</h3>
          <div className="flex gap-4 mb-3 justify-center lg:justify-start">
            <a
              href="https://www.facebook.com/profile.php?id=61579180166944"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#BFA181] transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.instagram.com/vela.norway/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[#BFA181] transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@vela.services"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tiktok"
              className="hover:text-[#BFA181] transition"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/mychef-no/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#BFA181] transition"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
          <p className="text-center lg:text-left">
            Follow us for updates, tips, and exclusive offers!
          </p>
        </div>
        {/* Social Media */}
      </div>
      <div className="border-t border-[#BFA181]/30 mt-8 pt-4 text-center text-xs text-[#7C5E3C]/80">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
          <span>
            © {new Date().getFullYear()} VÉLA Services. All rights reserved.
          </span>
          <span className="hidden md:inline mx-2">|</span>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span className="hidden md:inline mx-2">|</span>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
