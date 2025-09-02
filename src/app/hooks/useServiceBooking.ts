import { useState } from "react";
import { Provider, Service, SubService } from "@/types/types";
import {
  getProviderAvailableDays,
  getProviderAvailableTimesForDate,
  isDateTimeAtLeast24hFromNow,
  getProviderBookedSlots,
  getConsecutiveAvailableSlots,
  indexToDayName,
} from "../../lib/availabilityUtils";

export function useServiceBooking(provider: Provider, services: Service[]) {
  const [openService, setOpenService] = useState<string | null>(null);
  const [dateByService, setDateByService] = useState<Record<string, string>>({});
  const [timesByService, setTimesByService] = useState<Record<string, string[]>>({});
  const [hoursByService, setHoursByService] = useState<Record<string, number>>({});
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

  const handleDateChange = (serviceId: string, date: string) => {
    setDateByService((prev) => ({ ...prev, [serviceId]: date }));
    setTimesByService((prev) => ({ ...prev, [serviceId]: [] }));
  };

  const handleHoursChange = (serviceId: string, hours: number) => {
    setHoursByService((prev) => ({ ...prev, [serviceId]: hours }));
    setTimesByService((prev) => ({ ...prev, [serviceId]: [] }));
    setDateByService((prev) => ({ ...prev, [serviceId]: "" }));
  };

  const handleTimeSelect = (serviceId: string, startTime: string) => {
    const selectedDate = dateByService[serviceId] || "";
    const selectedHours = hoursByService[serviceId] || 1;
    const allTimes = getProviderAvailableTimesForDate(provider, selectedDate);
    const filteredTimes = allTimes.filter((t) =>
      isDateTimeAtLeast24hFromNow(selectedDate, t)
    );
    const bookedTimes = getProviderBookedSlots(provider.id, selectedDate);
    const consecutiveBlocks = getConsecutiveAvailableSlots(
      filteredTimes,
      bookedTimes,
      selectedHours
    );
    const block = consecutiveBlocks.find((b) => b[0] === startTime);
    if (block) {
      setTimesByService((prev) => ({ ...prev, [serviceId]: block }));
    }
  };

  const handleSubserviceHoursChange = (serviceId: string, subId: string, value: number) => {
    setSubserviceHoursByService((prev) => {
      const prevForService = prev[serviceId] || {};
      return {
        ...prev,
        [serviceId]: { ...prevForService, [subId]: value },
      };
    });
  };

  const availableDates = (serviceId: string) => {
    const today = new Date();
    const availableDayIndices = getProviderAvailableDays(provider);
    const selectedHours = hoursByService[serviceId] || 1;
    const dates: string[] = [];
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayIdx = d.getDay();
      if (availableDayIndices.includes(dayIdx)) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const allTimes = getProviderAvailableTimesForDate(provider, dateStr);
        const filteredTimes = allTimes.filter((t) =>
          isDateTimeAtLeast24hFromNow(dateStr, t)
        );
        const bookedTimes = getProviderBookedSlots(provider.id, dateStr);
        const blocks = getConsecutiveAvailableSlots(filteredTimes, bookedTimes, selectedHours);
        if (blocks.length > 0) {
          dates.push(dateStr);
        }
      }
    }
    return dates;
  };

  const availableStartTimes = (serviceId: string) => {
    const selectedDate = dateByService[serviceId] || "";
    const selectedHours = hoursByService[serviceId] || 1;
    if (!selectedDate) return [];
    const allTimes = getProviderAvailableTimesForDate(provider, selectedDate);
    const filteredTimes = allTimes.filter((t) =>
      isDateTimeAtLeast24hFromNow(selectedDate, t)
    );
    const bookedTimes = getProviderBookedSlots(provider.id, selectedDate);
    const consecutiveBlocks = getConsecutiveAvailableSlots(filteredTimes, bookedTimes, selectedHours);
    return consecutiveBlocks.map((block) => block[0]);
  };

  const consecutiveBlocks = (serviceId: string) => {
    const selectedDate = dateByService[serviceId] || "";
    const selectedHours = hoursByService[serviceId] || 1;
    if (!selectedDate) return [];
    const allTimes = getProviderAvailableTimesForDate(provider, selectedDate);
    const filteredTimes = allTimes.filter((t) =>
      isDateTimeAtLeast24hFromNow(selectedDate, t)
    );
    const bookedTimes = getProviderBookedSlots(provider.id, selectedDate);
    return getConsecutiveAvailableSlots(filteredTimes, bookedTimes, selectedHours);
  };

  const totalPrice = (serviceId: string) => {
    const providerService = provider.services.find((s) => s.serviceId === serviceId);
    const selectedHours = hoursByService[serviceId] || 1;
    const subserviceHours = subserviceHoursByService[serviceId] || {};
    let total = 0;
    if (providerService) {
      total += (providerService.price ?? 0) * selectedHours;
    }
    const service = services.find((s) => s.id === serviceId);
    if (service?.subServices && providerService?.subServices) {
      for (const sub of service.subServices) {
        const hours = subserviceHours[sub.id] || 0;
        const providerSub = providerService.subServices.find((psub) => psub.id === sub.id);
        total += (providerSub?.price ?? 0) * hours;
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

  const isCleaningService = (service: Service) => service.name.toLowerCase().includes("cleaning");

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
    handleSubserviceHoursChange,
    availableDates,
    availableStartTimes,
    consecutiveBlocks,
    totalPrice,
    subservicesForCart,
    isCleaningService,
    getRecommendedHours,
  };
}