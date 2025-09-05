import { CalendarDays } from "lucide-react";
import { Provider } from "@/types/types";
import { COLORS } from "@/lib/color";

interface AvailabilityInfoProps {
  provider: Provider;
  dayLabel: (day: string) => string;
}

export default function AvailabilityInfo({ provider, dayLabel }: AvailabilityInfoProps) {
  return (
    <section className="flex flex-col" aria-label="Availability">
      <h3
        className={`flex items-center gap-2 mb-4 text-base font-semibold ${COLORS.headerText} tracking-tight`}
      >
        <CalendarDays className="h-6 w-6 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
        <span>Availability</span>
      </h3>
      <div className="text-sm space-y-2 max-h-40 overflow-y-auto pr-2">
        {(!provider.availability || provider.availability.length === 0) ? (
          <p className="text-sm text-[#999999] italic text-center py-4">
            No availability listed
          </p>
        ) : (
          provider.availability.map((a) => (
            <div
              key={a.day}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                a.times.length > 0
                  ? `bg-[#366760]/5 border ${COLORS.availableBorder} hover:bg-[#A8D5BA]/10 focus:bg-[#A8D5BA]/10`
                  : "bg-gray-50 border border-[#366760]/20"
              } transition-colors cursor-pointer`}
              aria-label={`Availability for ${dayLabel(a.day)}`}
              tabIndex={0}
              role="button"
            >
              <span className={`font-medium ${COLORS.headerText} w-24 flex-shrink-0`}>
                {dayLabel(a.day)}:
              </span>
              {a.times.length > 0 ? (
                <span className={`font-semibold ${COLORS.available} break-words text-right`}>
                  {a.times.join(", ")}
                </span>
              ) : (
                <span className={`italic ${COLORS.unavailable} text-right`}>
                  Unavailable
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex items-center gap-6 text-xs text-[#666666]">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#366760] align-middle" aria-hidden="true"></span>
          <span className="align-middle">Available</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#CC4B37] align-middle" aria-hidden="true"></span>
          <span className="align-middle">Unavailable</span>
        </span>
      </div>
    </section>
  );
}