"use client";
import React from "react";


import Image from "next/image";
import { FaRegCheckCircle, FaRegCalendarAlt, FaRegUser, FaShieldAlt, FaRegClock, FaRegHandshake, FaWallet, FaUserCheck, FaClipboardList, FaIdCard, FaFileAlt, FaChild, FaBroom, FaDog } from "react-icons/fa";

const howItWorksSteps = [
  {
    icon: <FaRegUser className="text-[#BFA181] text-3xl mb-2" />,
    title: "Sign Up",
    desc: "Create your free provider profile.",
  },
  {
    icon: <FaUserCheck className="text-[#BFA181] text-3xl mb-2" />,
    title: "Get Verified",
    desc: "Background check and approval.",
  },
  {
    icon: <FaRegCalendarAlt className="text-[#BFA181] text-3xl mb-2" />,
    title: "Start Getting Clients",
    desc: "Families find and book you through VÉLA.",
  },
  {
    icon: <FaWallet className="text-[#BFA181] text-3xl mb-2" />,
    title: "Get Paid Easily",
    desc: "Payments are handled securely through the platform.",
  },
];

const whyVela = [
  {
    icon: <FaRegClock className="text-[#BFA181] text-3xl mb-2" />,
    title: "You’re in Control",
    desc: "Choose which services you want to offer, and when.",
  },
  {
    icon: <FaWallet className="text-[#BFA181] text-3xl mb-2" />,
    title: "One Platform, Many Opportunities",
    desc: "Cleaning, childcare, petcare — earn more by offering multiple services.",
  },
  {
    icon: <FaRegHandshake className="text-[#BFA181] text-3xl mb-2" />,
    title: "Extra Income, Made Simple",
    desc: "No contracts — just bookings when you want them.",
  },
  {
    icon: <FaShieldAlt className="text-[#BFA181] text-3xl mb-2" />,
    title: "We Handle the Hard Part",
    desc: "VÉLA finds the clients and secures the payments.",
  },
];

const whatYouCanOffer = [
  {
    icon: <FaBroom className="text-[#BFA181] text-4xl mb-4" />,
    image: "/cleaning.webp",
    title: "Cleaning Jobs in Oslo",
    desc: (
      <>
        Home cleaning, deep cleaning, move-in/move-out, office cleaning.
      </>
    ),
    cta: "Apply Now",
    link: "/signup",
  },
  {
    icon: <FaChild className="text-[#BFA181] text-4xl mb-4" />,
    image: "/babysitting.webp",
    title: "Childcare Jobs in Oslo",
    desc: (
      <>
        Babysitting, after-school care, homework help, evening childcare.
      </>
    ),
    cta: "Apply Now",
    link: "/signup",
  },
  {
    icon: <FaDog className="text-[#BFA181] text-4xl mb-4" />,
    image: "/petcare.jpg",
    title: "Petcare Jobs in Oslo",
    desc: (
      <>
        Dog walking, cat sitting, pet feeding, overnight stays.
      </>
    ),
    cta: "Apply Now",
    link: "/signup",
  },
];

const requirements = [
  {
    icon: <FaIdCard className="text-[#BFA181] text-2xl" />,
    text: "18+ years old",
  },
  {
    icon: <FaClipboardList className="text-[#BFA181] text-2xl" />,
    text: "Experience in cleaning, childcare, or petcare (or all three)",
  },
  {
    icon: <FaRegCheckCircle className="text-[#BFA181] text-2xl" />,
    text: "Willing to pass a background check",
  },
  {
    icon: <FaFileAlt className="text-[#BFA181] text-2xl" />,
    text: "Motivation letter on why you want to join VÉLA.",
  },
];

