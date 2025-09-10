"use client";

import React from "react";
import Image from "next/image";
import { MdChildCare, MdOutlineHome, MdOutlineLocalHospital, MdOutlineSchool, MdOutlineNightlight, MdOutlineSportsHandball } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const childcareSubservices = [
  {
    title: "Babysitting (Daytime & Evenings)",
    icon: <MdChildCare className="text-4xl text-[#BFA181]" />,
    image: "/babysitting.webp",
    includes: [
      "Supervision and playtime",
      "Meal and snack preparation",
      "Light tidying up after children",
      "Photo and text updates for parents",
      "Flexible scheduling (day or evening)",
    ],
  },
  {
    title: "After-School Care",
    icon: <MdOutlineSchool className="text-4xl text-[#BFA181]" />,
    image: "/babysitting.webp",
    includes: [
      "School pick-up and drop-off",
      "Homework help",
      "Healthy snacks",
      "Organized activities",
      "Safe, reliable supervision",
    ],
  },
  {
    title: "Overnight Childcare",
    icon: <MdOutlineNightlight className="text-4xl text-[#BFA181]" />,
    image: "/babysitting.webp",
    includes: [
      "Bedtime routines",
      "Overnight supervision",
      "Morning routines and breakfast",
      "Comfort and reassurance",
      "Emergency contact at all times",
    ],
  },
  {
    title: "Special Needs Care",
    icon: <MdOutlineLocalHospital className="text-4xl text-[#BFA181]" />,
    image: "/babysitting.webp",
    includes: [
      "Experienced with special needs children",
      "Medication administration",
      "Personalized care routines",
      "Patience and understanding",
      "Regular updates for parents",
    ],
  },
  {
    title: "In-Home Playdates",
    icon: <MdOutlineHome className="text-4xl text-[#BFA181]" />,
    image: "/babysitting.webp",
    includes: [
      "Organized group activities",
      "Supervised play",
      "Snack time",
      "Creative crafts and games",
      "Safe, fun environment",
    ],
  },
  {
    title: "Active & Outdoor Babysitting",
    icon: <MdOutlineSportsHandball className="text-4xl text-[#BFA181]" />,
    image: "/babysitting.webp",
    includes: [
      "Trips to parks and playgrounds",
      "Outdoor games and sports",
      "Nature walks",
      "Encouraging active play",
      "Weather-appropriate care",
    ],
  },
];

export default function ChildcareServicesPage() {
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
            <MdChildCare className="text-6xl text-[#BFA181]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#7C5E3C] mb-2 font-abhaya-libre">
            Childcare & Babysitting Services
          </h1>
          <p className="text-lg md:text-xl text-[#7C5E3C]/80 max-w-2xl mx-auto">
            Trust Véla’s experienced babysitters to care for your children with warmth, safety, and fun. From after-school help to overnight stays, we’re here for your family’s needs.
          </p>
        </div>
        <div className="mt-6">
          <Image
            src="/babysitting.webp"
            alt="Babysitter with children"
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
            What’s Included in Our Childcare Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {childcareSubservices.map((sub) => (
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
              src="/babysitting.webp"
              alt="Babysitter playing with children"
              width={500}
              height={350}
              className="rounded-2xl shadow-lg object-cover"
              style={{ maxHeight: 350, width: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#7C5E3C]">
              Why Choose Véla for Your Childcare?
            </h2>
            <ul className="text-[#7C5E3C] text-lg space-y-3">
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Trusted, background-checked babysitters
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Flexible scheduling for your family
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Updates and photos during every visit
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Experience with children of all ages and needs
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-[#BFA181]" />
                Safety and comfort are our top priorities
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="/customerServices"
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#BFA181] to-[#A68A64] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Book Childcare Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
