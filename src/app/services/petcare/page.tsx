"use client";

import React from "react";
import Image from "next/image";
import { MdPets, MdOutlinePets, MdOutlineHome, MdOutlineLocalHospital, MdOutlineHotel, MdOutlineDirectionsWalk } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const petcareSubservices = [
  {
    title: "Dog Walking",
    icon: <MdOutlineDirectionsWalk className="text-4xl text-[#BFA181]" />,
    image: "/petcare.jpg",
    includes: [
      "Daily or occasional walks",
      "Individual or group walks",
      "Fresh water provided",
      "Exercise and playtime",
      "Photo updates for owners",
    ],
  },
  {
    title: "Pet Sitting (Home Visits)",
    icon: <MdOutlineHome className="text-4xl text-[#BFA181]" />,
    image: "/petcare.jpg",
    includes: [
      "Feeding and fresh water",
      "Litter box/cage cleaning",
      "Playtime and cuddles",
      "Medication administration (if needed)",
      "Home security checks",
    ],
  },
  {
    title: "Overnight Pet Care",
    icon: <MdOutlineHotel className="text-4xl text-[#BFA181]" />,
    image: "/petcare.jpg",
    includes: [
      "Overnight stays in your home",
      "Evening & morning routines",
      "24/7 companionship",
      "Feeding, walks, and play",
      "Home care (mail, plants, etc.)",
    ],
  },
  {
    title: "Pet Taxi",
    icon: <MdOutlinePets className="text-4xl text-[#BFA181]" />,
    image: "/petcare.jpg",
    includes: [
      "Transport to vet or groomer",
      "Safe, pet-friendly vehicles",
      "Flexible scheduling",
      "Door-to-door service",
      "Wait & return options",
    ],
  },
  {
    title: "Pet Medical Care",
    icon: <MdOutlineLocalHospital className="text-4xl text-[#BFA181]" />,
    image: "/petcare.jpg",
    includes: [
      "Medication administration",
      "Post-surgery care",
      "Special needs pets",
      "Basic wound care",
      "Regular health checks",
    ],
  },
  {
    title: "Exotic & Small Pet Care",
    icon: <MdPets className="text-4xl text-[#BFA181]" />,
    image: "/petcare.jpg",
    includes: [
      "Care for birds, rabbits, reptiles, etc.",
      "Specialized feeding",
      "Habitat cleaning",
      "Gentle handling",
      "Daily updates",
    ],
  },
];

export default function PetcareServicesPage() {
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
            <MdOutlinePets className="text-6xl text-[#BFA181]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#7C5E3C] mb-2 font-abhaya-libre">
            Petcare Services
          </h1>
          <p className="text-lg md:text-xl text-[#7C5E3C]/80 max-w-2xl mx-auto">
            Give your pets the care they deserve with Véla’s trusted petcare providers. From daily walks to overnight stays, our animal lovers ensure your furry, feathered, or scaly friends are happy and safe.
          </p>
        </div>
        <div className="mt-6">
          <Image
            src="/petcare.jpg"
            alt="Happy pets with sitter"
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
            What’s Included in Our Petcare Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {petcareSubservices.map((sub, idx) => (
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
              src="/petcare.jpg"
              alt="Happy pet with sitter"
              width={500}
              height={350}
              className="rounded-2xl shadow-lg object-cover"
              style={{ maxHeight: 350, width: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#7C5E3C]">
              Why Choose Véla for Your Petcare?
            </h2>
            <ul className="text-[#7C5E3C] text-lg space-y-3">
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Experienced, animal-loving caregivers
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Flexible scheduling for your needs
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Updates and photos during every visit
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Care for all types of pets, big or small
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Safety and comfort are our top priorities
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="/customer/services"
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Book Petcare Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