export default function BecomeProviderPage() {
  return (
    <main className="bg-[#fcf5eb]">
      {/* Hero Section */}
      <section className="relative w-full min-h-[420px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/cleaning.webp"
            alt="Smiling provider"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Your Skills. Your Time. Your Extra Income.
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8 drop-shadow">
            VÉLA connects you with families who need cleaning, childcare, or petcare — you decide what to offer and when.
          </p>
          <a
            href="#get-started"
            className="inline-block bg-[#BFA181] hover:bg-[#A68A64] text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all text-lg"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-[#F9F5EF]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#7C5E3C]">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 mb-8">
            {howItWorksSteps.map((step, idx) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center flex-1 relative"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow mb-3 border border-[#E2CBAA]">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-[#7C5E3C] mb-1">{step.title}</h4>
                <p className="text-[#7C5E3C] text-sm">{step.desc}</p>
                {idx < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-12 h-1 bg-[#E2CBAA]"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href="#get-started"
              className="inline-block bg-[#BFA181] hover:bg-[#A68A64] text-white font-semibold px-6 py-2 rounded-full shadow transition-all"
            >
              Get Started Today &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Why Work With VÉLA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#7C5E3C]">
            Why Work With VÉLA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {whyVela.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center bg-[#F9F5EF] rounded-xl p-6 shadow border border-[#E2CBAA]"
              >
                <div>{item.icon}</div>
                <h4 className="font-semibold text-[#7C5E3C] mb-2 mt-2">{item.title}</h4>
                <p className="text-[#7C5E3C] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Offer */}
      <section className="py-16 px-4 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#7C5E3C]">
            What Services Can You Offer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatYouCanOffer.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center p-8 border border-[#E2CBAA]"
              >
                <div className="mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover mb-2"
                  />
                </div>
                <div>{item.icon}</div>
                <h3 className="font-semibold text-lg text-[#7C5E3C] mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-[#7C5E3C] text-sm mb-6 text-center">{item.desc}</p>
                <a
                  href={item.link}
                  className="inline-block bg-[#BFA181] hover:bg-[#A68A64] text-white font-semibold px-6 py-2 rounded-full shadow transition-all"
                >
                  {item.cta} &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7C5E3C] mb-4">
            VÉLA is Your Connector, Not Your Employer
          </h2>
          <p className="text-[#7C5E3C] text-lg">
            VÉLA does not hire providers directly. Instead, we connect you with clients who need your help. You set your own hours, choose the services you want to offer, and decide how much you want to work. VÉLA provides the trusted platform — you provide the service.
          </p>
        </div>
      </section>

      {/* Provider Requirements */}
      <section className="py-16 px-4 bg-[#F9F5EF]" id="get-started">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7C5E3C] mb-8 text-center">
            What You’ll Need to Join
          </h2>
          <ul className="space-y-5">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-4 bg-white rounded-lg shadow p-4 border border-[#E2CBAA]">
                <span>{req.icon}</span>
                <span className="text-[#7C5E3C] text-base">{req.text}</span>
              </li>
            ))}
          </ul>
          <div className="text-center mt-10">
            <a
              href="/signup"
              className="inline-block bg-[#BFA181] hover:bg-[#A68A64] text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all text-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    {/* FAQ Section */}
    <section className="py-16 px-4 bg-white" id="faq">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#7C5E3C] mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {/* Accordion */}
          <details className="group border border-[#E2CBAA] rounded-lg bg-[#F9F5EF] p-4 transition-all">
            <summary className="flex items-center justify-between cursor-pointer text-[#7C5E3C] font-semibold text-lg group-open:text-[#A68A64]">
              Can I offer more than one service?
              <span className="ml-2 transition-transform group-open:rotate-90">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#BFA181" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </summary>
            <div className="mt-2 text-[#7C5E3C] text-base">
              Yes! At VÉLA, providers can offer cleaning, childcare, and petcare in one booking.
            </div>
          </details>
          <details className="group border border-[#E2CBAA] rounded-lg bg-[#F9F5EF] p-4 transition-all">
            <summary className="flex items-center justify-between cursor-pointer text-[#7C5E3C] font-semibold text-lg group-open:text-[#A68A64]">
              How do I get paid?
              <span className="ml-2 transition-transform group-open:rotate-90">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#BFA181" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </summary>
            <div className="mt-2 text-[#7C5E3C] text-base">
              Payments are processed securely after each job.
            </div>
          </details>
          <details className="group border border-[#E2CBAA] rounded-lg bg-[#F9F5EF] p-4 transition-all">
            <summary className="flex items-center justify-between cursor-pointer text-[#7C5E3C] font-semibold text-lg group-open:text-[#A68A64]">
              Is there a cost to join?
              <span className="ml-2 transition-transform group-open:rotate-90">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#BFA181" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </summary>
            <div className="mt-2 text-[#7C5E3C] text-base">
              No upfront cost. VÉLA only takes a small service fee per booking.
            </div>
          </details>
          <details className="group border border-[#E2CBAA] rounded-lg bg-[#F9F5EF] p-4 transition-all">
            <summary className="flex items-center justify-between cursor-pointer text-[#7C5E3C] font-semibold text-lg group-open:text-[#A68A64]">
              Do I need to commit full-time?
              <span className="ml-2 transition-transform group-open:rotate-90">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#BFA181" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </summary>
            <div className="mt-2 text-[#7C5E3C] text-base">
              No, you choose your own schedule.
            </div>
          </details>
        </div>
        <div className="text-center mt-8">
          <a
            href="/faq"
            className="inline-block text-[#A68A64] font-semibold text-lg hover:underline transition"
          >
            See All FAQs &rarr;
          </a>
        </div>
      </div>
    </section>

    {/* Final CTA Section */}
    <section className="py-20 px-4 bg-[#1A2A32]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="/provider.jpg"
            alt="Provider smiling, holding a pet leash and cleaning bucket"
            className="rounded-2xl shadow-lg object-cover w-80 h-80 bg-[#F9F5EF] border-4 border-[#BFA181]"
            style={{ objectPosition: "center" }}
          />
        </div>
        {/* Text & CTA */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            One Provider. Multiple Services. Endless Opportunities.
          </h2>
          <p className="text-lg md:text-xl text-[#FDEADB] mb-8">
            Join VÉLA today and start earning with cleaning, childcare, and petcare — all in one platform.
          </p>
          <div className="flex justify-center md:justify-start">
            <a
              href="/signup"
              className="inline-block bg-[#BFA181] hover:bg-[#A68A64] text-white font-bold px-10 py-4 rounded-full shadow-xl text-xl transition-all"
            >
              Apply Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}
