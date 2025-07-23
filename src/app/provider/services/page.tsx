"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User, UserProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

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
            console.log("Provider services from Firestore:", data.services);
            setProviderServices(data.services || []);
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
    // eslint-disable-next-line
  }, []);

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
      await setDoc(userRef, { services: providerServices }, { merge: true });

      setSaveMsg("Services updated successfully!");
    } catch (err) {
      console.error("Failed to update services.", err);
      setSaveMsg("Failed to update services.");
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
    <div className="min-h-screen bg-[#F5E8D3] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-[#7C5E3C] mb-6">
            Select Services You Provide
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProviderServices();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center gap-3 text-lg text-[#7C5E3C] font-medium px-4 py-3 rounded-lg border transition
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
            <button
              type="submit"
              className={`mt-2 w-full bg-[#BFA181] text-white py-3 rounded-md hover:bg-[#A68A64] transition font-semibold text-lg ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Services"}
            </button>
            {saveMsg && (
              <div
                className={`mt-4 text-center font-medium ${
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
            <h2 className="text-lg font-semibold text-[#7C5E3C] mb-2">
              Your Current Services:
            </h2>
            {providerServices.length === 0 ? (
              <div className="text-gray-500 text-sm">
                No services selected yet.
              </div>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {providerServices.map((sid) => {
                  const s = services.find((s) => s.id === sid);
                  return (
                    <li
                      key={sid}
                      className="bg-[#BFA181] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
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
      <div className="mt-8 flex justify-center">
        <Link
          href="/provider/dashboard"
          className="inline-block px-6 py-3 bg-[#7C5E3C] text-white rounded-full font-semibold shadow hover:bg-[#BFA181] transition text-lg"
        >
          Go to your Dashboard
        </Link>
      </div>
        
      </div>
    </div>
  );
}
