"use client";

import React, { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User, UserProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

import AvailabilitySelector, {
  Availability,
} from "@/components/AvailabilitySelector";

import { Service, SubService, ProviderService } from "@/types/types";

export default function ServicesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [providerServices, setProviderServices] = useState<ProviderService[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Fetch services
  useEffect(() => {
    let isMounted = true;
    async function fetchServices() {
      try {
        const servicesCol = collection(db, "services");
        const servicesSnap = await getDocs(servicesCol);

        const servicesArr: Service[] = [];

        for (const docSnap of servicesSnap.docs) {
          const data = docSnap.data();

          // Si subServices est stocké dans le document principal comme array de maps
          const subServices: SubService[] | undefined = data.subServices?.map(
            (subData: unknown) => {
              const s = subData as {
                id: string;
                name: string;
                price: number;
                baseDuration: number;
              };
              return {
                id: s.id,
                name: s.name,
                price: s.price,
                baseDuration: s.baseDuration,
              };
            }
          );

          servicesArr.push({
            id: docSnap.id,
            name: data.name,
            subServices: subServices?.length ? subServices : undefined,
          });
        }

        console.log("✅ Services fetched from Firestore:", servicesArr);

        if (isMounted) setServices(servicesArr);
      } catch (err) {
        console.error("❌ Failed to fetch services from Firestore", err);
      }
    }
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch user + provider
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setProviderServices([]);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!userDoc.exists()) {
          setProfile(null);
          setProviderServices([]);
          setLoading(false);
          return;
        }

        const data = userDoc.data();
        setProfile(data as UserProfile);

        if (data.role === "provider" && Array.isArray(data.services)) {
          // data.services contains provider's selected services
          setProviderServices(data.services);
          setAvailability(data.availability || []);
        } else {
          setProviderServices([]);
        }
      } catch (error) {
        console.error("❌ Error loading provider services:", error);
        setProfile(null);
        setProviderServices([]);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Save availability to Firestore (debounced)
  useEffect(() => {
    if (!user) return;
    if (loading) return;
    const timeoutId = setTimeout(async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { availability }, { merge: true });
        setSaveMsg("Availability updated!");
      } catch (err) {
        console.error("Failed to save availability", err);
        setSaveMsg("Failed to save availability.");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [availability, user, loading]);

  const handleProviderServiceToggle = async (serviceId: string) => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);

    // Construire directement la nouvelle liste
    let updatedServices: ProviderService[];
    const exists = providerServices.some((s) => s.serviceId === serviceId);

    if (exists) {
      updatedServices = providerServices.filter(
        (s) => s.serviceId !== serviceId
      );
    } else {
      const service = services.find((s) => s.id === serviceId);
      updatedServices = [
        ...providerServices,
        {
          serviceId: service!.id,
          subServices: service?.subServices || [],
        },
      ];
    }

    console.log(updatedServices, "updatedServices");

    // Mettre à jour l'état local
    setProviderServices(updatedServices);

    // Puis Firestore
    try {
      const userRef = doc(db, "users", user.uid);
      console.log(
        "Saving to Firestore:",
        JSON.stringify(updatedServices, null, 2)
      );

      await setDoc(userRef, { services: updatedServices }, { merge: true });
      setSaveMsg("Services updated!");
    } catch (err) {
      console.error("Failed to update services.", err);
      setSaveMsg("Failed to update services.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubServiceToggle = (serviceId: string, subServiceId: string) => {
    // Find the subService object from the main services list
    const service = services.find((s) => s.id === serviceId);
    const subService = service?.subServices?.find((s) => s.id === subServiceId);
    if (!subService) return;

    setProviderServices((prev) =>
      prev.map((ps) => {
        if (ps.serviceId !== serviceId) return ps;
        const exists = ps.subServices?.some((s) => s.id === subServiceId);
        return {
          ...ps,
          subServices: exists
            ? ps.subServices!.filter((s) => s.id !== subServiceId)
            : [...(ps.subServices || []), subService],
        };
      })
    );
  };

  const handleSubServicePriceChange = (
    serviceId: string,
    subId: string,
    price: number
  ) => {
    setProviderServices((prev) =>
      prev.map((ps) => {
        if (ps.serviceId !== serviceId) return ps;
        return {
          ...ps,
          subServices: ps.subServices!.map((s) =>
            s.id === subId ? { ...s, price } : s
          ),
        };
      })
    );
  };

  // Save to Firestore
  const handleSaveProviderServices = useCallback(async () => {
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
      setSaveMsg("Services, prices, and availability updated successfully!");
    } catch (err) {
      console.error("Failed to update services and availability.", err);
      setSaveMsg("Failed to update services and availability.");
    } finally {
      setSaving(false);
    }
  }, [user, providerServices, availability]);

  if (loading || services.length === 0) {
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
            Select the services you offer, set your hourly price, and set your
            weekly availability.
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
                {/* Dynamic Service List */}
                {services.map((service) => {
                  const providerService = providerServices.find(
                    (s) => s.serviceId === service.id
                  );
                  const serviceSelected = !!providerService;

                  return (
                    <div
                      key={service.id}
                      className={`flex flex-col gap-2 text-[#7C5E3C] font-medium px-4 py-3 rounded-lg border transition
        ${
          serviceSelected
            ? "bg-[#F5E8D3] border-[#BFA181] shadow"
            : "bg-white border-gray-200"
        }
      `}
                    >
                      {/* Main service checkbox */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={serviceSelected}
                          onChange={() =>
                            handleProviderServiceToggle(service.id)
                          }
                          className="accent-[#BFA181] w-5 h-5"
                          id={`service-checkbox-${service.id}`}
                        />
                        <label
                          htmlFor={`service-checkbox-${service.id}`}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          {service.name}
                          {serviceSelected && (
                            <FaCheckCircle className="text-green-500 ml-1" />
                          )}
                        </label>
                      </div>

                      {/* Subservices */}
                      {serviceSelected && service.subServices && (
                        <div className="ml-6 mt-2 flex flex-col gap-2">
                          {service.subServices.map((sub) => {
                            const subSelected =
                              providerService?.subServices?.some(
                                (ss) => ss.id === sub.id
                              );
                            return (
                              <div
                                key={sub.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={!!subSelected}
                                  onChange={() =>
                                    handleSubServiceToggle(service.id, sub.id)
                                  }
                                  className="accent-[#BFA181] w-4 h-4"
                                  id={`subservice-${sub.id}`}
                                />
                                <label
                                  htmlFor={`subservice-${sub.id}`}
                                  className="cursor-pointer text-[#7C5E3C]"
                                >
                                  {sub.name}
                                </label>

                                {/* Optional price */}
                                {subSelected && (
                                  <div className="flex items-center gap-1 ml-auto">
                                    <input
                                      type="number"
                                      min={1}
                                      value={
                                        providerService?.subServices?.find(
                                          (ss) => ss.id === sub.id
                                        )?.price ??
                                        sub.price ??
                                        20
                                      }
                                      onChange={(e) =>
                                        handleSubServicePriceChange(
                                          service.id,
                                          sub.id,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-20 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                                    />
                                    <span className="text-[#BFA181] font-bold">
                                      €/h
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
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
                  saveMsg.includes("success") || saveMsg.includes("updated")
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
                {providerServices?.map((svc) => {
                  console.log("Provider Service:", svc);
                  console.log("Pro:", providerServices);

                  {
                    return (
                      <li
                        key={svc.serviceId}
                        className="bg-[#BFA181] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow"
                      >
                        {services.find((s) => s.id === svc.serviceId)?.name ||
                          "Unknown Service"}
                        
                        {svc.subServices?.some((sub) => sub.price) && (

                          <span className="text-xs text-white bg-[#7C5E3C] rounded px-2 py-0.5 ml-1">
                            {svc.subServices
                              .filter((sub) => sub.price)
                              .map((sub) => `${sub.price} €/h`)
                              .join(", ")}
                          </span>
                        )}
                        <FaCheckCircle className="ml-1 text-white" />
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </div>
        </div>
        {/* Availability Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-[#7C5E3C] mb-4 flex items-center gap-2">
            <span className="inline-block w-7 h-7 bg-[#BFA181] rounded-full flex items-center justify-center text-white">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth={2}
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
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
