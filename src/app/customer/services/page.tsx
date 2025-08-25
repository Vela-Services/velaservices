"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../../lib/CartContext";
import { onAuthStateChanged, User, UserProfile } from "firebase/auth";
import { ProviderCard } from "@/components/ProviderCard";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { Provider, Service, SubService } from "@/types/types";

// Helper: map day name to 0-6 (Sunday-Saturday)
const dayNameToIndex: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const indexToDayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getProviderAvailableDays(provider: Provider) {
  // Returns array of day indices (0-6) where provider is available
  return provider.availability
    .filter((a) => a.times && a.times.length > 0)
    .map((a) => dayNameToIndex[a.day]);
}

function getProviderAvailableTimesForDate(provider: Provider, dateStr: string) {
  // dateStr: "YYYY-MM-DD"
  if (!dateStr) return [];
  const date = new Date(dateStr + "T00:00:00");
  const dayIdx = date.getDay();
  const dayName = indexToDayName[dayIdx];
  const dayAvail = provider.availability.find((a) => a.day === dayName);
  return dayAvail && dayAvail.times ? dayAvail.times : [];
}

function isDateTimeAtLeast24hFromNow(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return false;
  const now = new Date();
  const selected = new Date(dateStr + "T" + timeStr);
  return selected.getTime() - now.getTime() >= 24 * 60 * 60 * 1000;
}


