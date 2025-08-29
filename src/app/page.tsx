"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";

// import { LuCookingPot } from "react-icons/lu";
import {
  MdOutlineCleaningServices,
  MdOutlinePets,
  MdChildCare,
} from "react-icons/md";

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
              background: "linear-gradient(135deg,#fcf5eb 60%,rgb(212, 189, 165) 100%)",
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
              // {
              //   title: "Cooking",
              //   desc: "Professional chefs for your home cooking needs.",
              //   icon: (
              //     <LuCookingPot className="w-20 h-20 text-[#FDEADB] group-hover:text-[#7C5E3C] transition" />
              //   ),
              // },
              {
                title: "Cleaning",
                desc: "Professional cleaners for a spotless home.",
                icon: (
                  <MdOutlineCleaningServices className="w-15 h-15 text-[#FDEADB] group-hover:text-[#7C5E3C] transition" />
                ),
              },
              {
                title: "Petcare",
                desc: "Qualified and caring pet sitters for your pets.",
                icon: (
                  <MdOutlinePets className="w-15 h-15 text-[#FDEADB] group-hover:text-[#7C5E3C] transition" />
                ),
              },
              {
                title: "Childcare",
                desc: "Qualified and caring babysitters for your children.",
                icon: (
                  <MdChildCare className="w-15 h-15 text-[#FDEADB] group-hover:text-[#7C5E3C] transition" />
                ),
              },
            ].map((service, i) => (
              <div
                key={i}
                className="w-80 aspect-square flex justify-center items-center border border-[#E2CBAA] bg-[#A2754F] rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center group hover:-translate-y-1"
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
