import { useCallback, useState } from "react";
import { Provider, Service } from "@/types/types";
import {
  getProviderAvailableDays,
  getProviderAvailableTimesForDate,
  isDateTimeAtLeast24hFromNow,
  getConsecutiveAvailableSlots,
} from "../../lib/availabilityUtils";

import { getProviderSlotsWithPending } from "./usePendingSlots";

export function useServiceBooking(provider: Provider, services: Service[]) {
  const [openService, setOpenService] = useState<string | null>(null);
  const [dateByService, setDateByService] = useState<Record<string, string>>(
    {}
  );
  const [timesByService, setTimesByService] = useState<
    Record<string, string[]>
  >({});
  const [hoursByService, setHoursByService] = useState<Record<string, number>>(
    {}
  );
  const [subserviceHoursByService, setSubserviceHoursByService] = useState<
    Record<string, Record<string, number>>
  >({});
  const [apartmentSize, setApartmentSize] = useState<number>(40);

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
    { label: "130 m²", value: 130, recommendedHours: 13 },
    { label: "140 m²", value: 140, recommendedHours: 14 },
  ];

  const toggleService = (id: string) => {
    setOpenService(openService === id ? null : id);
  };

  const getTotalHours = useCallback((serviceId: string) => {
    const subserviceHours = subserviceHoursByService[serviceId] || {};
    
    // Somme de toutes les heures des sous-services
    const totalSubserviceHours = Object.values(subserviceHours).reduce(
      (sum: number, hours: number) => sum + hours,
      0
    );
    return totalSubserviceHours;
  }, [subserviceHoursByService]); // ✅ Dépendance

  const handleDateChange = (serviceId: string, date: string) => {
    setDateByService((prev) => ({ ...prev, [serviceId]: date }));
    setTimesByService((prev) => ({ ...prev, [serviceId]: [] }));
  };

  const handleHoursChange = (
    serviceId: string,
    subId: string | null,
    hours: number
  ) => {
    if (subId) {
      // Sous-service
      setSubserviceHoursByService((prev) => {
        const prevForService = prev[serviceId] || {};
        return {
          ...prev,
          [serviceId]: { ...prevForService, [subId]: hours },
        };
      });
    } else {
      // Service principal
      setHoursByService((prev) => ({ ...prev, [serviceId]: hours }));
    }

    // Reset date et times quand on change les heures
    setTimesByService((prev) => ({ ...prev, [serviceId]: [] }));
    setDateByService((prev) => ({ ...prev, [serviceId]: "" }));
  };

  const handleTimeSelect = async (serviceId: string, startTime: string) => {
    const selectedDate = dateByService[serviceId] || "";
    const totalHours = getTotalHours(serviceId); // Utilisez le total au lieu de hoursByService[serviceId]

    const allTimes = getProviderAvailableTimesForDate(provider, selectedDate);
    const filteredTimes = allTimes.filter((t) =>
      isDateTimeAtLeast24hFromNow(selectedDate, t)
    );

    const bookedTimes = await getProviderSlotsWithPending(
      provider.id,
      selectedDate
    );
    const consecutiveBlocks = getConsecutiveAvailableSlots(
      filteredTimes,
      bookedTimes,
      totalHours // Utilisez totalHours ici
    );

    const block = consecutiveBlocks.find((b) => b[0] === startTime);
    if (block) {
      setTimesByService((prev) => ({ ...prev, [serviceId]: block }));
    } else {
      console.warn(
        "No available block found for",
        totalHours,
        "hours starting at",
        startTime
      );
    }
  };

  const availableDates = useCallback(
    async (serviceId: string) => {
      const today = new Date();
      const availableDayIndices = getProviderAvailableDays(provider);
      const selectedHours = getTotalHours(serviceId); // CORRECTION

      // Generate next 30 days, skipping today
      const dateCandidates: string[] = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i + 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      });

      // Filter by provider's available days
      const validDates = dateCandidates.filter((dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        return availableDayIndices.includes(d.getDay());
      });

      // For each valid date, check if there are available time blocks
      const results = await Promise.all(
        validDates.map(async (dateStr) => {
          const allTimes = getProviderAvailableTimesForDate(provider, dateStr);
          const filteredTimes = allTimes.filter((t) =>
            isDateTimeAtLeast24hFromNow(dateStr, t)
          );
          if (filteredTimes.length === 0) return null;

          const bookedTimes = await getProviderSlotsWithPending(
            provider.id,
            dateStr
          );
          const blocks = getConsecutiveAvailableSlots(
            filteredTimes,
            bookedTimes,
            selectedHours
          );
          return blocks.length > 0 ? dateStr : null;
        })
      );

      // Remove nulls and return
      return results.filter((d): d is string => Boolean(d));
    },
    [provider, getTotalHours]
  );

  const availableStartTimes = useCallback(
    async (serviceId: string) => {
      const selectedDate = dateByService[serviceId] || "";
      const selectedHours = getTotalHours(serviceId); // CORRECTION
      if (!selectedDate) return [];
      const allTimes = getProviderAvailableTimesForDate(provider, selectedDate);
      const filteredTimes = allTimes.filter((t) =>
        isDateTimeAtLeast24hFromNow(selectedDate, t)
      );

      // ✅ booked + pending
      const bookedTimes = await getProviderSlotsWithPending(
        provider.id,
        selectedDate
      );
      const consecutiveBlocks = getConsecutiveAvailableSlots(
        filteredTimes,
        bookedTimes,
        selectedHours
      );
      return consecutiveBlocks.map((block) => block[0]);
    },
    [provider, dateByService, getTotalHours]
  ); // Dépendances stables

  const consecutiveBlocks = async (serviceId: string) => {
    const selectedDate = dateByService[serviceId] || "";
    const selectedHours = getTotalHours(serviceId); // CORRECTION
    if (!selectedDate) return [];
    const allTimes = getProviderAvailableTimesForDate(provider, selectedDate);
    const filteredTimes = allTimes.filter((t) =>
      isDateTimeAtLeast24hFromNow(selectedDate, t)
    );

    // ✅ booked + pending
    const bookedTimes = await getProviderSlotsWithPending(
      provider.id,
      selectedDate
    );

    return getConsecutiveAvailableSlots(
      filteredTimes,
      bookedTimes,
      selectedHours
    );
  };

  const totalPrice = (serviceId: string) => {
    const providerService = provider.services.find(
      (s) => s.serviceId === serviceId
    );
    const subserviceHours = subserviceHoursByService[serviceId] || {};
    let total = 0;
    const service = services.find((s) => s.id === serviceId);
    if (service?.subServices && providerService?.subServices) {
      for (const sub of service.subServices) {
        const hours = subserviceHours[sub.id] || 0;
        const providerSub = providerService.subServices.find(
          (psub) => psub.id === sub.id
        );
        const subTotal = (providerSub?.price ?? 0) * hours;
        total += subTotal;
      }
    }
    return total;
  };

  const subservicesForCart = (serviceId: string) => {
    const subserviceHours = subserviceHoursByService[serviceId] || {};
    const service = services.find((s) => s.id === serviceId);
    const result: Record<string, number> = {};
    if (service?.subServices) {
      for (const sub of service.subServices) {
        const hours = subserviceHours[sub.id] || 0;
        if (hours > 0) {
          result[sub.id] = hours;
        }
      }
    }
    return result;
  };

  const isCleaningService = (service: Service) =>
    service.name.toLowerCase().includes("cleaning");

  const getRecommendedHours = (size: number) => {
    let found = apartmentSizes[0];
    for (const sizeOption of apartmentSizes) {
      if (size >= sizeOption.value) {
        found = sizeOption;
      }
    }
    return found.recommendedHours;
  };

  return {
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
    availableDates,
    availableStartTimes,
    consecutiveBlocks,
    totalPrice,
    subservicesForCart,
    isCleaningService,
    getRecommendedHours,
  };
}
