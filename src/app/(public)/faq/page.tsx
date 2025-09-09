"use client";
import React from "react";

const faqs = [
  {
    question: "What is Véla?",
    answer:
      "Véla is a platform that connects you with reliable, home-based service providers such as chefs, cleaners, pet sitters, and babysitters.",
  },
  {
    question: "How do I book a service?",
    answer:
      "Simply sign up or log in, browse available services, select your preferred provider, choose a date and time, and confirm your booking.",
  },
  {
    question: "Is Véla available in my area?",
    answer:
      "Véla is currently available in select cities. When you sign up, you'll be notified if services are available in your area.",
  },
  {
    question: "How are service providers vetted?",
    answer:
      "All service providers undergo background checks and interviews to ensure safety, reliability, and professionalism.",
  },
  {
    question: "Can I reschedule or cancel a booking?",
    answer:
      "Yes, you can reschedule or cancel a booking from your profile page. Please note that cancellations within 24 hours of the appointment may incur a fee.",
  },
  {
    question: "How do I pay for services?",
    answer:
      "Payments are securely processed through the Véla platform using your preferred payment method. No cash is required.",
  },
  {
    question: "What if I have an issue with my service?",
    answer:
      "If you experience any issues, please contact our support team through the Help section. We are committed to resolving any concerns promptly.",
  },
  {
    question: "Can I become a service provider on Véla?",
    answer:
      "Absolutely! Visit our 'Become a Provider' page to apply. We welcome experienced and passionate individuals to join our community.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#7C5E3C]">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
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
