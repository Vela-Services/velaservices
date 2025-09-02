"use client";
import React, { useState } from "react";

const ISSUE_OPTIONS = [
  "Login problems",
  "Payment issues",
  "Account registration issues",
  "Can’t find a service",
  "Booking problems",
  "Cancel or change a booking",
  "Website/App technical issue",
  "Notification or messaging issues",
  "Questions about providers",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    issues: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleIssueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setForm((prev) => {
      if (checked) {
        return { ...prev, issues: [...prev.issues, value] };
      } else {
        return { ...prev, issues: prev.issues.filter((issue) => issue !== value) };
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Send the form data directly to an API endpoint (e.g., /api/contact)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          issues: form.issues,
          message: form.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("There was a problem sending your message. Please try again later.");
      }
    } catch (error) {
      alert("There was a problem sending your message. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-[#7C5E3C]">
          Contact Us
        </h1>
        <p className="text-[#3B2F1E] text-center mb-8">
          Have a question, feedback, or need help? Fill out the form below and our team will get back to you soon.
        </p>
        {submitted ? (
          <div className="text-center text-[#7C5E3C] font-semibold text-lg py-8">
            Thank you for reaching out!<br />We have received your message.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[#A68A64] font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#E2CBAA] focus:outline-none focus:ring-2 focus:ring-[#BFA181] bg-white text-[#3B2F1E]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[#A68A64] font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#E2CBAA] focus:outline-none focus:ring-2 focus:ring-[#BFA181] bg-white text-[#3B2F1E]"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-[#A68A64] font-medium mb-1">
                Possible Issue(s) <span className="text-xs text-[#BFA181]">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ISSUE_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center space-x-2 text-[#3B2F1E] text-sm">
                    <input
                      type="checkbox"
                      name="issues"
                      value={option}
                      checked={form.issues.includes(option)}
                      onChange={handleIssueChange}
                      className="accent-[#BFA181] rounded border-[#E2CBAA] focus:ring-[#BFA181]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-[#A68A64] font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#E2CBAA] focus:outline-none focus:ring-2 focus:ring-[#BFA181] bg-white text-[#3B2F1E] resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        )}
        <div className="mt-8 text-center text-[#7C5E3C] text-sm">
          Or email us at{" "}
          <a
            href="mailto:info.velaservices@gmail.com"
            className="underline hover:text-[#A68A64] transition"
          >
            info.velaservices@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
