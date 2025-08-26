"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you would typically send the form data to your backend or an email service
    setSubmitted(true);
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
