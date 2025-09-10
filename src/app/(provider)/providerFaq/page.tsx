"use client";
import React from "react";

const providerFaqs = [
  {
    question: "How do I become a Véla service provider?",
    answer:
      "To become a provider, simply visit the 'Become a Provider' page and complete the registration form. Our team will review your application and contact you for the next steps, including background checks and an interview.",
  },
  {
    question: "What services can I offer on Véla?",
    answer:
      "You can offer services such as cooking, cleaning, pet care, and childcare. If you have expertise in another home-based service, let us know during your application.",
  },
  {
    question: "How do I receive bookings?",
    answer:
      "Once approved, customers can view your profile and book your services directly through the Véla platform. You will receive notifications for new bookings and can manage your schedule in your provider dashboard.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Payments are processed securely through the Véla platform. After completing a service, your earnings will be transferred to your registered bank account, typically within 3-5 business days.",
  },
  {
    question: "Can I set my own availability?",
    answer:
      "Yes! You can set and update your availability at any time in your provider dashboard, making it easy to work when it suits you.",
  },
  {
    question: "What if I need to cancel or reschedule a booking?",
    answer:
      "You can cancel or reschedule bookings from your dashboard. Please notify your client as early as possible to maintain a high rating and avoid penalties.",
  },
  {
    question: "How does Véla ensure my safety?",
    answer:
      "We verify all customers and provide support for any issues that arise. If you ever feel unsafe, contact Véla support immediately.",
  },
  {
    question: "Who do I contact for support or questions?",
    answer:
      "You can reach our support team through the 'Provider Support' link or by emailing info.velaservices@gmail.com. We're here to help!",
  },
];

export default function ProviderFAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#7C5E3C]">
          Provider FAQ
        </h1>
        <div className="space-y-6">
          {providerFaqs.map((faq, idx) => (
            <details
              key={idx}
              className="bg-white/80 rounded-xl shadow p-5 group"
              open={idx === 0}
            >
              <summary className="cursor-pointer text-lg font-semibold text-[#A68A64] outline-none focus:ring-2 focus:ring-[#BFA181] transition">
                {faq.question}
              </summary>
              <div className="mt-3 text-[#3B2F1E] text-base">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
