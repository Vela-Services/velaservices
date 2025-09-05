import { useEffect, useState } from "react";
import { Provider, Service } from "@/types/types";
import { ProviderCard } from "@/components/ProviderCard";
import { useServiceBooking } from "@/app/hooks/useServiceBooking";
import { CartItem } from "@/types/types";
import { indexToDayName } from "../lib/availabilityUtils";
import { Loader2 } from "lucide-react"; // spinner

import { useAuth } from "../lib/useAuth";

import { addPendingSlot } from "../app/hooks/usePendingSlots";

interface ServiceSelectionProps {
  provider: Provider;
  services: Service[];
  addToCart: (item: CartItem) => void;
  onBack: () => void;
}
// Simple spinner component
function Spinner() {
  return (
    <span
      className="inline-block w-6 h-6 border-2 border-[#BFA181] border-t-transparent rounded-full animate-spin align-middle"
      role="status"
      aria-label="Loading"
    />
  );
}

export default function ServiceSelection({
  provider,
  services,
  addToCart,
  onBack,
}: ServiceSelectionProps) {
  const {
    openService,
    toggleService,
    dateByService,
    timesByService,
    hoursByService,
    subserviceHoursByService,
    apartmentSize,
    setApartmentSize,
    handleDateChange,
    handleHoursChange,
    handleTimeSelect,
    availableDates, // async (Promise<string[]>)
    availableStartTimes, // async (Promise<string[]>)
    totalPrice,
    subservicesForCart,
    isCleaningService,
    getRecommendedHours,
  } = useServiceBooking(provider, services);

  const { user } = useAuth();

  // ---------- Dates (async) ----------
  const [datesByService, setDatesByService] = useState<
    Record<string, string[]>
  >({});
  const [loadingDates, setLoadingDates] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingDates(true);
      try {
        const newDates: Record<string, string[]> = {};
        await Promise.all(
          services.map(async (service) => {
            const dates = await availableDates(service.id);
            newDates[service.id] = dates;
          })
        );
        if (!cancelled) setDatesByService(newDates);
      } finally {
        if (!cancelled) setLoadingDates(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [services, hoursByService, availableDates]);

  // ---------- Start times (async, par service) ----------
  const [startTimesByService, setStartTimesByService] = useState<
    Record<string, string[]>
  >({});
  const [loadingStartTimesByService, setLoadingStartTimesByService] = useState<
    Record<string, boolean>
  >({});

  // Charge les start times pour chaque service qui a une date sélectionnée
  useEffect(() => {
    let cancelled = false;

    // Marque en "loading" les services qui ont une date sélectionnée
    const loadingFlags: Record<string, boolean> = {};
    services.forEach((s) => {
      if (dateByService[s.id]) loadingFlags[s.id] = true;
    });
    setLoadingStartTimesByService((prev) => ({ ...prev, ...loadingFlags }));

    (async () => {
      const results: Record<string, string[]> = {};

      await Promise.all(
        services.map(async (s) => {
          const selectedDate = dateByService[s.id];
          if (!selectedDate) {
            results[s.id] = [];
            return;
          }
          try {
            const times = await availableStartTimes(s.id);
            results[s.id] = times;
          } catch {
            results[s.id] = [];
          }
        })
      );

      if (!cancelled) {
        setStartTimesByService((prev) => ({ ...prev, ...results }));
        // Désactive loading pour ceux concernés
        const stopFlags: Record<string, boolean> = {};
        services.forEach((s) => {
          if (dateByService[s.id]) stopFlags[s.id] = false;
        });
        setLoadingStartTimesByService((prev) => ({ ...prev, ...stopFlags }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [services, dateByService, hoursByService, availableStartTimes]);

  return (
    <div className="min-h-screen bg-[#F5E8D3] py-12 px-4">
      <button
        className="mb-6 text-[#7C5E3C] underline text-sm"
        onClick={onBack}
      >
        ← Back to Providers
      </button>

      <div className="max-w-xl mx-auto mb-8">
        <ProviderCard provider={provider} />
      </div>

      <h2 className="text-2xl font-bold text-center text-[#7C5E3C] mb-6">
        Choose a Service
      </h2>

      <div className="max-w-3xl mx-auto grid gap-6">
        {services
          .filter((service) =>
            provider.services.some((s) => s.serviceId === service.id)
          )
          .map((service) => {
            const providerService = provider.services.find(
              (s) => s.serviceId === service.id
            );
            const selectedDate = dateByService[service.id] || "";
            const selectedTimes = timesByService[service.id] || [];
            const subserviceHours = subserviceHoursByService[service.id] || {};
            console.log(services, "services");

            const startTimes = startTimesByService[service.id] || [];
            const isLoadingStart = !!loadingStartTimesByService[service.id];

            return (
              <section
                key={service.id}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 transition-all"
                aria-labelledby={`service-title-${service.id}`}
              >
                <div className="relative">
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full flex justify-between items-center py-3 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                    aria-expanded={openService === service.id}
                    aria-controls={`service-panel-${service.id}`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        id={`service-title-${service.id}`}
                        className="text-lg sm:text-xl font-semibold text-[#7C5E3C]"
                      >
                        {service.name}
                      </span>
                      {service.description && (
                        <span className="relative inline-flex items-center">
                          <span className="relative group">
                            {/* Info button */}
                            <span
                              tabIndex={0}
                              role="button"
                              aria-label={`Service description for ${service.name}`}
                              className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFF7E6] border border-[#8B4513]/70 text-[#8B4513] text-[12px] font-bold hover:bg-[#FFE4B5] focus:bg-[#FFE4B5] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] cursor-pointer transition-colors duration-150 z-20"
                            >
                              i
                            </span>
                            {/* Tooltip */}
                            <div className="absolute left-0 top-full mt-2 w-64 max-w-[80vw] bg-white border border-[#8B4513]/40 rounded-lg shadow-lg p-3 text-sm text-[#4A3728] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 z-30 sm:left-1/2 sm:-translate-x-1/2">
                              {service.description}
                            </div>
                          </span>
                        </span>
                      )}
                    </span>
                    <span
                      className="text-[#BFA181] font-bold text-2xl sm:text-xl"
                      aria-hidden="true"
                    >
                      {openService === service.id ? "−" : "+"}
                    </span>
                  </button>
                </div>

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
                    {isCleaningService(service) && (
                      <fieldset className="mb-2 sm:mb-4">
                        <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                          Apartment size (m²)
                        </legend>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <input
                            type="range"
                            min={10}
                            max={140}
                            step={10}
                            value={apartmentSize}
                            onChange={(e) =>
                              setApartmentSize(Number(e.target.value))
                            }
                            className="w-full sm:w-48 accent-[#BFA181] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                            aria-valuenow={apartmentSize}
                            aria-valuemin={10}
                            aria-valuemax={140}
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
                          <span className="font-bold">{apartmentSize} m²</span>,
                          we recommend{" "}
                          <span className="font-bold">
                            {getRecommendedHours(apartmentSize)} hour
                            {getRecommendedHours(apartmentSize) > 1 ? "s" : ""}
                          </span>{" "}
                          of cleaning.
                        </p>
                      </fieldset>
                    )}

                    {service.subServices &&
                      service.subServices.length > 0 &&
                      providerService?.subServices && (
                        <fieldset className="mt-2 border border-[#E5E7EB] rounded-lg p-4 bg-[#F9F6F1]">
                          <legend className="block text-base font-semibold text-[#7C5E3C] mb-3">
                            Choose Subservices
                          </legend>
                          <div className="flex flex-col gap-4">
                            {service.subServices.map((sub) => {
                              const providerSub =
                                providerService.subServices?.find(
                                  (psub) => psub.id === sub.id
                                );
                              const subPrice = providerSub?.price ?? 0;
                              const subHours = subserviceHours[sub.id] || 0;

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
                                      {subPrice} NOK/h
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <label
                                      htmlFor={`subservice-hours-${service.id}-${sub.id}`}
                                      className="text-[#7C5E3C] text-sm font-medium"
                                    >
                                      Hours:
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        className="px-3 py-2 rounded-lg border text-base font-bold text-[#BFA181] bg-[#F5E8D3] hover:bg-[#EAD7B7] focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                                        aria-label="Decrease number of hours"
                                        onClick={() =>
                                          handleHoursChange(
                                            service.id,
                                            sub.id,
                                            Math.max(0, subHours - 1)
                                          )
                                        }
                                        disabled={subHours <= 0}
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
                                        value={subHours}
                                        onChange={(e) => {
                                          let val = parseInt(
                                            e.target.value,
                                            10
                                          );
                                          if (isNaN(val) || val < 0) val = 0;
                                          if (val > 8) val = 8;
                                          handleHoursChange(
                                            service.id,
                                            sub.id,
                                            val
                                          );
                                        }}
                                        className="w-14 text-center bg-white border border-[#E5E7EB] rounded text-[#7C5E3C] text-base font-semibold focus:outline-none"
                                        aria-label="Number of hours for subservice"
                                      />
                                      <button
                                        type="button"
                                        className="px-3 py-2 rounded-lg border text-base font-bold text-[#BFA181] bg-[#F5E8D3] hover:bg-[#EAD7B7] focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                                        aria-label="Increase number of hours"
                                        onClick={() =>
                                          handleHoursChange(
                                            service.id,
                                            sub.id,
                                            Math.min(8, subHours + 1)
                                          )
                                        }
                                        disabled={subHours >= 8}
                                      >
                                        +
                                      </button>
                                      <span className="ml-2 text-[#7C5E3C] font-medium">
                                        {subHours} hour{subHours > 1 ? "s" : ""}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </fieldset>
                      )}

                    {/* Dates */}
                    <fieldset>
                      <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                        Choose a date
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {loadingDates ? (
                          <span
                            className="flex items-center gap-2 text-[#BFA181] text-sm"
                            aria-live="polite"
                          >
                            <Spinner /> Loading available dates...
                          </span>
                        ) : !datesByService[service.id] ||
                          datesByService[service.id].length === 0 ? (
                          <span
                            className="text-[#BFA181] text-sm"
                            aria-live="polite"
                          >
                            No available dates
                          </span>
                        ) : (
                          datesByService[service.id].map((date) => {
                            const isSelected = selectedDate === date;
                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => {
                                  // Reset et charge les times pour ce service
                                  handleDateChange(service.id, date);
                                  setStartTimesByService((prev) => ({
                                    ...prev,
                                    [service.id]: [],
                                  }));
                                  setLoadingStartTimesByService((prev) => ({
                                    ...prev,
                                    [service.id]: true,
                                  }));
                                }}
                                className={`px-3 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition ${
                                  isSelected
                                    ? "bg-[#BFA181] text-white border-[#BFA181]"
                                    : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                                }`}
                                aria-pressed={isSelected}
                                aria-label={`Select date ${date} (${
                                  indexToDayName[new Date(date).getDay()]
                                })`}
                              >
                                <span className="block font-semibold">
                                  {indexToDayName[new Date(date).getDay()]}
                                </span>
                                <span className="block text-xs">{date}</span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </fieldset>

                    {/* Start times */}
                    <fieldset>
                      <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                        Choose a starting time
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {isLoadingStart ? (
                          <div className="flex items-center gap-2 text-[#BFA181]">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading times...</span>
                          </div>
                        ) : selectedDate && startTimes.length > 0 ? (
                          startTimes.map((t) => (
                            <button
                              key={t}
                              type="button"
                              className={`px-4 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition ${
                                selectedTimes.length > 0 &&
                                selectedTimes[0] === t
                                  ? "bg-[#BFA181] text-white border-[#BFA181]"
                                  : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                              }`}
                              onClick={() => handleTimeSelect(service.id, t)}
                              aria-pressed={
                                selectedTimes.length > 0 &&
                                selectedTimes[0] === t
                              }
                              aria-label={`Select starting time ${t}`}
                            >
                              {t}
                              {selectedTimes.length > 0 &&
                                selectedTimes[0] === t && (
                                  <span className="ml-2 text-xs text-white bg-[#BFA181] rounded px-2 py-0.5">
                                    {selectedTimes.join(", ")}
                                  </span>
                                )}
                            </button>
                          ))
                        ) : (
                          <span
                            className="text-[#BFA181] text-sm"
                            aria-live="polite"
                          >
                            {selectedDate
                              ? "No available starting times"
                              : "Select a date first"}
                          </span>
                        )}
                      </div>
                      {selectedTimes.length > 0 && (
                        <div className="mt-2 text-[#7C5E3C] text-sm">
                          Selected: {selectedTimes.join(", ")}
                        </div>
                      )}
                    </fieldset>

                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-2">
                      <span
                        className="text-[#7C5E3C] font-semibold text-lg"
                        aria-live="polite"
                      >
                        Total: {totalPrice(service.id)}NOK
                      </span>
                      <button
                        type="button"
                        className="w-full sm:w-auto bg-[#BFA181] text-white py-3 px-6 rounded-lg font-semibold text-base shadow-sm hover:bg-[#A68A64] focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => {
                          addToCart({
                            id: "",
                            serviceId: service.id,
                            serviceName: service.name,
                            date: selectedDate,
                            times: selectedTimes,
                            price: totalPrice(service.id),
                            subservices: subservicesForCart(service.id),
                            providerId: provider.id,
                            providerName: provider.displayName,
                            providerEmail: provider.email,
                          });
                          if (
                            user?.uid &&
                            provider.id &&
                            service.id &&
                            selectedDate &&
                            selectedTimes.length > 0
                          ) {
                            addPendingSlot(
                              user.uid,
                              provider.id,
                              service.id,
                              selectedDate,
                              selectedTimes
                            );
                          }
                        }}
                        disabled={
                          !selectedDate ||
                          selectedTimes.length === 0 ||
                          (startTimesByService[service.id]?.length ?? 0) === 0
                        }
                        aria-disabled={
                          !selectedDate ||
                          selectedTimes.length === 0 ||
                          (startTimesByService[service.id]?.length ?? 0) === 0
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
          provider.services.some((s) => s.serviceId === service.id)
        ).length === 0 && (
          <div className="text-center text-[#7C5E3C] text-lg">
            This provider does not offer any services.
          </div>
        )}
      </div>
    </div>
  );
}
