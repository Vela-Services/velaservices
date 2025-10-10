"use client";

import { useRouter } from "next/navigation";
// import { useAuth } from "../app/hooks/useAuth";

export default function LandingPage() {
  // const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-[1000px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/download.webp"
            alt="VÉLA Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl w-full flex text-white items-center">
          {/* Left text block, positioned midway between left edge and center */}
          <div
            className="max-w-xl flex flex-col justify-center items-start text-left min-h-[500px]"
            style={{ marginLeft: "18%" }}
          >
            <h1
              className="text-3xl md:text-5xl font-light leading-snug text-white"
              style={{
                fontFamily: "var(--font-Cormorant_Garamond)",
              }}
            >
              One trusted provider for your{" "}
              <span className="italic">home, kids, and pets.</span>
            </h1>

            <p
              className="text-base md:text-lg text-white/90 font-bold mt-4"
              style={{
                fontFamily: "var(--font-Nunito_Sans)",
              }}
            >
              <span className="font-semibold">
                Pilot phase now live in Oslo -
              </span>{" "}
              <br />
              <span>helping you simplify everyday life.</span>
            </p>

            <button
              onClick={() => router.push("/login")}
              className="mt-6 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md"
            >
              Book a Service
            </button>
          </div>
          {/* No right content; empty for spacing */}
        </div>
        {/* Fixed HOW VÉLA WORKS text to bottom left */}
        <h2
          className="absolute left-8 bottom-8 text-white text-lg md:text-4xl font-semibold z-20"
          style={{
            fontFamily: "var(--font-Cormorant_Garamond)",
            marginLeft: "20%",
          }}
        >
          HOW VÉLA WORKS (Pilot Version)
        </h2>
      </section>

      <section className="py-14 px-6 bg-[#F5E8D3]">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="flex flex-col md:flex-row justify-center gap-10 mb-10"
            style={{
              fontFamily: "var(--font-Nunito_Sans)",
            }}
          >
            {/* Card 1 */}
            <div className="flex-1 flex justify-center items-center">
              <div className="w-72 h-72 md:w-80 md:h-80 bg-[#5EB6A6] rounded-xl shadow-xl flex flex-col items-center justify-center relative p-8">
                {/* Number crosses the top line of the square, half outside */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="text-5xl font-extrabold text-black bg-transparent select-none">
                    1
                  </span>
                </div>
                <h3 className="font-bold text-xl md:text-2xl text-white mb-2 mt-7 text-center">
                  Choose Your Services
                </h3>
                <p className="text-white text-base md:text-lg text-center">
                  Cleaning, childcare, or petcare — or all at once.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex-1 flex justify-center items-center">
              <div className="w-72 h-72 md:w-80 md:h-80 bg-[#5EB6A6] rounded-xl shadow-xl flex flex-col items-center justify-center relative p-8">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="text-5xl font-extrabold text-black bg-transparent select-none">
                    2
                  </span>
                </div>
                <h3 className="font-bold text-xl md:text-2xl text-white mb-2 mt-7 text-center">
                  Pick a time that fits
                </h3>
                <p className="text-white text-base md:text-lg text-center">
                  One booking, one provider, one seamless schedule.
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="flex-1 flex justify-center items-center">
              <div className="w-72 h-72 md:w-80 md:h-80 bg-[#5EB6A6] rounded-xl shadow-xl flex flex-col items-center justify-center relative p-8">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="text-5xl font-extrabold text-black bg-transparent select-none">
                    3
                  </span>
                </div>
                <h3 className="font-bold text-xl md:text-2xl text-white mb-2 mt-7 text-center">
                  Connect & Relax
                </h3>
                <p className="text-white text-base md:text-lg text-center">
                  We will connect you with our vetted provider
                </p>
              </div>
            </div>
          </div>
          <div
            className="my-8 flex justify-center text-lg md:text-xl"
            style={{
              fontFamily: "var(--font-Cormorant_Garamond)",
            }}
          >
            <h3 className="italic">
              During our pilot phase, we&apos;re focusing on selected areas in
              Oslo&nbsp; (Nordre Aker, Frysja, and nearby districts).
            </h3>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-14 px-6 flex-1 bg-[#5EB6A6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-4xl font-extrabold text-center mb-4 text-white tracking-tight">
            Our Services
          </h2>
          <p className="text-xl md:text-xl text-center mb-8 text-white tracking-tight">
            All the help you need, in one place.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* Cleaning Card */}
            <div className="flex-1 flex justify-center">
              <div
                className="relative w-110 h-[700px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer hover:scale-105 transition"
                style={{
                  backgroundImage: "url(/cleaning.webp)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <h3 className="text-2xl font-bold text-[#FFFDF8] mb-6 drop-shadow-lg text-center">
                    Cleaning
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = "/services/cleaning")
                    }
                    className="px-6 py-2 bg-[#203826] border-2 text-white font-semibold rounded-4xl shadow-md hover:bg-[#BFA181] focus:outline-none transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            {/* Babysitting Card */}
            <div className="flex-1 flex justify-center">
              <div
                className="relative w-110 h-[700px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer hover:scale-105 transition"
                style={{
                  backgroundImage: "url(/babysitting.webp)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <h3 className="text-2xl font-bold text-[#FFFDF8] mb-6 drop-shadow-lg text-center">
                    Babysitting
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = "/services/babysitting")
                    }
                    className="px-6 py-2 bg-[#203826] border-2 text-white font-semibold rounded-4xl shadow-md hover:bg-[#BFA181] focus:outline-none transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            {/* Petcare Card */}
            <div className="flex-1 flex justify-center">
              <div
                className="relative w-110 h-[700px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer hover:scale-105 transition"
                style={{
                  backgroundImage: "url(/petcare.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <h3 className="text-2xl font-bold text-[#FFFDF8] mb-6 drop-shadow-lg text-center">
                    Petcare
                  </h3>
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/services/petcare")}
                    className="px-6 py-2 bg-[#203826] border-2 text-white font-semibold rounded-4xl shadow-md hover:bg-[#BFA181] focus:outline-none transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4 relative min-h-[800px]"
        style={{
          backgroundImage: "url('/whyus.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
        <div className="relative max-w-6xl mx-auto z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white uppercase drop-shadow-lg">
            Why Choose Véla?
          </h2>
          <h3 className="text-white text-center mb-10 max-w-xl mx-auto drop-shadow">
            VÉLA is testing a new way to manage home services — simple, safe,
            and local. By joining our pilot, you help shape a platform built for
            Oslo’s busy families.
          </h3>
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10">
            {/* Fast Booking */}
            <div className="flex flex-col items-center p-8">
            <div className="w-20 h-20 mb-4 flex items-center justify-center border rounded-full bg-white">
            {/* Calendar/clock icon for Fast Booking */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect
                    x="8"
                    y="10"
                    width="32"
                    height="30"
                    rx="5"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                  <path
                    d="M16 6v8M32 6v8"
                    stroke="#f9f9f9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <rect
                    x="8"
                    y="16"
                    width="32"
                    height="24"
                    rx="3"
                    fill="none"
                    stroke="#f9f9f9"
                  />
                  <circle cx="24" cy="28" r="6" fill="none" stroke="#f9f9f9" />
                  <path
                    d="M24 28v-4M24 28l3 3"
                    stroke="#f9f9f9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-white text-base text-center">
                One platform for multiple needs
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden lg:flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 12h15m-4 4 4-4-4-4" />
              </svg>
            </div>

            {/* Transparent Pricing */}
            <div className="flex flex-col items-center p-8">
            <div className="w-20 h-20 mb-4 flex items-center justify-center border rounded-full bg-white">
            {/* Price tag icon for Transparent Pricing */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M10 26L26 10a4 4 0 015.7 0l6.3 6.3a4 4 0 010 5.7L18 38a4 4 0 01-5.7 0l-6.3-6.3A4 4 0 016 26l4-4z"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                  <circle cx="32" cy="16" r="2.5" fill="#f9f9f9" />
                  <path
                    d="M18 38l-8-8"
                    stroke="#f9f9f9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-white text-base text-center">
                Trusted, background-checked providers
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden lg:flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 12h15m-4 4 4-4-4-4" />
              </svg>
            </div>

            {/* Various Services */}
            <div className="flex flex-col items-center p-8">
            <div className="w-20 h-20 mb-4 flex items-center justify-center border rounded-full bg-white">
            {/* Grid/services icon for Various Services */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect
                    x="8"
                    y="8"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                  <rect
                    x="28"
                    y="8"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                  <rect
                    x="8"
                    y="28"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                  <rect
                    x="28"
                    y="28"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                </svg>
              </div>
              <p className="text-white text-base text-center">
                Flexible bookings that fit your schedule
              </p>
            </div>

            {/* Arrow 3 */}
            <div className="hidden lg:flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 12h15m-4 4 4-4-4-4" />
              </svg>
            </div>

            {/* Maximum Safety */}
            <div className="flex flex-col items-center p-8">
              <div className="w-20 h-20 mb-4 flex items-center justify-center border rounded-full bg-white">
                {/* Shield/check icon for Maximum Safety */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M24 6l16 6v10c0 10.5-7.5 18.5-16 20-8.5-1.5-16-9.5-16-20V12l16-6z"
                    fill="#334d35"
                    stroke="#f9f9f9"
                  />
                  <path
                    d="M18 26l5 5 7-9"
                    stroke="#f9f9f9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-white text-base text-center">
                Real human support, local in Oslo
              </p>
            </div>
          </div>
        <div className="flex justify-center mt-12">
          <a
            href="/signup"
            className="px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-[#F3EEE7] transition border-2 border-transparent hover:border-black"
          >
            Join the Pilot
          </a>
        </div>
        </div>
      </section>
    </div>
  );
}
