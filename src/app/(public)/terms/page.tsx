"use client";
import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] flex flex-col items-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-[#7C5E3C]">
          Terms &amp; Conditions
        </h1>
        <p className="mb-6 text-[#3B2F1E] text-center">
          Please read these Terms and Conditions (&quot;Terms&quot;) carefully before using the Véla Services platform. By accessing or using our website and services, you agree to be bound by these Terms.
        </p>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">1. Use of the Platform</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>You must be at least 18 years old to use Véla Services.</li>
            <li>You agree to provide accurate and complete information when registering or booking services.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">2. Bookings &amp; Payments</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>All bookings must be made through the Véla platform.</li>
            <li>Payments are processed securely via our payment provider. No cash payments are accepted.</li>
            <li>Cancellations within 24 hours of the appointment may incur a fee.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">3. Service Providers</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>All providers are independent contractors, not employees of Véla Services.</li>
            <li>Providers are responsible for the quality and completion of their services.</li>
            <li>Véla Services is not liable for any damages or losses resulting from services provided.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">4. User Conduct</h2>
          <ul className="list-disc pl-6 text-[#3B2F1E]">
            <li>You agree not to misuse the platform or engage in unlawful activities.</li>
            <li>Harassment, abuse, or discrimination of any kind will not be tolerated.</li>
            <li>Véla Services reserves the right to suspend or terminate accounts for violations.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">5. Limitation of Liability</h2>
          <p className="text-[#3B2F1E]">
            Véla Services is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or services.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">6. Changes to Terms</h2>
          <p className="text-[#3B2F1E]">
            We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#A68A64] mb-2">7. Contact Us</h2>
          <p className="text-[#3B2F1E]">
            If you have any questions about these Terms, please contact us at{" "}
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
