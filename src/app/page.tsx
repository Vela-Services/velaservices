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

      <section className="py-14 px-6 bg-[#F5E8D3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#7C5E3C] mb-12 tracking-tight">
            How it works
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
            {/* Card 1 */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 border-[#E2CBAA]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F5E8D3] border-2 border-[#BFA181] mb-4 text-2xl font-extrabold text-[#BFA181]">
                1
              </div>
              <h3 className="font-bold text-lg md:text-xl text-[#7C5E3C] mb-2">
                Choose Your Services
              </h3>
              <p className="text-[#7C5E3C] text-base md:text-lg">
                Cleaning, childcare, or petcare — or all at once.
              </p>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 border-[#E2CBAA]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F5E8D3] border-2 border-[#BFA181] mb-4 text-2xl font-extrabold text-[#BFA181]">
                2
              </div>
              <h3 className="font-bold text-lg md:text-xl text-[#7C5E3C] mb-2">
                Book in Minutes
              </h3>
              <p className="text-[#7C5E3C] text-base md:text-lg">
                One booking, one provider, one seamless schedule.
              </p>
            </div>
            {/* Card 3 */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 border-[#E2CBAA]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F5E8D3] border-2 border-[#BFA181] mb-4 text-2xl font-extrabold text-[#BFA181]">
                3
              </div>
              <h3 className="font-bold text-lg md:text-xl text-[#7C5E3C] mb-2">
                Relax
              </h3>
              <p className="text-[#7C5E3C] text-base md:text-lg">
                A vetted, reliable provider arrives when you need them.
              </p>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2 text-lg"
            onClick={() => router.push("/signup")}
          >
            Create an Account
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 px-6 flex-1 bg-gradient-to-b from-[#F9F5EF] to-[#F5E8D3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-4xl font-extrabold text-center mb-4 text-[#7C5E3C] tracking-tight uppercase">
            OUR SERVICES
          </h2>
          <p className="text-lg md:text-2xl text-center mb-14 text-[#A68A64] font-semibold">
            One provider. Many services. A simpler way to care for your home.
          </p>

          {/* Cleaning Section */}
          <div className="mb-16">
            <div className="bg-[#FDEADB]/50 p-8 rounded-2xl border border-[#E2CBAA] shadow-lg flex flex-col md:flex-row items-center md:items-stretch relative gap-8">
              {/* Left: Button Picture, full height */}
              <div className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/services/cleaning")}
                  className="w-80 h-full min-h-[320px] relative border border-[#E2CBAA] rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group focus:outline-none flex flex-col"
                  style={{
                    backgroundImage: `url(/cleaning.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Cleaning"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB] hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                      Cleaning Services
                    </h3>
                    <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                      Professional Cleaning You Can Trust.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-2xl font-bold text-[#FDEADB] drop-shadow">
                      Cleaning Services
                    </h3>
                  </div>
                </button>
              </div>
              {/* Right: Title and two white cards */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#7C5E3C] mb-2 text-left">
                  Cleaning Services
                </h3>
                <h4 className="text-xl font-bold text-[#7C5E3C] mb-8 text-left">
                  Professional Cleaning You Can Trust
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-4 rounded-lg flex flex-col items-start text-left relative h-full min-h-[320px]">
                    <h4 className="font-semibold text-[#7C5E3C] mb-2 text-left">
                      What We Offer
                    </h4>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8">
                      <li>Standard home cleaning</li>
                      <li>Deep cleaning</li>
                      <li>Move-in / move-out cleaning</li>
                      <li>Office cleaning</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/services/cleaning")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded font-bold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-4 rounded-lg flex flex-col items-start text-left relative h-full min-h-[320px]">
                    <h4 className="font-semibold text-[#7C5E3C] mb-2 text-left">
                      Why Choose Vela Cleaning
                    </h4>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8">
                      <li>Background-checked and insured professionals</li>
                      <li>Book one-time or recurring visits</li>
                      <li>Transparent pricing, no hidden costs</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/services/cleaning")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded font-bold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Book Our Services
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Childcare Section */}
          <div className="mb-16">
            <div className="bg-[#FDEADB]/50 p-8 rounded-2xl border border-[#E2CBAA] shadow-lg flex flex-col md:flex-row-reverse items-center md:items-stretch relative gap-8">
              {/* Left: Button Picture, full height */}
              <div className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = "/services/babysitting")
                  }
                  className="w-80 h-full min-h-[320px] relative border border-[#E2CBAA] rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group focus:outline-none flex flex-col"
                  style={{
                    backgroundImage: `url(/babysitting.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Childcare"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB] hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                      Safe, Flexible, Reliable Childcare
                    </h3>
                    <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                      Because nothing matters more than your child’s well-being.
                      Our providers are qualified caregivers with verified
                      experience.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-2xl font-bold text-[#FDEADB] drop-shadow">
                      Childcare
                    </h3>
                  </div>
                </button>
              </div>
              {/* Right: Title and two white cards */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#7C5E3C] mb-2 text-left">
                  Childcare Services
                </h3>
                <h4 className="text-xl font-bold text-[#7C5E3C] mb-8 text-left">
                  Because nothing matters more than your child’s well-being. Our
                  providers are qualified caregivers with verified experience.{" "}
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 */}

                  {/* Card 2 */}
                  <div className="bg-white p-4 rounded-lg flex flex-col items-start text-left relative h-full min-h-[320px]">
                    <h4 className="font-semibold text-[#7C5E3C] mb-2 text-left">
                      Why Choose Vela Childcare
                    </h4>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8">
                      <li>Trusted babysitters with background checks</li>
                      <li>Flexible booking — daytime, evening, weekends</li>
                      <li>Fun, engaging, and safe environment</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/services/babysitting")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded font-bold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Book Our Services
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex flex-col items-start text-left relative h-full min-h-[320px]">
                    <h4 className="font-semibold text-[#7C5E3C] mb-2 text-left">
                      What We Offer
                    </h4>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8">
                      <li>Babysitting (occasional or regular)</li>
                      <li>Homework help and after-school care</li>
                      <li>Evening / event childcare</li>
                      <li>Part-time and flexible options</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/services/babysitting")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded font-bold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Petcare Section */}
          <div>
            <div className="bg-[#FDEADB]/50 p-8 rounded-2xl border border-[#E2CBAA] shadow-lg flex flex-col md:flex-row items-center md:items-stretch relative gap-8">
              {/* Left: Button Picture, full height */}
              <div className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/services/petcare")}
                  className="w-80 h-full min-h-[320px] relative border border-[#E2CBAA] rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group focus:outline-none flex flex-col"
                  style={{
                    backgroundImage: `url(/petcare.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Petcare"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB] hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                      Petcare
                    </h3>
                    <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                      Qualified and caring pet sitters for your pets.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-2xl font-bold text-[#FDEADB] drop-shadow">
                      Petcare
                    </h3>
                  </div>
                </button>
              </div>
              {/* Right: Title and two white cards */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#7C5E3C] mb-2 text-left">
                  Petcare Services
                </h3>
                <h4 className="text-xl font-bold text-[#7C5E3C] mb-8 text-left">
                  Care for Your Pets, Peace of Mind for You{" "}
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-4 rounded-lg flex flex-col items-start text-left relative h-full min-h-[320px]">
                    <h4 className="font-semibold text-[#7C5E3C] mb-2 text-left">
                      What We Offer
                    </h4>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8">
                      <li>Dog walking</li>
                      <li>Cat sitting</li>
                      <li>Pet check-ins and feeding</li>
                      <li>Overnight pet sitting</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/services/petcare")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded font-bold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-4 rounded-lg flex flex-col items-start text-left relative h-full min-h-[320px]">
                    <h4 className="font-semibold text-[#7C5E3C] mb-2 text-left">
                      Why Choose Vela Petcare
                    </h4>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8">
                      <li>Loving, trained pet sitters</li>
                      <li>
                        Flexible schedules, from daily walks to overnight stays
                      </li>
                      <li>Tailored care for cats, dogs, and more</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/services/petcare")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded font-bold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Book Our Services
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  <rect
                    x="8"
                    y="10"
                    width="32"
                    height="30"
                    rx="5"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                  <path
                    d="M16 6v8M32 6v8"
                    stroke="#BFA181"
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
                    stroke="#BFA181"
                  />
                  <circle cx="24" cy="28" r="6" fill="none" stroke="#BFA181" />
                  <path
                    d="M24 28v-4M24 28l3 3"
                    stroke="#BFA181"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                One Provider, Many Services
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                Save time by booking multiple needs.
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
                  <path
                    d="M10 26L26 10a4 4 0 015.7 0l6.3 6.3a4 4 0 010 5.7L18 38a4 4 0 01-5.7 0l-6.3-6.3A4 4 0 016 26l4-4z"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                  <circle cx="32" cy="16" r="2.5" fill="#BFA181" />
                  <path
                    d="M18 38l-8-8"
                    stroke="#BFA181"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                Trusted & Vetted
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                Every provider passes background checks and training.
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
                  <rect
                    x="8"
                    y="8"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                  <rect
                    x="28"
                    y="8"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                  <rect
                    x="8"
                    y="28"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                  <rect
                    x="28"
                    y="28"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#FDEADB"
                    stroke="#BFA181"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#BFA181] text-center">
                Simple & Transparent
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                Easy booking and upfront princing.
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
                Peace of Mind
              </h3>
              <p className="text-[#7C5E3C]/90 text-base text-center">
                Safe, reliable, and professional support for your home and
                family.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
