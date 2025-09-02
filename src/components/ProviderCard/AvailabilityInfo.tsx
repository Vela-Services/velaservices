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
        className={`text-sm font-semibold flex items-center gap-2 mb-3 ${COLORS.headerText} tracking-tight`}
      >
        <CalendarDays className="h-5 w-5 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
        <span>Availability</span>
      </h3>
      <div className="text-xs space-y-1.5 max-h-28 overflow-y-auto pr-2">
        {(!provider.availability || provider.availability.length === 0) ? (
          <span className="italic text-[#999999]">
            No availability listed
          </span>
        ) : (
          provider.availability.map((a) => (
            <div
              key={a.day}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg ${
                a.times.length > 0
                  ? `${COLORS.availableBg} border ${COLORS.availableBorder} hover:bg-[#A8D5BA]/20`
                  : "border border-[#366760]/30"
              } transition-colors`}
              aria-label={`Availability for ${dayLabel(a.day)}`}
            >
              <span className={`font-medium ${COLORS.headerText} w-20 flex-shrink-0`}>
                {dayLabel(a.day)}:
              </span>
              {a.times.length > 0 ? (
                <span className={`font-semibold ${COLORS.available} break-words`}>
                  {a.times.join(", ")}
                </span>
              ) : (
                <span className={`italic ${COLORS.unavailable}`}>
                  Unavailable
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-[#999999]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#366760] align-middle" aria-hidden="true"></span>
          <span className="align-middle">Available</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#CC4B37] align-middle" aria-hidden="true"></span>
          <span className="align-middle">Unavailable</span>
        </span>
      </div>
    </section>
  );
}