"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#E2CBAA] pt-10 pb-6 px-4 text-[#7C5E3C] text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        {/* Company Info */}
        <div className="flex-1 mb-6 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-8 h-8 text-[#BFA181]"
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
            <span className="font-bold text-lg">Vela Services</span>
          </div>
          <p className="mb-2">
            Your trusted platform for booking cleaning and home services with
            professional providers.
          </p>
          <div className="flex items-center gap-2 mb-1">
            <FaMapMarkerAlt className="text-[#BFA181]" />
            <span>123 Main Street, Oslo, Norway</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <FaEnvelope className="text-[#BFA181]" />
            <a
              href="mailto:info.velaservices@gmail.com"
              className="hover:underline"
            >
              info.velaservices@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-[#BFA181]" />
            <a href="tel:+33123456789" className="hover:underline">
              +47 815 XX XXX
            </a>
          </div>
        </div>

        {/* For Customers */}
        <div className="flex-1 mb-6 md:mb-0">
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
        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="font-semibold text-base mb-2">For Providers</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/provider/register" className="hover:underline">
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

        {/* Social Media */}
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-2">Connect with Us</h3>
          <div className="flex gap-4 mb-3">
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
          <p>Follow us for updates, tips, and exclusive offers!</p>
        </div>
      </div>
      <div className="border-t border-[#BFA181]/30 mt-8 pt-4 text-center text-xs text-[#7C5E3C]/80">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
          <span>
            © {new Date().getFullYear()} Vela Services. All rights reserved.
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
