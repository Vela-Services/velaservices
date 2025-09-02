import { useState } from "react";
import { Provider, Service, SubService } from "@/types/types";
import { ProviderCard } from "@/components/ProviderCard";
import { useServiceBooking } from "@/app/hooks/useServiceBooking";
import { CartItem } from "@/types/types";
import { indexToDayName } from "../lib/availabilityUtils";

interface ServiceSelectionProps {
  provider: Provider;
  services: Service[];
  addToCart: (item: CartItem) => void;
  onBack: () => void;
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
    handleSubserviceHoursChange,
    availableDates,
    availableStartTimes,
    consecutiveBlocks,
    totalPrice,
    subservicesForCart,
    isCleaningService,
    getRecommendedHours,
  } = useServiceBooking(provider, services);

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
          .filter((service) => provider.services.some((s) => s.serviceId === service.id))
          .map((service) => {
            const providerService = provider.services.find((s) => s.serviceId === service.id);
            const selectedHours = hoursByService[service.id] || 1;
            const selectedDate = dateByService[service.id] || "";
            const selectedTimes = timesByService[service.id] || [];
            const subserviceHours = subserviceHoursByService[service.id] || {};

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
                    openService === service.id ? "max-h-[1200px] mt-3 sm:mt-4" : "max-h-0"
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
                            onChange={(e) => setApartmentSize(Number(e.target.value))}
                            className="w-full sm:w-48 accent-[#BFA181] focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                            aria-valuenow={apartmentSize}
                            aria-valuemin={10}
                            aria-valuemax={140}
                            aria-label="Apartment size in square meters"
                          />
                          <span className="font-semibold text-[#BFA181] text-base" aria-live="polite">
                            {apartmentSize} m²
                          </span>
                        </div>
                        <p className="mt-2 text-[#7C5E3C] text-sm" id={`cleaning-advice-${service.id}`}>
                          <span className="font-medium">Advice:</span> For{" "}
                          <span className="font-bold">{apartmentSize} m²</span>, we recommend{" "}
                          <span className="font-bold">{getRecommendedHours(apartmentSize)} hour{getRecommendedHours(apartmentSize) > 1 ? "s" : ""}</span> of cleaning.
                        </p>
                      </fieldset>
                    )}
                    <fieldset>
                      <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                        Number of hours
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {[...Array(8)].map((_, idx) => {
                          const hour = idx + 1;
                          return (
                            <button
                              key={hour}
                              type="button"
                              className={`px-3 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition ${
                                selectedHours === hour
                                  ? "bg-[#BFA181] text-white border-[#BFA181]"
                                  : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                              }`}
                              onClick={() => handleHoursChange(service.id, hour)}
                              aria-pressed={selectedHours === hour}
                              aria-label={`Select ${hour} hour${hour > 1 ? "s" : ""}`}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                    {service.subServices && service.subServices.length > 0 && providerService?.subServices && (
                      <fieldset className="mt-2 border border-[#E5E7EB] rounded-lg p-4 bg-[#F9F6F1]">
                        <legend className="block text-base font-semibold text-[#7C5E3C] mb-3">
                          Choose Subservices
                        </legend>
                        <div className="flex flex-col gap-4">
                          {service.subServices.map((sub) => {
                            const providerSub = providerService.subServices?.find((psub) => psub.id === sub.id);
                            const subPrice = providerSub?.price ?? 0;
                            const hours = subserviceHours[sub.id] || 0;
                            return (
                              <div
                                key={sub.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-white rounded-md px-3 py-2 shadow-sm border border-[#E5E7EB]"
                              >
                                <div className="flex-1 flex flex-col">
                                  <span className="text-[#7C5E3C] font-medium text-base">{sub.name}</span>
                                  <span className="text-[#7C5E3C] font-medium text-base">{sub.description}</span>
                                  <span className="text-xs text-[#BFA181] mt-1">{subPrice}NOK/h</span>
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
                                      onClick={() => handleSubserviceHoursChange(service.id, sub.id, Math.max(0, hours - 1))}
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
                                        let val = parseInt(e.target.value, 10);
                                        if (isNaN(val) || val < 0) val = 0;
                                        if (val > 8) val = 8;
                                        handleSubserviceHoursChange(service.id, sub.id, val);
                                      }}
                                      className="w-10 text-center bg-transparent border-none text-[#7C5E3C] text-base focus:outline-none"
                                      aria-label={`Hours for ${sub.name}`}
                                    />
                                    <button
                                      type="button"
                                      className="px-2 py-0.5 text-lg text-[#BFA181] font-bold focus:outline-none"
                                      aria-label={`Increase hours for ${sub.name}`}
                                      onClick={() => handleSubserviceHoursChange(service.id, sub.id, Math.min(8, hours + 1))}
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
                          <span className="font-bold">+ / –</span> buttons to quickly adjust hours for each subservice.
                        </div>
                      </fieldset>
                    )}
                    <fieldset>
                      <legend className="block text-base font-medium text-[#7C5E3C] mb-2">
                        Choose a date
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {availableDates(service.id).length === 0 ? (
                          <span className="text-[#BFA181] text-sm" aria-live="polite">
                            No available dates
                          </span>
                        ) : (
                          availableDates(service.id).map((date) => {
                            const isSelected = selectedDate === date;
                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => handleDateChange(service.id, date)}
                                className={`px-3 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition ${
                                  isSelected
                                    ? "bg-[#BFA181] text-white border-[#BFA181]"
                                    : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                                }`}
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
                        Choose a starting time
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {selectedDate && availableStartTimes(service.id).length > 0 ? (
                          availableStartTimes(service.id).map((t) => (
                            <button
                              key={t}
                              type="button"
                              className={`px-4 py-2 rounded-lg border text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition ${
                                selectedTimes.length > 0 && selectedTimes[0] === t
                                  ? "bg-[#BFA181] text-white border-[#BFA181]"
                                  : "bg-white text-[#7C5E3C] border-[#BFA181] hover:bg-[#F5F3EE]"
                              }`}
                              onClick={() => handleTimeSelect(service.id, t)}
                              aria-pressed={selectedTimes.length > 0 && selectedTimes[0] === t}
                              aria-label={`Select starting time ${t}`}
                            >
                              {t}
                              {selectedTimes.length > 0 && selectedTimes[0] === t && (
                                <span className="ml-2 text-xs text-white bg-[#BFA181] rounded px-2 py-0.5">
                                  {selectedTimes.join(", ")}
                                </span>
                              )}
                            </button>
                          ))
                        ) : (
                          <span className="text-[#BFA181] text-sm" aria-live="polite">
                            {selectedDate ? "No available starting times" : "Select a date first"}
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
                      <span className="text-[#7C5E3C] font-semibold text-lg" aria-live="polite">
                        Total: {totalPrice(service.id)}NOK
                      </span>
                      <button
                        type="button"
                        className={`w-full sm:w-auto bg-[#BFA181] text-white py-3 px-6 rounded-lg font-semibold text-base shadow-sm hover:bg-[#A68A64] focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition disabled:opacity-60 disabled:cursor-not-allowed`}
                        onClick={() =>
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
                          })
                        }
                        disabled={
                          !selectedDate ||
                          selectedTimes.length !== selectedHours ||
                          availableStartTimes(service.id).length === 0
                        }
                        aria-disabled={
                          !selectedDate ||
                          selectedTimes.length !== selectedHours ||
                          availableStartTimes(service.id).length === 0
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
        {services.filter((service) => provider.services.some((s) => s.serviceId === service.id)).length === 0 && (
          <div className="text-center text-[#7C5E3C] text-lg">
            This provider does not offer any services.
          </div>
        )}
      </div>
    </div>
  );
}