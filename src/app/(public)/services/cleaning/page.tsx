"use client";

import React from "react";
import Image from "next/image";
import { MdOutlineCleaningServices, MdOutlineKitchen, MdOutlineBathroom, MdOutlineBedroomParent, MdOutlineWindow, MdPets } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const cleaningSubservices = [
  {
    title: "Standard Home Cleaning",
    icon: <MdOutlineCleaningServices className="text-4xl text-[#BFA181]" />,
    image: "/cleaning.webp",
    includes: [
      "Dusting all surfaces",
      "Vacuuming and mopping floors",
      "Emptying trash bins",
      "General tidying up",
      "Wiping mirrors and glass surfaces",
    ],
  },
  {
    title: "Kitchen Cleaning",
    icon: <MdOutlineKitchen className="text-4xl text-[#BFA181]" />,
    image: "/cleaning.webp",
    includes: [
      "Wiping countertops & cabinets",
      "Cleaning sinks & faucets",
      "Cleaning exterior of appliances",
      "Mopping kitchen floors",
      "Taking out kitchen trash",
    ],
  },
  {
    title: "Bathroom Cleaning",
    icon: <MdOutlineBathroom className="text-4xl text-[#BFA181]" />,
    image: "/cleaning.webp",
    includes: [
      "Scrubbing toilets, showers & tubs",
      "Cleaning sinks & mirrors",
      "Wiping tiles & fixtures",
      "Emptying bathroom bins",
      "Mopping bathroom floors",
    ],
  },
  {
    title: "Bedroom Cleaning",
    icon: <MdOutlineBedroomParent className="text-4xl text-[#BFA181]" />,
    image: "/cleaning.webp",
    includes: [
      "Changing bed linens (if provided)",
      "Dusting furniture & decor",
      "Vacuuming carpets & rugs",
      "Organizing surfaces",
      "Wiping mirrors",
    ],
  },
  {
    title: "Window Cleaning",
    icon: <MdOutlineWindow className="text-4xl text-[#BFA181]" />,
    image: "/cleaning.webp",
    includes: [
      "Cleaning interior window glass",
      "Wiping window sills & frames",
      "Removing smudges & fingerprints",
      "Light dusting of blinds",
    ],
  },
  {
    title: "Pet-Friendly Cleaning",
    icon: <MdPets className="text-4xl text-[#BFA181]" />,
    image: "/cleaning.webp",
    includes: [
      "Pet hair removal from furniture & floors",
      "Sanitizing pet areas",
      "Using pet-safe cleaning products",
      "Deodorizing rooms",
    ],
  },
];

export default function CleaningServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D3] to-[#F9F5EF] text-[#3B2F1E] flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#F5E8D3] py-20 px-6 text-center flex flex-col items-center overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#BFA181]/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#7C5E3C]/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col items-center justify-center mb-8">
          <div
            className="w-24 h-24 flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg,#fcf5eb 60%,#BFA181 100%)",
              borderRadius: "50%",
              boxShadow: "0 4px 16px 0 rgba(191,161,129,0.10)",
            }}
          >
            <MdOutlineCleaningServices className="text-6xl text-[#BFA181]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#7C5E3C] mb-2 font-abhaya-libre">
            Cleaning Services
          </h1>
          <p className="text-lg md:text-xl text-[#7C5E3C]/80 max-w-2xl mx-auto">
            Enjoy a spotless home with Véla’s professional cleaning services. Our trusted cleaners ensure every corner of your home shines, so you can focus on what matters most.
          </p>
        </div>
        <div className="mt-6">
          <Image
            src="/cleaning.webp"
            alt="Professional cleaning"
            width={600}
            height={350}
            className="rounded-2xl shadow-lg object-cover mx-auto"
            style={{ maxHeight: 350, width: "100%", objectFit: "cover" }}
          />
        </div>
      </section>

      {/* Subservices Section */}
      <section className="py-16 px-4 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#A68A64]">
            What’s Included in Our Cleaning Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cleaningSubservices.map((sub) => (
              <div
                key={sub.title}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center group hover:-translate-y-1 border border-[#E2CBAA]"
              >
                <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                  <Image
                    src={sub.image}
                    alt={sub.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute top-3 left-3 bg-white/80 rounded-full p-2 shadow">
                    {sub.icon}
                  </div>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-3 text-[#BFA181] group-hover:text-[#7C5E3C] transition">
                    {sub.title}
                  </h3>
                  <ul className="text-[#7C5E3C] text-base space-y-2 text-left">
                    {sub.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaRegCheckCircle className="text-[#A68A64]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-14 px-4 bg-[#F5E8D3]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <Image
              src="/cleaning.webp"
              alt="Happy customer after cleaning"
              width={500}
              height={350}
              className="rounded-2xl shadow-lg object-cover"
              style={{ maxHeight: 350, width: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#7C5E3C]">
              Why Choose Véla for Your Cleaning?
            </h2>
            <ul className="text-[#7C5E3C] text-lg space-y-3">
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Trusted, background-checked cleaners
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Flexible scheduling to fit your needs
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Eco-friendly and pet-safe products available
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Satisfaction guaranteed
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="/customerServices"
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Book a Cleaning Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
