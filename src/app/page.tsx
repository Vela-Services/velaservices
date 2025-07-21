"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#F5E8D3] py-24 px-6 text-center flex flex-col items-center overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#BFA181]/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#7C5E3C]/10 rounded-full blur-3xl -z-10" />
        {/* Logo Part */}
        <div className="flex items-center justify-center mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#BFA181] to-[#7C5E3C] flex items-center justify-center mr-4 shadow-2xl border-4 border-white">
            {/* Simple Home Icon SVG */}
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-md md:text-2xl mb-3 leading-tight text-[#A68A64]/60">
              WELCOME TO{" "}
              <span className="text-[#3F2E2C] font-bold font-abhaya-libre italic text-4xl md:text-5xl">
                VÉLA
              </span>
            </h1>
          </div>
          {/* <h1 className="text-5xl md:text-6xl font-extrabold mb-7 leading-tight text-[#3B2F1E] drop-shadow">
            TO
          </h1>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-7 leading-tight text-[#3B2F1E] drop-shadow">
            VÉLA
          </h1> */}
          <p className="text-xl md:text-2xl mb-10 text-[#7C5E3C] font-medium italic">
            Because life runs better with a little help.
          </p>
          {user ? (
            <div>
              <button
                onClick={() => router.push("/profile")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Go to Profile
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center gap-6">
                <button
                  className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                  onClick={() => router.push("/signup")}
                >
                  Create an Account
                </button>
                <button
                  className="border-2 border-[#BFA181] text-[#BFA181] px-8 py-3 rounded-full font-bold bg-white/80 hover:bg-[#F5E8D3] hover:text-[#7C5E3C] hover:border-[#7C5E3C] transition-all duration-200 shadow"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 px-6 flex-1 bg-gradient-to-b from-[#F9F5EF] to-[#F5E8D3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-4xl font-extrabold text-center mb-14 text-[#7C5E3C] tracking-tight">
            Véla connects you with reliable, home-based services at your
            fingertips.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[
              {
                title: "Cooking",
                desc: "Professional chefs for your home cooking needs.",
                icon: (
                  <svg
                    className="w-20 h-20 text-[#FDEADB]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4"
                    />
                  </svg>
                ),
              },
              {
                title: "Cleaning",
                desc: "Professional cleaners for a spotless home.",
                icon: (
                  <svg
                    className="w-20 h-20 text-[#FDEADB]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 19h18M9 10V5a3 3 0 116 0v5m-9 9a3 3 0 006 0"
                    />
                  </svg>
                ),
              },
              {
                title: "Petcare",
                desc: "Qualified and caring pet sitters for your pets.",
                icon: (
                  <svg
                    className="w-20 h-20 text-[#FDEADB]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <ellipse
                      cx="12"
                      cy="12"
                      rx="8"
                      ry="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="10" r="1" />
                    <circle cx="16" cy="10" r="1" />
                  </svg>
                ),
              },
              {
                title: "Childcare",
                desc: "Qualified and caring babysitters for your children.",
                icon: (
                  <svg
                    className="w-20 h-20 text-[#FDEADB]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.5 21a7.5 7.5 0 0113 0"
                    />
                  </svg>
                ),
              },
            ].map((service, i) => (
              <div
                key={i}
                className=" aspect-square flex justify-center items-center border border-[#E2CBAA] bg-[#A2754F] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center group hover:-translate-y-1"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-[#FDEADB] group-hover:text-[#7C5E3C] transition">
                  {service.title}
                </h3>
                {/* <p className="text-[#7C5E3C] text-lg">{service.desc}</p> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section className="py-10 px-6 flex-1 bg-[#F5E8D3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-[#7C5E3C] tracking-tight">
            Our Best Providers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                title: "Maria S.",
                desc: "Professional cleaner with 10+ years of experience.",
                image: "/cleaner.webp",
              },
              {
                title: "Lucas P.",
                desc: "Caring babysitter and early childhood educator.",
                image: "/cleaner.webp",
              },
              {
                title: "Sophie T.",
                desc: "Loving pet sitter and animal enthusiast.",
                image: "/cleaner.webp",
              },
            ].map((provider, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 bg-white shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center group hover:-translate-y-1"
              >
                <img
                  src={provider.image}
                  alt={provider.title}
                  className="w-32 h-32 object-cover rounded-full mb-5 border-4 border-[#BFA181]/30 shadow-lg group-hover:scale-105 transition"
                />
                <h3 className="text-xl font-bold mb-1 text-[#BFA181] group-hover:text-[#7C5E3C] transition">
                  {provider.title}
                </h3>
                <p className="text-[#7C5E3C] text-center text-base">
                  {provider.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
