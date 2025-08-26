"use client";
import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] flex flex-col items-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-[#7C5E3C]">
          Privacy Policy
        </h1>
        <p className="mb-6 text-[#3B2F1E] text-center">
          Your privacy is important to us. This Privacy Policy explains how Véla Services collects, uses, and protects your personal information.
        </p>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>
              <span className="font-semibold">Personal Information:</span> Name, email address, phone number, and address when you register or book a service.
            </li>
            <li>
              <span className="font-semibold">Service Information:</span> Details about your bookings, preferences, and communications with providers.
            </li>
            <li>
              <span className="font-semibold">Usage Data:</span> Information about how you use our website, including device and browser data.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>To provide and manage our services.</li>
            <li>To communicate with you about your bookings and account.</li>
            <li>To improve our platform and customer experience.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">3. Sharing Your Information</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>We only share your information with service providers as necessary to fulfill your bookings.</li>
            <li>We do not sell your personal information to third parties.</li>
            <li>We may share data if required by law or to protect our rights.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">4. Data Security</h2>
          <p className="text-[#3B2F1E]">
            We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">5. Your Rights</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>You can access, update, or delete your personal information at any time by contacting us.</li>
            <li>You may opt out of marketing communications at any time.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">6. Contact Us</h2>
          <p className="text-[#3B2F1E]">
            If you have any questions about this Privacy Policy or your data, please contact us at{" "}
            <a
              href="mailto:info.velaservices@gmail.com"
              className="underline hover:text-[#A68A64] transition"
            >
              info.velaservices@gmail.com
            </a>
            .
          </p>
        </section>
        <p className="text-xs text-[#A68A64] text-center mt-8">
          Last updated: August 2025
        </p>
      </div>
    </div>
  );
}
