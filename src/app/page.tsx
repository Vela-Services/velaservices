"use client";

import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";

// SEO Meta constants
const SEO_TITLE = "VÉLA | Home, Child, and Pet Services in Oslo";
const SEO_DESCRIPTION =
  "One trusted provider for home cleaning, babysitting, and petcare in Oslo. Véla simplifies everyday life by connecting you with background-checked local professionals. Join our pilot today!";

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta
          name="keywords"
          content="home services, Oslo, cleaning, babysitting, petcare, Véla, trusted provider, pilot phase"
        />
        <meta name="author" content="Véla Services" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:image" content="/download.webp" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vela.no/" />
        <link rel="canonical" href="https://vela.no/" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] flex flex-col">
        {/* Hero Section */}
        <header>
          <section
            className="relative w-full flex items-center overflow-hidden min-h-[480px] md:min-h-[900px]"
            aria-label="VÉLA Hero Section"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/download.webp"
                alt="Family relaxing at home with Véla services, Oslo"
                className="w-full h-full object-cover object-center"
                width={1920}
                height={1080}
                loading="eager"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
            </div>
            {/* Content */}
            <div className="relative z-10 w-full flex items-center justify-center px-4 md:px-0">
              <div
                className="w-full max-w-xl flex flex-col justify-center items-start min-h-[350px] md:min-h-[500px] bg-black/30 md:bg-transparent rounded-2xl p-6 md:p-0 gap-4 md:ml-[18%]"
                style={{ backdropFilter: "blur(1px)" }}
              >
                <h1
                  className="text-2xl xs:text-3xl md:text-5xl font-light leading-snug text-white mb-2"
                  style={{
                    fontFamily: "var(--font-Cormorant_Garamond)",
                  }}
                >
                  <span className="sr-only">Véla: </span>
                  One trusted provider for your{" "}
                  <span className="italic">home, kids, and pets</span> in Oslo.
                </h1>
                <p
                  className="text-base md:text-lg text-white/90 font-semibold mt-2"
                  style={{
                    fontFamily: "var(--font-Nunito_Sans)",
                  }}
                >
                  <span className="font-semibold">
                    Pilot phase now live in Oslo –
                  </span>
                  <br className="hidden md:block" />
                  <span>Helping you simplify everyday life.</span>
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="mt-4 md:mt-6 px-6 py-3 w-full md:w-auto bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#5EB6A6] focus:ring-offset-2"
                  aria-label="Book a service with Véla"
                >
                  Book a Service
                </button>
              </div>
            </div>
            {/* HOW VÉLA WORKS (Pilot Version) */}
            <div
              className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20 md:left-8 md:bottom-8 md:translate-x-0"
            >
              <p
                className="text-white text-sm xs:text-base md:text-2xl font-semibold bg-black/30 rounded-full px-4 py-2 shadow-sm"
                style={{
                  fontFamily: "var(--font-Cormorant_Garamond)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                How Véla Works <span className="font-normal">(Pilot Version)</span>
              </p>
            </div>
          </section>
        </header>

        {/* How It Works Section */}
        <section
          className="py-10 md:py-14 px-2 xs:px-4 md:px-6 bg-[#F5E8D3]"
          aria-labelledby="how-it-works"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              id="how-it-works"
              className="text-xl xs:text-2xl md:text-4xl font-bold mb-8 md:mb-10"
              style={{ fontFamily: "var(--font-Cormorant_Garamond)" }}
            >
              How It Works
            </h2>
            <ol
              className="flex flex-col md:flex-row justify-center gap-6 md:gap-10 mb-8 md:mb-10"
              style={{ fontFamily: "var(--font-Nunito_Sans)" }}
              aria-label="Steps for booking with Véla"
            >
              {/* Card 1 */}
              <li className="flex-1 flex justify-center items-center">
                <article className="w-full xs:w-64 sm:w-72 h-52 xs:h-64 md:w-80 md:h-80 bg-[#5EB6A6] rounded-xl shadow-xl flex flex-col items-center justify-center relative px-4 py-4 xs:p-6 md:p-8">
                  <div className="absolute -top-4 xs:-top-5 left-1/2 transform -translate-x-1/2">
                    <span className="text-3xl xs:text-4xl md:text-5xl font-extrabold text-black bg-transparent select-none">
                      1
                    </span>
                  </div>
                  <h3 className="font-bold text-lg xs:text-xl md:text-2xl text-white mb-1 mt-8 xs:mt-7 text-center">
                    Choose Your Services
                  </h3>
                  <p className="text-white text-sm xs:text-base md:text-lg text-center">
                    Cleaning, childcare, or petcare – or all at once.
                  </p>
                </article>
              </li>
              {/* Card 2 */}
              <li className="flex-1 flex justify-center items-center">
                <article className="w-full xs:w-64 sm:w-72 h-52 xs:h-64 md:w-80 md:h-80 bg-[#5EB6A6] rounded-xl shadow-xl flex flex-col items-center justify-center relative px-4 py-4 xs:p-6 md:p-8">
                  <div className="absolute -top-4 xs:-top-5 left-1/2 transform -translate-x-1/2">
                    <span className="text-3xl xs:text-4xl md:text-5xl font-extrabold text-black bg-transparent select-none">
                      2
                    </span>
                  </div>
                  <h3 className="font-bold text-lg xs:text-xl md:text-2xl text-white mb-1 mt-8 xs:mt-7 text-center">
                    Pick a Time That Fits
                  </h3>
                  <p className="text-white text-sm xs:text-base md:text-lg text-center">
                    One booking, one provider, one seamless schedule.
                  </p>
                </article>
              </li>
              {/* Card 3 */}
              <li className="flex-1 flex justify-center items-center">
                <article className="w-full xs:w-64 sm:w-72 h-52 xs:h-64 md:w-80 md:h-80 bg-[#5EB6A6] rounded-xl shadow-xl flex flex-col items-center justify-center relative px-4 py-4 xs:p-6 md:p-8">
                  <div className="absolute -top-4 xs:-top-5 left-1/2 transform -translate-x-1/2">
                    <span className="text-3xl xs:text-4xl md:text-5xl font-extrabold text-black bg-transparent select-none">
                      3
                    </span>
                  </div>
                  <h3 className="font-bold text-lg xs:text-xl md:text-2xl text-white mb-1 mt-8 xs:mt-7 text-center">
                    Connect &amp; Relax
                  </h3>
                  <p className="text-white text-sm xs:text-base md:text-lg text-center">
                    We connect you with our vetted provider.
                  </p>
                </article>
              </li>
            </ol>
            <aside
              className="my-6 md:my-8 flex justify-center text-base xs:text-lg md:text-xl"
              style={{
                fontFamily: "var(--font-Cormorant_Garamond)",
              }}
              aria-label="Pilot location information"
            >
              <p className="italic max-w-xs xs:max-w-xl">
                During our pilot phase, we&apos;re focusing on select areas in Oslo (Nordre Aker, Frysja, and nearby districts).
              </p>
            </aside>
          </div>
        </section>

        {/* Services Section */}
        <section
          className="py-10 md:py-14 px-2 xs:px-4 md:px-6 flex-1 bg-[#5EB6A6]"
          aria-labelledby="our-services"
        >
          <div className="max-w-6xl mx-auto">
            <h2
              id="our-services"
              className="text-xl xs:text-2xl md:text-4xl font-bold text-center mb-3 md:mb-4 text-white tracking-tight"
            >
              Our Services
            </h2>
            <p className="text-base xs:text-lg md:text-xl text-center mb-6 md:mb-8 text-white tracking-tight">
              All the help you need, in one place.
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-stretch">
              {/* Cleaning Card */}
              <article className="flex-1 flex justify-center">
                <div
                  className="relative w-full xs:w-72 md:w-110 h-60 xs:h-[350px] md:h-[700px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer hover:scale-105 transition"
                  style={{
                    backgroundImage: "url(/cleaning.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-labelledby="service-cleaning"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" aria-hidden="true" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <h3
                      id="service-cleaning"
                      className="text-lg xs:text-xl md:text-2xl font-bold text-[#FFFDF8] mb-3 md:mb-6 drop-shadow-lg text-center"
                    >
                      Cleaning
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/services/cleaning")
                      }
                      className="px-4 xs:px-6 py-2 bg-[#203826] border-2 text-white font-semibold rounded-4xl shadow-md hover:bg-[#BFA181] focus:outline-none transition"
                      aria-label="Learn more about cleaning"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </article>
              {/* Babysitting Card */}
              <article className="flex-1 flex justify-center">
                <div
                  className="relative w-full xs:w-72 md:w-110 h-60 xs:h-[350px] md:h-[700px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer hover:scale-105 transition"
                  style={{
                    backgroundImage: "url(/babysitting.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-labelledby="service-babysitting"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" aria-hidden="true" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <h3
                      id="service-babysitting"
                      className="text-lg xs:text-xl md:text-2xl font-bold text-[#FFFDF8] mb-3 md:mb-6 drop-shadow-lg text-center"
                    >
                      Babysitting
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/services/babysitting")
                      }
                      className="px-4 xs:px-6 py-2 bg-[#203826] border-2 text-white font-semibold rounded-4xl shadow-md hover:bg-[#BFA181] focus:outline-none transition"
                      aria-label="Learn more about babysitting"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </article>
              {/* Petcare Card */}
              <article className="flex-1 flex justify-center">
                <div
                  className="relative w-full xs:w-72 md:w-110 h-60 xs:h-[350px] md:h-[700px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer hover:scale-105 transition"
                  style={{
                    backgroundImage: "url(/petcare.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-labelledby="service-petcare"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" aria-hidden="true" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <h3
                      id="service-petcare"
                      className="text-lg xs:text-xl md:text-2xl font-bold text-[#FFFDF8] mb-3 md:mb-6 drop-shadow-lg text-center"
                    >
                      Petcare
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/services/petcare")
                      }
                      className="px-4 xs:px-6 py-2 bg-[#203826] border-2 text-white font-semibold rounded-4xl shadow-md hover:bg-[#BFA181] focus:outline-none transition"
                      aria-label="Learn more about petcare"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose Véla */}
        <section
          className="py-10 md:py-16 px-2 xs:px-4 md:px-6 relative min-h-[550px] md:min-h-[800px]"
          style={{
            backgroundImage: "url('/whyus.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-labelledby="why-choose-vela"
        >
          <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
          <div className="relative max-w-6xl mx-auto z-10">
            <h2
              id="why-choose-vela"
              className="text-xl xs:text-2xl md:text-4xl font-bold text-center mb-7 md:mb-12 text-white uppercase drop-shadow-lg"
            >
              Why Choose Véla?
            </h2>
            <p className="text-white text-center mb-7 md:mb-10 max-w-xs xs:max-w-lg md:max-w-xl mx-auto drop-shadow text-base xs:text-lg md:text-xl font-medium">
              Véla is testing a new way to manage home services — simple, safe,
              and local. By joining our pilot, you help shape a platform built for
              Oslo’s busy families.
            </p>
            <div className="relative flex flex-col gap-6 xs:gap-8 md:gap-10 lg:flex-row items-center justify-center">
              {/* Feature 1: One-Stop Platform */}
              <div className="flex flex-col items-center p-4 xs:p-6 md:p-8" aria-label="One platform for multiple needs">
                <div className="w-14 h-14 xs:w-20 xs:h-20 mb-2 xs:mb-4 flex items-center justify-center border rounded-full bg-white">
                  {/* Calendar/clock icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 xs:w-12 xs:h-12 text-white"
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
                <h3 className="text-base xs:text-lg text-white font-semibold text-center mb-1 xs:mb-2">One Platform for Multiple Needs</h3>
                <p className="text-white text-xs xs:text-base text-center">
                  Book cleaning, babysitting, and petcare all in one place.
                </p>
              </div>
              {/* Arrow 1 */}
              <div className="hidden lg:flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 md:w-10 md:h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 12h15m-4 4 4-4-4-4" />
                </svg>
              </div>
              {/* Feature 2: Vetted Providers */}
              <div className="flex flex-col items-center p-4 xs:p-6 md:p-8" aria-label="Trusted, background-checked providers">
                <div className="w-14 h-14 xs:w-20 xs:h-20 mb-2 xs:mb-4 flex items-center justify-center border rounded-full bg-white">
                  {/* Price tag icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 xs:w-12 xs:h-12 text-white"
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
                <h3 className="text-base xs:text-lg text-white font-semibold text-center mb-1 xs:mb-2">Trusted, Background-Checked Providers</h3>
                <p className="text-white text-xs xs:text-base text-center">
                  All providers are vetted for quality and safety.
                </p>
              </div>
              {/* Arrow 2 */}
              <div className="hidden lg:flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 md:w-10 md:h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 12h15m-4 4 4-4-4-4" />
                </svg>
              </div>
              {/* Feature 3: Flexible Bookings */}
              <div className="flex flex-col items-center p-4 xs:p-6 md:p-8" aria-label="Flexible bookings that fit your schedule">
                <div className="w-14 h-14 xs:w-20 xs:h-20 mb-2 xs:mb-4 flex items-center justify-center border rounded-full bg-white">
                  {/* Grid/services icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 xs:w-12 xs:h-12 text-white"
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
                <h3 className="text-base xs:text-lg text-white font-semibold text-center mb-1 xs:mb-2">Flexible Bookings</h3>
                <p className="text-white text-xs xs:text-base text-center">
                  Book at your convenience &mdash; we fit your schedule.
                </p>
              </div>
              {/* Arrow 3 */}
              <div className="hidden lg:flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 md:w-10 md:h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 12h15m-4 4 4-4-4-4" />
                </svg>
              </div>
              {/* Feature 4: Local Human Support */}
              <div className="flex flex-col items-center p-4 xs:p-6 md:p-8" aria-label="Real human support, local in Oslo">
                <div className="w-14 h-14 xs:w-20 xs:h-20 mb-2 xs:mb-4 flex items-center justify-center border rounded-full bg-white">
                  {/* Shield/check icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 xs:w-12 xs:h-12 text-white"
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
                <h3 className="text-base xs:text-lg text-white font-semibold text-center mb-1 xs:mb-2">Local Human Support</h3>
                <p className="text-white text-xs xs:text-base text-center">
                  Get real-time support from our friendly Oslo-based team.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8 md:mt-12">
              <a
                href="/signup"
                className="px-6 xs:px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-[#F3EEE7] transition border-2 border-transparent hover:border-black text-base xs:text-lg"
                aria-label="Join the Véla pilot"
              >
                Join the Pilot
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
