"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User, UserProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

import AvailabilitySelector, {
  Availability,
} from "@/components/AvailabilitySelector";

const services = [
  { id: "cleaning", name: "Cleaning" },
  { id: "babysitting", name: "Babysitting" },
  { id: "petsitting", name: "Pet Sitting" },
  { id: "cooking", name: "Cooking" },
];

export default function ServicesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [providerServices, setProviderServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);

  // Fetch user and provider's services from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setProfile(null);
        }

        // Fetch provider's services from "providers" collection
        if (userDoc.exists() && userDoc.data().role === "provider") {
          const providerRef = doc(db, "users", firebaseUser.uid);
          const providerSnap = await getDoc(providerRef);
          if (providerSnap.exists()) {
            const data = providerSnap.data();
            setProviderServices(data.services || []);
            setAvailability(data.availability || []);
          } else {
            setProviderServices([]);
          }
        }
      } else {
        setProfile(null);
        setProviderServices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { availability }, { merge: true });
        setSaveMsg("Availability updated!");
      } catch (err) {
        console.error("Failed to save availability", err);
        setSaveMsg("Failed to save availability.");
      }
    }, 1000); // 1 seconde après la dernière modification

    return () => clearTimeout(timeoutId);
  }, [availability, user]);

  // Provider: toggle service selection
  const handleProviderServiceToggle = (serviceId: string) => {
    setProviderServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    setSaveMsg(null);
  };

  // Provider: save selected services to Firestore
  const handleSaveProviderServices = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          services: providerServices,
          availability: availability,
        },
        { merge: true }
      );

      setSaveMsg("Services and availability updated successfully!");
    } catch (err) {
      console.error("Failed to update services and availability.", err);
      setSaveMsg("Failed to update services and availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <span className="text-[#7C5E3C] text-xl font-semibold">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <span className="text-[#7C5E3C] text-xl font-semibold">
          Please log in to continue.
        </span>
      </div>
    );
  }

  // PROVIDER UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-extrabold text-center text-[#7C5E3C] mb-2 tracking-tight">
            Your Provider Profile
          </h1>
          <p className="text-center text-[#7C5E3C]/70 mb-8 text-lg">
            Select the services you offer and set your weekly availability.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProviderServices();
            }}
          >
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
                <span className="inline-block w-6 h-6 bg-[#BFA181] rounded-full flex items-center justify-center text-white">
                  <FaCheckCircle />
                </span>
                Services You Provide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center gap-3 text-base text-[#7C5E3C] font-medium px-4 py-3 rounded-lg border transition
                      ${
                        providerServices.includes(service.name)
                          ? "bg-[#F5E8D3] border-[#BFA181] shadow"
                          : "bg-white border-gray-200"
                      }
                      hover:border-[#BFA181] cursor-pointer
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={providerServices.includes(service.name)}
                      onChange={() => handleProviderServiceToggle(service.name)}
                      className="accent-[#BFA181] w-5 h-5"
                    />
                    <span className="flex items-center gap-2">
                      {service.name}
                      {providerServices.includes(service.name) && (
                        <FaCheckCircle className="text-green-500 ml-1" />
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className={`mt-2 w-full bg-[#BFA181] text-white py-3 rounded-md hover:bg-[#A68A64] transition font-semibold text-lg shadow ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Services"
              )}
            </button>
            {saveMsg && (
              <div
                className={`mt-4 text-center font-medium transition ${
                  saveMsg.includes("success")
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {saveMsg}
              </div>
            )}
          </form>
          {/* Show current selected services */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#7C5E3C] mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 bg-[#BFA181] rounded-full flex items-center justify-center text-white">
                <FaCheckCircle className="text-xs" />
              </span>
              Your Current Services
            </h2>
            {providerServices.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                No services selected yet.
              </div>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {providerServices.map((sid) => {
                  const s = services.find((s) => s.id === sid || s.name === sid);
                  return (
                    <li
                      key={sid}
                      className="bg-[#BFA181] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow"
                    >
                      {s?.name || sid}
                      <FaCheckCircle className="ml-1 text-white" />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        {/* Availability Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-[#7C5E3C] mb-4 flex items-center gap-2">
            <span className="inline-block w-7 h-7 bg-[#BFA181] rounded-full flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="4" stroke="currentColor" strokeWidth={2} />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </span>
            Set Your Weekly Availability
          </h2>
          <p className="text-[#7C5E3C]/70 mb-4">
            Let customers know when you are available for missions.
          </p>
          <AvailabilitySelector
            initialAvailability={availability}
            onChange={(updatedAvailability) =>
              setAvailability(updatedAvailability)
            }
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/provider/dashboard"
            className="inline-block px-8 py-3 bg-[#7C5E3C] text-white rounded-full font-semibold shadow hover:bg-[#BFA181] transition text-lg"
          >
            Go to your Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
