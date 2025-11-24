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
  const [isDesktop, setIsDesktop] = useState(false);

  // Always keep all days in state for easier "select all/none" etc
  const [availability, setAvailability] = useState<Availability[]>(
    () =>
      initialAvailability && initialAvailability.length === 7
        ? initialAvailability
        : getDefaultAvailability()
  );

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

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

  const daysToShow = isDesktop ? weekdays : [weekdays[selectedDayIdx]];

  return (
    <div>
      {/* Day selector for mobile */}
      {!isDesktop && (
        <div className="flex mb-4 justify-center items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-lg bg-[#F5E8D3] text-[#BFA181] hover:bg-[#BFA181]/20 transition"
            onClick={() =>
              setSelectedDayIdx((idx) => (idx === 0 ? 6 : idx - 1))
            }
            aria-label="Previous day"
          >
            <FaChevronLeft />
          </button>
          <span className="font-semibold text-[#7C5E3C] text-base px-4">
            {weekdays[selectedDayIdx]}
          </span>
          <button
            type="button"
            className="p-2 rounded-lg bg-[#F5E8D3] text-[#BFA181] hover:bg-[#BFA181]/20 transition"
            onClick={() =>
              setSelectedDayIdx((idx) => (idx === 6 ? 0 : idx + 1))
            }
            aria-label="Next day"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Days grid */}
      <div className="space-y-2">
        {daysToShow.map((day) => {
          const dayTimes =
            availability.find((a) => a.day === day)?.times || [];
          const allSelected = dayTimes.length === hourSlots.length;
          const noneSelected = dayTimes.length === 0;
          return (
            <div key={day} className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-semibold text-[#7C5E3C] flex items-center gap-1.5 truncate">
                  <span className="truncate">{day}</span>
                  {allSelected && (
                    <FaCheckCircle className="text-green-500 flex-shrink-0 w-3.5 h-3.5" title="All selected" />
                  )}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition whitespace-nowrap ${
                      allSelected
                        ? "bg-[#BFA181]/20 border-[#BFA181] text-[#BFA181] cursor-not-allowed opacity-50"
                        : "bg-white border-[#BFA181] text-[#BFA181] hover:bg-[#BFA181]/10"
                    }`}
                    onClick={() => selectAllDay(day)}
                    disabled={allSelected}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition whitespace-nowrap ${
                      noneSelected
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                        : "bg-white border-[#BFA181] text-[#BFA181] hover:bg-[#BFA181]/10"
                    }`}
                    onClick={() => clearDay(day)}
                    disabled={noneSelected}
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {/* Time slots grid - 4 columns for narrow sidebar, ensures 12 rows of 4 */}
              <div className="grid grid-cols-4 gap-1">
                {hourSlots.map((time) => {
                  const selected = dayTimes.includes(time);
                  return (
                    <button
                      type="button"
                      key={time}
                      className={`px-1 py-1.5 rounded border text-[11px] font-medium text-center transition-all duration-150 w-full min-h-[28px] flex items-center justify-center
                        ${
                          selected
                            ? "bg-[#BFA181] text-white border-[#BFA181] shadow-sm"
                            : "bg-white border-gray-300 text-[#7C5E3C] hover:bg-[#BFA181]/10 hover:border-[#BFA181]/50"
                        }
                        focus:outline-none focus:ring-1 focus:ring-[#BFA181]/50
                      `}
                      onClick={() => toggleTime(day, time)}
                      aria-pressed={selected}
                      tabIndex={0}
                      title={time}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              
              {/* Show summary of selected times - Compact */}
              <div className="mt-1.5 text-[10px] text-[#7C5E3C]/70">
                {dayTimes.length === 0
                  ? "No times selected"
                  : dayTimes.length === hourSlots.length
                  ? "All times selected"
                  : `${dayTimes.length} time${dayTimes.length === 1 ? '' : 's'} selected`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
