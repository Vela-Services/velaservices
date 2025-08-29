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
        <div className="flex flex-col items-center justify-center mb-10">
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
                width: "6.5rem", // 104px, bigger than w-24 (96px)
                height: "6.5rem",
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
              }}
            />
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

      <section className="py-16 px-6 bg-[#F9F5EF] flex justify-center">
        <div className="max-w-4xl w-full rounded-2xl overflow-hidden shadow-lg">
          {/* ✅ wrapper avec ratio vidéo */}
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              <source src="/Vela_Header_Video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
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
