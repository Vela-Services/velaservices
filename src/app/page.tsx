"use client";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5E8D3] text-[#3B2F1E] flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#F5E8D3] py-20 px-6 text-center flex flex-col items-center">
        {/* Logo Part */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#BFA181] flex items-center justify-center mr-3 shadow-lg">
            {/* Simple Home Icon SVG */}
            <svg
              className="w-8 h-8 text-white"
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
          <span className="text-3xl font-extrabold text-[#7C5E3C] tracking-tight">
            Vela Services
          </span>
        </div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Trusted Home Services
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Cleaning, babysitting, elderly care, and more. Easy, fast, and secure.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-[#BFA181] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#A68A64] transition">
              Create an Account
            </button>
            <button className="border border-[#BFA181] text-[#BFA181] px-6 py-3 rounded-full font-semibold hover:bg-[#F5E8D3]/80 transition">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 flex-1 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#7C5E3C]">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cleaning",
                desc: "Professional cleaners for a spotless home.",
              },
              {
                title: "Babysitting",
                desc: "Qualified and caring babysitters for your children.",
              },
              {
                title: "Pet Sitting",
                desc: "Qualified and caring pet sitters for your pets.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="border border-[#E2CBAA] rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#BFA181]">{service.title}</h3>
                <p className="text-[#7C5E3C]">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#E2CBAA] py-8 text-center text-sm text-[#7C5E3C]">
        © {new Date().getFullYear()} Vela Services. All rights reserved.
      </footer>
    </div>
  );
}
