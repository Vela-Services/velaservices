"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Génère les tranches horaires de 00:00 à 23:30 par pas de 30 min
const hourSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export type Availability = {
  day: string;
  times: string[];
};

type Props = {
  initialAvailability: Availability[];
  onChange: (availability: Availability[]) => void;
};

function getDefaultAvailability() {
  return weekdays.map((day) => ({ day, times: [] }));
}

export default function AvailabilitySelector({
  initialAvailability,
  onChange,
}: Props) {
  // For mobile friendliness, show one day at a time
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // Always keep all days in state for easier "select all/none" etc
  const [availability, setAvailability] = useState<Availability[]>(
    () =>
      initialAvailability && initialAvailability.length === 7
        ? initialAvailability
        : getDefaultAvailability()
  );

  useEffect(() => {
    if (
      initialAvailability &&
      initialAvailability.length === 7 &&
      weekdays.every((d) => initialAvailability.some((a) => a.day === d))
    ) {
      setAvailability(initialAvailability);
    } else {
      setAvailability(getDefaultAvailability());
    }
    // eslint-disable-next-line
  }, [JSON.stringify(initialAvailability)]);

  const toggleTime = (day: string, time: string) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.day === day
          ? {
              ...a,
              times: a.times.includes(time)
                ? a.times.filter((t) => t !== time)
                : [...a.times, time].sort(),
            }
          : a
      )
    );
  };

  const selectAllDay = (day: string) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.day === day ? { ...a, times: [...hourSlots] } : a
      )
    );
  };

  const clearDay = (day: string) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, times: [] } : a))
    );
  };

  useEffect(() => {
    onChange(availability);
  }, [availability, onChange]);

  // Responsive: show all days on desktop, one day at a time on mobile
  return (
    <div>
      {/* Day selector for mobile */}
      <div className="flex sm:hidden mb-4 justify-center items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-full bg-[#F5E8D3] text-[#BFA181] hover:bg-[#BFA181]/20 transition"
          onClick={() =>
            setSelectedDayIdx((idx) => (idx === 0 ? 6 : idx - 1))
          }
          aria-label="Previous day"
        >
          <FaChevronLeft />
        </button>
        <span className="font-semibold text-[#7C5E3C] text-lg">
          {weekdays[selectedDayIdx]}
        </span>
        <button
          type="button"
          className="p-2 rounded-full bg-[#F5E8D3] text-[#BFA181] hover:bg-[#BFA181]/20 transition"
          onClick={() =>
            setSelectedDayIdx((idx) => (idx === 6 ? 0 : idx + 1))
          }
          aria-label="Next day"
        >
          <FaChevronRight />
        </button>
      </div>
      {/* Desktop: show all days, Mobile: show only selected day */}
      <div className="space-y-8">
        {(window?.innerWidth >= 640
          ? weekdays
          : [weekdays[selectedDayIdx]]
        ).map((day) => {
          const dayTimes =
            availability.find((a) => a.day === day)?.times || [];
          const allSelected = dayTimes.length === hourSlots.length;
          const noneSelected = dayTimes.length === 0;
          return (
            <div key={day} className="bg-[#F9F5EF] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#7C5E3C] flex items-center gap-2">
                  {day}
                  {allSelected && (
                    <FaCheckCircle className="text-green-500" title="All selected" />
                  )}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-2 py-1 rounded text-xs font-medium border transition ${
                      allSelected
                        ? "bg-[#BFA181]/20 border-[#BFA181] text-[#BFA181] cursor-not-allowed"
                        : "bg-white border-[#BFA181] text-[#BFA181] hover:bg-[#BFA181]/10"
                    }`}
                    onClick={() => selectAllDay(day)}
                    disabled={allSelected}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded text-xs font-medium border transition ${
                      noneSelected
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#BFA181] text-[#BFA181] hover:bg-[#BFA181]/10"
                    }`}
                    onClick={() => clearDay(day)}
                    disabled={noneSelected}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
                {hourSlots.map((time) => {
                  const selected = dayTimes.includes(time);
                  return (
                    <button
                      type="button"
                      key={time}
                      className={`px-1.5 py-1 rounded-md border text-xs text-center transition
                        ${
                          selected
                            ? "bg-[#BFA181] text-white border-[#BFA181] shadow"
                            : "bg-white border-gray-300 text-[#7C5E3C] hover:bg-[#BFA181]/10"
                        }
                        focus:outline-none focus:ring-2 focus:ring-[#BFA181]/50
                      `}
                      onClick={() => toggleTime(day, time)}
                      aria-pressed={selected}
                      tabIndex={0}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              {/* Show summary of selected times */}
              <div className="mt-2 text-xs text-[#7C5E3C]/70">
                {dayTimes.length === 0
                  ? "No times selected"
                  : dayTimes.length === hourSlots.length
                  ? "All times selected"
                  : `Selected: ${dayTimes.join(", ")}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