export default function ServicesPage() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [openService, setOpenService] = useState<string | null>(null);

  // For each service, store selected date
  const [dateByService, setDateByService] = useState<Record<string, string>>(
    {}
  );
  // For each service, store selected times (array of strings, for multi-hour selection)
  const [timesByService, setTimesByService] = useState<
    Record<string, string[]>
  >({});
  // For each service, store selected subservices (array of subservice ids)
  // Deprecated, replaced by subserviceHoursByService
  // const [subservicesByService, setSubservicesByService] = useState<Record<string, string[]>>(
  //   {}
  // );
  // For each service, store selected hours (number)
  const [, setHoursByService] = useState<Record<string, number>>(
    {}
  );

  // For each service, store subservice hours: { [serviceId]: { [subserviceId]: number } }
  const [subserviceHoursByService, setSubserviceHoursByService] = useState<
    Record<string, Record<string, number>>
  >({});

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Apartment size slider help for cleaning service
  // Apartment size options and recommended hours
  const apartmentSizes = [
    { label: "10 m²", value: 10, recommendedHours: 1 },
    { label: "20 m²", value: 20, recommendedHours: 2 },
    { label: "30 m²", value: 30, recommendedHours: 4 },
    { label: "40 m²", value: 40, recommendedHours: 4 },
    { label: "50 m²", value: 50, recommendedHours: 5 },
    { label: "60 m²", value: 60, recommendedHours: 6 },
    { label: "70 m²", value: 70, recommendedHours: 7 },
    { label: "80 m²", value: 80, recommendedHours: 8 },
    { label: "90 m²", value: 90, recommendedHours: 9 },
    { label: "100 m²", value: 100, recommendedHours: 10 },
    { label: "110 m²", value: 110, recommendedHours: 11 },
    { label: "120 m²", value: 120, recommendedHours: 12 },
    { label: "130 m²", value: 130, recommendedHours: 130 },
    { label: "140 m²", value: 140, recommendedHours: 140 },
  ];

  // State for cleaning slider (apartment size)
  const [apartmentSize, setApartmentSize] = useState<number>(40);

  const { addToCart } = useCart();

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
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "provider")
        );
        const snapshot = await getDocs(q);

        const providersData: Provider[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Provider, "id">),
        }));
        console.log("providersData", providersData);

        setProviders(providersData);
      } catch (err) {
        console.error("Error fetching providers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // en haut du composant
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (serviceId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredProviders = providers.filter((provider) => {
    // If no filters are selected, show all providers
    if (selectedFilters.length === 0) return true;

    // If provider has no services, they can't match any filter
    if (!provider.services || provider.services.length === 0) return false;

    if (selectedFilters.length === 1) {
      // Single filter: provider must offer at least this service
      return provider.services.some((s) => s.serviceId === selectedFilters[0]);
    }

    // Multiple filters: provider must offer all checked services
    return selectedFilters.every((f) =>
      provider.services.some((s) => s.serviceId === f)
    );
  });

  const toggleService = (id: string) => {
    setOpenService(openService === id ? null : id);
  };

  // Customer: add to cart
  const handleAddToCart = (
    serviceId: string,
    serviceName: string,
    providerName: string,
    providerEmail: string,
    price: number,
    hours: number,
    selectedTimes: string[],
    subserviceHours: Record<string, number> | undefined
  ) => {
    const date = dateByService[serviceId] || "";
    if (!date || !selectedTimes || selectedTimes.length !== hours) {
      alert(
        `Please choose a date and select exactly ${hours} hour(s) on the calendar`
      );
      return;
    }
    // Check: all times at least 24h in advance
    for (const time of selectedTimes) {
      if (!isDateTimeAtLeast24hFromNow(date, time)) {
        alert("Please select times at least 24 hours from now.");
        return;
      }
    }
    addToCart({
      serviceId,
      serviceName,
      date,
      times: selectedTimes,
      price,
      subservices: subserviceHours, // Now an object: { [subserviceId]: hours }
      providerId: selectedProvider?.id ?? "",
      providerName,
      providerEmail,
    });
    alert("Service added to cart!");
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

  // CUSTOMER UI
  if (profile.role === "customer") {
    // If no provider selected, show provider cards
    if (!selectedProvider) {
      return (
        <div className="min-h-screen bg-[#F5E8D3] py-12 px-4">
          <h1 className="text-3xl font-bold text-center text-[#7C5E3C] mb-10">
            Choose a Provider
          </h1>

          {/* ✅ Filtres */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {services.map((service) => (
              <label key={service.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(service.id)}
                  onChange={() => toggleFilter(service.id)}
                  className="h-4 w-4 text-[#BFA181] border-gray-300 rounded focus:ring-[#BFA181]"
                />
                <span className="text-[#7C5E3C] font-medium">
                  {service.name}
                </span>
              </label>
            ))}
          </div>

          {/* ✅ Liste filtrée */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <button
                  key={provider.id}
                  className="text-left w-full"
                  onClick={() => setSelectedProvider(provider)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  aria-label={`Select provider ${provider.displayName}`}
                >
                  <ProviderCard provider={provider} />
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-[#7C5E3C] text-lg">
                No providers match your filters.
              </div>
            )}
          </div>
        </div>
      );
    }

    // If provider selected, show service selection for that provider
    return (
      <div className="min-h-screen bg-[#F5E8D3] py-12 px-4">
        <button
          className="mb-6 text-[#7C5E3C] underline text-sm"
          onClick={() => {
            setSelectedProvider(null);
            setOpenService(null);
            setDateByService({});
            setTimesByService({});
            // setSubservicesByService({});
            setSubserviceHoursByService({});
            setHoursByService({});
          }}
        >
          ← Back to Providers
        </button>
        <div className="max-w-xl mx-auto mb-8">
          <ProviderCard provider={selectedProvider} />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#7C5E3C] mb-6">
          Choose a Service
        </h2>
        <div className="max-w-3xl mx-auto grid gap-6">
          {services
            .filter((service) =>
              selectedProvider.services.some((s) => s.serviceId === service.id)
            )
            .map((service) => {
              // For this provider, get available days (0-6) and as YYYY-MM-DD for next 30 days
              const today = new Date();
              const availableDayIndices =
                getProviderAvailableDays(selectedProvider);
              // Build list of next 30 days that are available and at least 24h in the future
              const availableDates: string[] = [];
              for (let i = 1; i <= 30; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                const dayIdx = d.getDay();
                if (availableDayIndices.includes(dayIdx)) {
                  // Format YYYY-MM-DD
                  const yyyy = d.getFullYear();
                  const mm = String(d.getMonth() + 1).padStart(2, "0");
                  const dd = String(d.getDate()).padStart(2, "0");
                  availableDates.push(`${yyyy}-${mm}-${dd}`);
                }
              }
              const selectedDate = dateByService[service.id] || "";
              const availableTimes = selectedDate
                ? getProviderAvailableTimesForDate(
                    selectedProvider,
                    selectedDate
                  )
                : [];
              // Only allow times that are at least 24h from now
              let filteredTimes: string[] = [];
              if (selectedDate) {
                filteredTimes = availableTimes.filter((t) => {
                  const now = new Date();
                  const dt = new Date(selectedDate + "T" + t);
                  return dt.getTime() - now.getTime() >= 24 * 60 * 60 * 1000;
                });
              }
              // For each service, allow user to select N timeslots (N = selectedHours)
              const selectedTimes = timesByService[service.id] || [];

              // Subservice hours for this service
              const subserviceHours =
                subserviceHoursByService[service.id] || {};

              // Helper: handle time selection (multi-select for hours)
              // For main service, allow only 1 hour (as before)
              const handleTimeToggle = (time: string) => {
                setTimesByService((prev) => {
                  const prevTimes = prev[service.id] || [];
                  if (prevTimes.includes(time)) {
                    // Remove
                    return {
                      ...prev,
                      [service.id]: prevTimes.filter((t) => t !== time),
                    };
                  } else {
                    // Add, but only up to 1 hour (main service)
                    if (prevTimes.length < 1) {
                      return {
                        ...prev,
                        [service.id]: [...prevTimes, time],
                      };
                    } else {
                      // Replace the first selected time with the new one
                      return {
                        ...prev,
                        [service.id]: [...prevTimes.slice(1), time],
                      };
                    }
                  }
                });
              };

              // Helper: handle subservice hours change
              const handleSubserviceHoursChange = (
                subId: string,
                value: number
              ) => {
                setSubserviceHoursByService((prev) => {
                  const prevForService = prev[service.id] || {};
                  return {
                    ...prev,
                    [service.id]: {
                      ...prevForService,
                      [subId]: value,
                    },
                  };
                });
              };

              // When date changes, reset selected times
              const handleDateChange = (
                e: React.ChangeEvent<HTMLSelectElement>
              ) => {
                setDateByService((prev) => ({
                  ...prev,
                  [service.id]: e.target.value,
                }));
                setTimesByService((prev) => ({
                  ...prev,
                  [service.id]: [],
                }));
              };

              // Price calculation
              // Main service price: 1 hour (as before), but use provider's price
              let totalPrice = 0;
              const providerService = selectedProvider.services.find(
                (s) => s.serviceId === service.id
              );

              // Add subservice prices (from provider's data)
              if (
                service.subServices &&
                service.subServices.length > 0 &&
                providerService &&
                providerService.subServices
              ) {
                for (const sub of service.subServices) {
                  const hours = subserviceHours[sub.id] || 0;
                  // Find provider's price for this subservice
                  const providerSub = providerService.subServices.find(
                    (psub) => psub.id === sub.id
                  );
                  const subPrice = providerSub?.price ?? 0;
                  totalPrice += subPrice * hours;
                }
              }

              // Prepare subservices for cart: only those with hours > 0
              const subservicesForCart: Record<string, number> = {};
              if (
                service.subServices &&
                service.subServices.length > 0 &&
                providerService &&
                providerService.subServices
              ) {
                for (const sub of service.subServices) {
                  const hours = subserviceHours[sub.id] || 0;
                  if (hours > 0) {
                    subservicesForCart[sub.id] = hours;
                  }
                }
              }

              // Helper: get recommended hours for selected size
              const getRecommendedHours = (size: number) => {
                // Find the closest size not greater than selected
                let found = apartmentSizes[0];
                for (let i = 0; i < apartmentSizes.length; i++) {
                  if (size >= apartmentSizes[i].value) {
                    found = apartmentSizes[i];
                  }
                }
                return found.recommendedHours;
              };

              // For cleaning, show slider and advice
              const isCleaningService = service.name
                .toLowerCase()
                .includes("cleaning");

              return (
                <section
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 transition-all"
                  aria-labelledby={`service-title-${service.id}`}
                >
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full flex justify-between items-center py-3 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                    aria-expanded={openService === service.id}
                    aria-controls={`service-panel-${service.id}`}
                  >
                    <span
                      id={`service-title-${service.id}`}
                      className="text-lg sm:text-xl font-semibold text-[#7C5E3C]"
                    >
                      {service.name}
                    </span>
                    <span
                      className="text-[#BFA181] font-bold text-2xl sm:text-xl"
                      aria-hidden="true"
                    >
                      {openService === service.id ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={`service-panel-${service.id}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openService === service.id
                        ? "max-h-[1200px] mt-3 sm:mt-4"
                        : "max-h-0"
                    }`}
                    aria-hidden={openService !== service.id}
                  >
                    <form
                      className="mt-3 sm:mt-4 flex flex-col gap-4"
                      autoComplete="off"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      {/* Cleaning help slider */}
                      {isCleaningService && (
                        <fieldset className="mb-2 sm:mb-4">
                          <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                            Apartment size (m²)
                          </legend>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <input
                              type="range"
                              min={apartmentSizes[0].value}
                              max={
                                apartmentSizes[apartmentSizes.length - 1].value
                              }
                              step={10}
                              value={apartmentSize}
                              onChange={(e) =>
                                setApartmentSize(Number(e.target.value))
                              }
                              className="w-full sm:w-48 accent-[#BFA181] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                              aria-valuenow={apartmentSize}
                              aria-valuemin={apartmentSizes[0].value}
                              aria-valuemax={
                                apartmentSizes[apartmentSizes.length - 1].value
                              }
                              aria-label="Apartment size in square meters"
                            />
                            <span
                              className="font-semibold text-[#BFA181] text-base"
                              aria-live="polite"
                            >
                              {apartmentSize} m²
                            </span>
                          </div>
                          <p
                            className="mt-2 text-[#7C5E3C] text-sm"
                            id={`cleaning-advice-${service.id}`}
                          >
                            <span className="font-medium">Advice:</span> For{" "}
                            <span className="font-bold">
                              {apartmentSize} m²
                            </span>
                            , we recommend{" "}
                            <span className="font-bold">
                              {getRecommendedHours(apartmentSize)} hour
                              {getRecommendedHours(apartmentSize) > 1
                                ? "s"
                                : ""}
                            </span>{" "}
                            of cleaning.
                          </p>
                        </fieldset>
                      )}


                      {service.subServices &&
                        service.subServices.length > 0 &&
                        selectedProvider.services.find(
                          (s) => s.serviceId === service.id
                        )?.subServices && (
                          <fieldset className="mt-2 border border-[#E5E7EB] rounded-lg p-4 bg-[#F9F6F1]">
                            <legend className="block text-base font-semibold text-[#7C5E3C] mb-3">
                              Choose Subservices
                            </legend>

                            <div className="flex flex-col gap-4">
                              {service.subServices.map((sub) => {
                                const providerService =
                                  selectedProvider.services.find(
                                    (s) => s.serviceId === service.id
                                  );
                                const providerSub =
                                  providerService?.subServices?.find(
                                    (psub) => psub.id === sub.id
                                  );
                                const subPrice = providerSub?.price ?? 0;
                                const hours = subserviceHours[sub.id] || 0;

                                return (
                                  <div
                                    key={sub.id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-white rounded-md px-3 py-2 shadow-sm border border-[#E5E7EB]"
                                  >
                                    <div className="flex-1 flex flex-col">
                                      <span className="text-[#7C5E3C] font-medium text-base">
                                        {sub.name}
                                      </span>
                                      <span className="text-[#7C5E3C] font-medium text-base">
                                        {sub.description}
                                      </span>
                                      
                                      <span className="text-xs text-[#BFA181] mt-1">
                                        {subPrice}€/h
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                      <label
                                        htmlFor={`subservice-hours-${service.id}-${sub.id}`}
                                        className="text-[#7C5E3C] text-sm font-medium"
                                      >
                                        Hours:
                                      </label>
                                      <div className="flex items-center border border-[#E5E7EB] rounded px-2 py-1 bg-[#F5E8D3]">
                                        <button
                                          type="button"
                                          className="px-2 py-0.5 text-lg text-[#BFA181] font-bold focus:outline-none"
                                          aria-label={`Decrease hours for ${sub.name}`}
                                          onClick={() =>
                                            handleSubserviceHoursChange(
                                              sub.id,
                                              Math.max(0, hours - 1)
                                            )
                                          }
                                          disabled={hours <= 0}
                                        >
                                          –
                                        </button>
                                        <input
                                          id={`subservice-hours-${service.id}-${sub.id}`}
                                          type="number"
                                          min={0}
                                          max={8}
                                          step={1}
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                          value={hours}
                                          onChange={(e) => {
                                            let val = parseInt(
                                              e.target.value,
                                              10
                                            );
                                            if (isNaN(val) || val < 0) val = 0;
                                            if (val > 8) val = 8;
                                            handleSubserviceHoursChange(
                                              sub.id,
                                              val
                                            );
                                          }}
                                          className="w-10 text-center bg-transparent border-none text-[#7C5E3C] text-base focus:outline-none"
                                          aria-label={`Hours for ${sub.name}`}
                                        />
                                        <button
                                          type="button"
                                          className="px-2 py-0.5 text-lg text-[#BFA181] font-bold focus:outline-none"
                                          aria-label={`Increase hours for ${sub.name}`}
                                          onClick={() =>
                                            handleSubserviceHoursChange(
                                              sub.id,
                                              Math.min(8, hours + 1)
                                            )
                                          }
                                          disabled={hours >= 8}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 text-sm text-[#7C5E3C]">
                              <span className="font-medium">Tip:</span> Use the{" "}
                              <span className="font-bold">+ / –</span> buttons
                              to quickly adjust hours for each subservice.
                            </div>
                          </fieldset>
                        )}

                      <fieldset>
                        <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                          Choose a date
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {availableDates.length === 0 ? (
                            <span className="text-[#BFA181] text-sm" aria-live="polite">
                              No available dates
                            </span>
                          ) : (
                            availableDates.map((date) => {
                              const isSelected = selectedDate === date;
                              return (
                                <button
                                  key={date}
                                  type="button"
                                  onClick={() => handleDateChange({ target: { value: date } } as React.ChangeEvent<HTMLSelectElement>)}
                                  className={`px-3 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition
                                    ${isSelected
                                      ? "bg-[#BFA181] text-white border-[#BFA181]"
                                      : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                                    }
                                  `}
                                  aria-pressed={isSelected}
                                  aria-label={`Select date ${date} (${indexToDayName[new Date(date).getDay()]})`}
                                >
                                  <span className="block font-semibold">{indexToDayName[new Date(date).getDay()]}</span>
                                  <span className="block text-xs">{date}</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                          Choose a time
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {selectedDate && filteredTimes.length > 0 ? (
                            filteredTimes.map((t) => (
                              <button
                                key={t}
                                type="button"
                                className={`px-4 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition ${
                                  selectedTimes.includes(t)
                                    ? "bg-[#BFA181] text-white border-[#BFA181]"
                                    : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                                }`}
                                onClick={() => handleTimeToggle(t)}
                                disabled={
                                  !selectedTimes.includes(t) &&
                                  selectedTimes.length >= 1
                                }
                                aria-pressed={selectedTimes.includes(t)}
                                aria-label={`Select time ${t}`}
                              >
                                {t}
                              </button>
                            ))
                          ) : (
                            <span
                              className="text-[#BFA181] text-sm"
                              aria-live="polite"
                            >
                              {selectedDate
                                ? "No available times"
                                : "Select a date first"}
                            </span>
                          )}
                        </div>
                      </fieldset>

                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-2">
                        <span
                          className="text-[#7C5E3C] font-semibold text-lg"
                          aria-live="polite"
                        >
                          Total: {totalPrice}€
                        </span>
                        <button
                          type="button"
                          className={`w-full sm:w-auto bg-[#BFA181] text-white py-3 px-6 rounded-lg font-semibold text-base shadow-sm hover:bg-[#A68A64] focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition disabled:opacity-60 disabled:cursor-not-allowed`}
                          onClick={() =>
                            handleAddToCart(
                              service.id,
                              service.name,
                              selectedProvider.displayName,
                              selectedProvider.email,
                              totalPrice,
                              1,
                              selectedTimes,
                              subservicesForCart
                            )
                          }
                          disabled={
                            !selectedDate ||
                            selectedTimes.length !== 1 ||
                            filteredTimes.length === 0
                          }
                          aria-disabled={
                            !selectedDate ||
                            selectedTimes.length !== 1 ||
                            filteredTimes.length === 0
                          }
                        >
                          Add to Cart
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              );
            })}
          {services.filter((service) =>
            selectedProvider.services.some((s) => s.serviceId === service.id)
          ).length === 0 && (
            <div className="text-center text-[#7C5E3C] text-lg">
              This provider does not offer any services.
            </div>
          )}
        </div>
      </div>
    );
  }
}
