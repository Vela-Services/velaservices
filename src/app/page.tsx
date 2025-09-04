"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#F5E8D3] py-24 px-6 text-center flex flex-col items-center overflow-hidden min-h-[600px]">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ objectFit: "cover" }}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/Vela_Header_Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Strong overlay for readability */}
          <div
            className="absolute inset-0 bg-black/30"
            aria-hidden="true"
          ></div>
        </div>
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#BFA181]/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#7C5E3C]/10 rounded-full blur-3xl -z-10" />
        {/* Logo Part */}
        <div className="flex flex-col items-center justify-center mb-10 z-10">
          <div
            className="w-28 h-28 flex items-center justify-center mr-4 cursor-pointer transition-transform duration-200 hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg,#fcf5eb 60%,rgb(212, 189, 165) 100%)",
              borderRadius: "50%",
              boxShadow: "0 4px 16px 0 rgba(191,161,129,0.10)",
            }}
          >
            <img
              src="/VELA_WHITE_LOGO.svg"
              alt="Véla Logo"
              className="drop-shadow-lg"
              style={{
                objectFit: "contain",
                width: "6.5rem",
                height: "6.5rem",
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
              }}
            />
          </div>
        </div>
        <div className="max-w-3xl mx-auto z-10">
          <div className="flex flex-col items-center">
            <h1 className="text-md md:text-2xl mb-3 leading-tight text-white drop-shadow-lg font-semibold">
              WELCOME TO{" "}
              <span className="text-white font-bold font-abhaya-libre italic text-4xl md:text-5xl drop-shadow-lg">
                VÉLA
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-10 text-white font-medium italic drop-shadow-lg">
          Your Time, Our Priority.
          </p>
          {user ? (
            <div>
              <button
                onClick={() => router.push("/profile")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
              >
                Go to Profile
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center gap-6">
                <button
                  className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                  onClick={() => router.push("/login")}
                >
                  Book a Service
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

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
            {[
              {
                title: "Cleaning",
                desc: "Professional cleaners for a spotless home.",
                image: "/cleaning.webp",
                href: "/services/cleaning",
              },
              {
                title: "Petcare",
                desc: "Qualified and caring pet sitters for your pets.",
                image: "/petcare.jpg",
                href: "/services/petcare",
              },
              {
                title: "Childcare",
                desc: "Qualified and caring babysitters for your children.",
                image: "/babysitting.webp",
                href: "/services/babysitting",
              },
            ].map((service, i) => (
              <button
                key={i}
                type="button"
                onClick={() => (window.location.href = service.href)}
                className="w-80 aspect-square relative border border-[#E2CBAA] rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group focus:outline-none"
                style={{
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-label={service.title}
              >
                {/* Overlay for darkening the image */}
                {/* Hover content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB] hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                  <h3 className="text-2xl font-bold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                    {service.title}
                  </h3>
                  <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                    {service.desc}
                  </p>
                </div>
                {/* Default content (icon or title) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-2xl font-bold text-[#FDEADB] drop-shadow">
                    {service.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#A68A64]">
            Why Choose Véla?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Fast Booking */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center p-8 border border-[#E2CBAA]">
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#FDEADB]/60 shadow">
                {/* Calendar/clock icon for Fast Booking */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-[#BFA181]"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="8" y="10" width="32" height="30" rx="5" fill="#FDEADB" stroke="#BFA181" />
                  <path d="M16 6v8M32 6v8" stroke="#BFA181" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="8" y="16" width="32" height="24" rx="3" fill="none" stroke="#BFA181" />
                  <circle cx="24" cy="28" r="6" fill="none" stroke="#BFA181" />
                  <path d="M24 28v-4M24 28l3 3" stroke="#BFA181" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                Fast Booking
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                Book your service in just a few clicks. Our streamlined process
                gets you matched with a provider quickly and easily.
              </p>
            </div>
            {/* Transparent Pricing */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center p-8 border border-[#E2CBAA]">
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#FDEADB]/60 shadow">
                {/* Price tag icon for Transparent Pricing */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-[#BFA181]"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M10 26L26 10a4 4 0 015.7 0l6.3 6.3a4 4 0 010 5.7L18 38a4 4 0 01-5.7 0l-6.3-6.3A4 4 0 016 26l4-4z" fill="#FDEADB" stroke="#BFA181"/>
                  <circle cx="32" cy="16" r="2.5" fill="#BFA181"/>
                  <path d="M18 38l-8-8" stroke="#BFA181" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                Transparent Pricing
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                No hidden fees. See exactly what you’ll pay before you book,
                with clear and upfront pricing for every service.
              </p>
            </div>
            {/* Various Services */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center p-8 border border-[#E2CBAA]">
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#FDEADB]/60 shadow">
                {/* Grid/services icon for Various Services */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-[#BFA181]"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="8" y="8" width="12" height="12" rx="3" fill="#FDEADB" stroke="#BFA181"/>
                  <rect x="28" y="8" width="12" height="12" rx="3" fill="#FDEADB" stroke="#BFA181"/>
                  <rect x="8" y="28" width="12" height="12" rx="3" fill="#FDEADB" stroke="#BFA181"/>
                  <rect x="28" y="28" width="12" height="12" rx="3" fill="#FDEADB" stroke="#BFA181"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                Various Services
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                From cleaning and childcare to petcare and more, Véla offers a
                wide range of trusted home services for every need.
              </p>
            </div>
            {/* Maximum Safety */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center p-8 border border-[#E2CBAA]">
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#FDEADB]/60 shadow">
                {/* Shield/check icon for Maximum Safety */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-[#BFA181]"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M24 6l16 6v10c0 10.5-7.5 18.5-16 20-8.5-1.5-16-9.5-16-20V12l16-6z"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                  <path
                    d="M18 26l5 5 7-9"
                    stroke="#BFA181"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                Maximum Safety
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                All providers are thoroughly vetted and background-checked,
                ensuring your peace of mind and the highest standards of safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section className="py-10 px-6 flex-1 bg-[#F5E8D3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-[#7C5E3C] tracking-tight">
            Meet Our Top Providers
          </h2>
          <p className="text-[#7C5E3C]/80 text-center mb-8 text-base">
            Handpicked, trusted, and loved by our customers. Get to know a few
            of the amazing people who make Véla special.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-20">
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
                className="relative rounded-3xl bg-gradient-to-br from-[#FFFFFF] to-[#F1E8D3] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center group hover:-translate-y-2 border border-[#E2CBAA]/60 p-7"
              >
                <div className="relative -mt-16 mb-4">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#BFA181]/30 to-[#FDEADB]/80 flex items-center justify-center shadow-lg ring-4 ring-[#BFA181]/10 overflow-hidden">
                    <img
                      src={provider.image}
                      alt={provider.title}
                      className="w-24 h-24 object-cover rounded-full border-2 border-white shadow group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-[#7C5E3C] group-hover:text-[#A68A64] transition-colors tracking-wide">
                  {provider.title}
                </h3>
                <p className="text-[#7C5E3C]/80 text-center text-sm leading-relaxed px-2">
                  {provider.desc}
                </p>
                <div className="absolute top-4 right-4 w-4 h-4 bg-[#BFA181]/20 rounded-full blur-sm group-hover:scale-125 transition" />
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#A68A64]/10 rounded-full blur-sm group-hover:scale-110 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
