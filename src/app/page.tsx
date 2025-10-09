"use client";

import { useRouter } from "next/navigation";
// import { useAuth } from "../app/hooks/useAuth";

export default function LandingPage() {
  // const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-[1000px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/download.png"
            alt="VÉLA Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl w-full px-8 flex flex-col md:flex-row items-center justify-between text-white">
          {/* Left text block */}
          <div className="max-w-xl space-y-6 md:ml-16">
            <h1 className="text-3xl md:text-5xl font-light leading-snug text-white">
              <span className="font-semibold">One trusted provider</span> for
              your{" "}
              <span className="italic font-light">home, kids, and pets.</span>
            </h1>

            <p className="text-base md:text-lg text-white/90">
              <span className="font-semibold">
                Pilot phase now live in Oslo
              </span>{" "}
              — helping you simplify everyday life.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="mt-6 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md"
            >
              Book a Service
            </button>
          </div>

          {/* Optional right element (yellow box placeholder like your screenshot)
          <div className="hidden md:flex items-center justify-center bg-[#FFF3C4] text-black rounded-md p-10 shadow-lg">
            <div className="text-center max-w-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 mx-auto mb-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25m0 0A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M9 9h6m-6 3h6m-6 3h3"
                />
              </svg>
              <p className="text-sm">
                Add a form <br />
                <span className="text-gray-600 text-xs">
                  Go to Form Settings &gt; Forms tab
                </span>
              </p>
            </div>
          </div> */}
        </div>
      </section>

      <section className="py-14 px-6 bg-[#F5E8D3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-12 tracking-tight">
            How it works
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
            {/* Card 1 */}
            <div className="flex-1 bg-[#5EB6A6] rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 border-[#E2CBAA]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F5E8D3] border-2 border-[#BFA181] mb-4 text-2xl font-extrabold text-black">
                1
              </div>
              <h3 className="font-bold text-lg md:text-xl text-white mb-2">
                Choose Your Services
              </h3>
              <p className="text-white text-base md:text-lg">
                Cleaning, childcare, or petcare — or all at once.
              </p>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-[#5EB6A6] rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 border-[#E2CBAA]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F5E8D3] border-2 border-[#BFA181] mb-4 text-2xl font-extrabold text-black">
                2
              </div>
              <h3 className="font-bold text-lg md:text-xl text-white mb-2">
                Book in Minutes
              </h3>
              <p className="text-white text-base md:text-lg">
                One booking, one provider, one seamless schedule.
              </p>
            </div>
            {/* Card 3 */}
            <div className="flex-1 bg-[#5EB6A6] rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 border-[#E2CBAA]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F5E8D3] border-2 border-[#BFA181] mb-4 text-2xl font-extrabold text-black">
                3
              </div>
              <h3 className="font-bold text-lg md:text-xl text-white mb-2">
                Relax
              </h3>
              <p className="text-white text-base md:text-lg">
                A vetted, reliable provider arrives when you need them.
              </p>
            </div>
          </div>
          <div className="my-8 flex justify-center">
            <span className="italic">
              During our pilot phase, we&apos;re focusing on selected areas in
              Oslo&nbsp; (Nordre Aker, Frysja, and nearby districts).
            </span>
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
      <section className="py-10 px-6 flex-1 bg-[#5EB6A6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-4xl font-extrabold text-center mb-4 text-white tracking-tight">
            Our Services
          </h2>
          <p className="text-lg md:text-2xl text-center mb-14 text-white font-semibold">
            All the help you need, in one place.
          </p>

          {/* Cleaning Section */}
          {/* Cleaning Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-[#FDEADB]/80 via-[#F9F5EF]/80 to-[#F5E8D3]/80 p-10 rounded-3xl border-2 border-[#E2CBAA] shadow-2xl flex flex-col md:flex-row items-center md:items-stretch relative gap-10 transition-all duration-300">
              {/* Left: Button Picture, full height */}
              <div className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/services/cleaning")}
                  className="w-80 h-full min-h-[320px] relative border-2 border-[#E2CBAA] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group focus:outline-none flex flex-col ring-2 ring-transparent hover:ring-[#BFA181]/40"
                  style={{
                    backgroundImage: `url(/cleaning.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Cleaning"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB]/80 hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                    <h3 className="text-2xl font-extrabold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                      Cleaning Services
                    </h3>
                    <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                      Professional Cleaning You Can Trust.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="backdrop-blur-sm bg-[#7C5E3C]/30 rounded-2xl px-4 py-2">
                      <h3 className="text-2xl font-extrabold text-[#FDEADB] drop-shadow">
                        Cleaning Services
                      </h3>
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 bg-[#BFA181]/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase z-20">
                    Featured
                  </span>
                </button>
              </div>
              {/* Right: Title and two white cards */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-3xl font-extrabold text-[#7C5E3C] mb-2 text-left tracking-tight drop-shadow-sm">
                  Cleaning Services
                </h3>
                <h4 className="text-xl font-semibold text-[#A68A64] mb-8 text-left italic">
                  Professional Cleaning You Can Trust
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FDEADB]/80 to-[#F5E8D3]/80 p-6 rounded-2xl flex flex-col items-start text-left relative h-full min-h-[320px] border border-[#E2CBAA] shadow-lg hover:shadow-2xl transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#BFA181]/20 shadow">
                        <svg
                          className="block"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ display: "block" }}
                        >
                          <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                      </span>
                      <h4 className="font-bold text-[#7C5E3C] text-lg">
                        What We Offer
                      </h4>
                    </div>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8 pl-2">
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
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Learn More
                      </button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-7 h-7 text-[#FDEADB]/80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#BFA181"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M8 12l2 2 4-4"
                          stroke="#BFA181"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FDEADB]/80 to-[#F5E8D3]/80 p-6 rounded-2xl flex flex-col items-start text-left relative h-full min-h-[320px] border border-[#E2CBAA] shadow-lg hover:shadow-2xl transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#BFA181]/20 shadow">
                        <svg
                          className="block"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ display: "block" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </span>
                      <h4 className="font-bold text-[#7C5E3C] text-lg">
                        Why Choose Vela Cleaning
                      </h4>
                    </div>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8 pl-2">
                      <li>Background-checked and insured professionals</li>
                      <li>Book one-time or recurring visits</li>
                      <li>Transparent pricing, no hidden costs</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/customerServices")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Book Our Services
                      </button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-7 h-7 text-[#FDEADB]/80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#A68A64"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M16 8l-4 4-2-2"
                          stroke="#A68A64"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Childcare Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-[#FDEADB]/80 via-[#F9F5EF]/80 to-[#F5E8D3]/80 p-10 rounded-3xl border-2 border-[#E2CBAA] shadow-2xl flex flex-col md:flex-row items-center md:items-stretch relative gap-10 transition-all duration-300">
              {/* Left: Button Picture, full height */}
              <div className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = "/services/babysitting")
                  }
                  className="w-80 h-full min-h-[320px] relative border-2 border-[#E2CBAA] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group focus:outline-none flex flex-col ring-2 ring-transparent hover:ring-[#BFA181]/40"
                  style={{
                    backgroundImage: `url(/babysitting.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Childcare"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB]/80 hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                    <h3 className="text-2xl font-extrabold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                      Childcare Services
                    </h3>
                    <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                      Safe, Flexible, Reliable Childcare.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="backdrop-blur-sm bg-[#7C5E3C]/30 rounded-2xl px-4 py-2">
                      <h3 className="text-2xl font-extrabold text-[#FDEADB] drop-shadow">
                        Childcare Services
                      </h3>
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 bg-[#BFA181]/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase z-20">
                    Featured
                  </span>
                </button>
              </div>
              {/* Right: Title and two white cards */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-3xl font-extrabold text-[#7C5E3C] mb-2 text-left tracking-tight drop-shadow-sm">
                  Childcare Services
                </h3>
                <h4 className="text-xl font-semibold text-[#A68A64] mb-8 text-left italic">
                  Safe, Flexible, Reliable Childcare
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FDEADB]/80 to-[#F5E8D3]/80 p-6 rounded-2xl flex flex-col items-start text-left relative h-full min-h-[320px] border border-[#E2CBAA] shadow-lg hover:shadow-2xl transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#BFA181]/20 shadow">
                        <svg
                          className="block"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ display: "block" }}
                        >
                          <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                      </span>
                      <h4 className="font-bold text-[#7C5E3C] text-lg">
                        What We Offer
                      </h4>
                    </div>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8 pl-2">
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
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Learn More
                      </button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-7 h-7 text-[#FDEADB]/80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#BFA181"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M8 12l2 2 4-4"
                          stroke="#BFA181"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FDEADB]/80 to-[#F5E8D3]/80 p-6 rounded-2xl flex flex-col items-start text-left relative h-full min-h-[320px] border border-[#E2CBAA] shadow-lg hover:shadow-2xl transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#BFA181]/20 shadow">
                        <svg
                          className="block"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ display: "block" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </span>
                      <h4 className="font-bold text-[#7C5E3C] text-lg">
                        Why Choose Vela Childcare
                      </h4>
                    </div>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8 pl-2">
                      <li>Trusted babysitters with background checks</li>
                      <li>Flexible booking — daytime, evening, weekends</li>
                      <li>Fun, engaging, and safe environment</li>
                    </ul>
                    <div className="w-full flex justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/customerServices")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Book Our Services
                      </button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-7 h-7 text-[#FDEADB]/80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#A68A64"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M16 8l-4 4-2-2"
                          stroke="#A68A64"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Petcare Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-[#FDEADB]/80 via-[#F9F5EF]/80 to-[#F5E8D3]/80 p-10 rounded-3xl border-2 border-[#E2CBAA] shadow-2xl flex flex-col md:flex-row items-center md:items-stretch relative gap-10 transition-all duration-300">
              {/* Left: Button Picture, full height */}
              <div className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/services/petcare")}
                  className="w-80 h-full min-h-[320px] relative border-2 border-[#E2CBAA] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group focus:outline-none flex flex-col ring-2 ring-transparent hover:ring-[#BFA181]/40"
                  style={{
                    backgroundImage: `url(/petcare.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Petcare"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FDEADB]/80 hover:cursor-pointer transition-opacity duration-300 z-10 px-6 text-center">
                    <h3 className="text-2xl font-extrabold mb-2 text-[#FDEADB] drop-shadow group-hover:text-[#7C5E3C] transition">
                      Petcare Services
                    </h3>
                    <p className="text-base text-[#FDEADB] group-hover:text-[#7C5E3C] transition drop-shadow">
                      Qualified and caring pet sitters for your pets.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="backdrop-blur-sm bg-[#7C5E3C]/30 rounded-2xl px-4 py-2">
                      <h3 className="text-2xl font-extrabold text-[#FDEADB] drop-shadow">
                        Petcare Services
                      </h3>
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 bg-[#BFA181]/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase z-20">
                    Featured
                  </span>
                </button>
              </div>
              {/* Right: Title and two white cards */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-3xl font-extrabold text-[#7C5E3C] mb-2 text-left tracking-tight drop-shadow-sm">
                  Petcare Services
                </h3>
                <h4 className="text-xl font-semibold text-[#A68A64] mb-8 text-left italic">
                  Care for Your Pets, Peace of Mind for You
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FDEADB]/80 to-[#F5E8D3]/80 p-6 rounded-2xl flex flex-col items-start text-left relative h-full min-h-[320px] border border-[#E2CBAA] shadow-lg hover:shadow-2xl transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#BFA181]/20 shadow">
                        <svg
                          className="block"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ display: "block" }}
                        >
                          <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                      </span>
                      <h4 className="font-bold text-[#7C5E3C] text-lg">
                        What We Offer
                      </h4>
                    </div>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8 pl-2">
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
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Learn More
                      </button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-7 h-7 text-[#FDEADB]/80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#BFA181"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M8 12l2 2 4-4"
                          stroke="#BFA181"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FDEADB]/80 to-[#F5E8D3]/80 p-6 rounded-2xl flex flex-col items-start text-left relative h-full min-h-[320px] border border-[#E2CBAA] shadow-lg hover:shadow-2xl transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#BFA181]/20 shadow">
                        <svg
                          className="block"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ display: "block" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </span>
                      <h4 className="font-bold text-[#7C5E3C] text-lg">
                        Why Choose Vela Petcare
                      </h4>
                    </div>
                    <ul className="list-disc list-inside text-[#7C5E3C] text-base md:text-lg space-y-2 text-left mb-8 pl-2">
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
                          (window.location.href = "/customerServices")
                        }
                        className="bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A68A64] focus:ring-offset-2"
                      >
                        Book Our Services
                      </button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-7 h-7 text-[#FDEADB]/80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#A68A64"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M16 8l-4 4-2-2"
                          stroke="#A68A64"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
            <img
              src="/why.png"
              alt="Happy family and provider"
              className="shadow-2xl object-cover w-full max-w-md h-80 md:h-96"
              style={{ objectPosition: "center" }}
            />
          </div>
          {/* Right: Title and Bullet Points */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#A68A64]">
              Why choose us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#BFA181]">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#FDEADB" />
                      <path d="M7 13l3 3 7-7" stroke="#BFA181" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-[#7C5E3C] text-lg font-medium">
                    One trusted provider for home, kids, and pets
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#BFA181]">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#FDEADB" />
                      <path d="M7 13l3 3 7-7" stroke="#BFA181" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-[#7C5E3C] text-lg font-medium">
                    Vetted, background-checked professionals
                  </span>
                </li>
              </ul>
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#BFA181]">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#FDEADB" />
                      <path d="M7 13l3 3 7-7" stroke="#BFA181" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-[#7C5E3C] text-lg font-medium">
                    Simple booking & transparent pricing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-[#BFA181]">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#FDEADB" />
                      <path d="M7 13l3 3 7-7" stroke="#BFA181" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-[#7C5E3C] text-lg font-medium">
                    Reliable, friendly support when you need it
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
