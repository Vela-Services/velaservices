import { CalendarDays, Clock } from "lucide-react";
import { Provider } from "@/types/types";
import { COLORS } from "@/lib/color";

interface AvailabilityInfoProps {
  provider: Provider;
  dayLabel: (day: string) => string;
}

// Helper to format a time string (e.g., "09:00") to a more readable format if needed
function formatTime(time: string) {
  // Optionally, you could add AM/PM or localization here
  return time;
}

export default function AvailabilityInfo({ provider, dayLabel }: AvailabilityInfoProps) {
  // Sort days to always show in week order (Mon-Sun)
  const weekOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const sortedAvailability = (provider.availability ?? []).slice().sort((a, b) => {
    return weekOrder.indexOf(a.day.toLowerCase()) - weekOrder.indexOf(b.day.toLowerCase());
  });

  return (
    <section className="flex flex-col bg-gradient-to-br from-white to-[#F9F9F9] rounded-xl shadow-sm border border-[#366760]/10 p-5" aria-label="Availability">
      <h3
        className={`flex items-center gap-2.5 mb-4 text-base font-bold ${COLORS.headerText} tracking-tight`}
      >
        <div className="p-1.5 bg-[#366760]/10 rounded-lg">
          <CalendarDays className="h-5 w-5 text-[#366760] flex-shrink-0" aria-hidden="true" />
        </div>
        <span>Availability</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2.5">
          <thead>
            <tr>
              <th className="text-left text-xs font-bold text-[#366760] px-3 py-2 uppercase tracking-wider">Day</th>
              <th className="text-left text-xs font-bold text-[#366760] px-3 py-2 uppercase tracking-wider">Hours</th>
            </tr>
          </thead>
          <tbody>
            {(!provider.availability || provider.availability.length === 0) ? (
              <tr>
                <td colSpan={2}>
                  <p className="text-sm text-[#999999] italic text-center py-6">
                    No availability listed
                  </p>
                </td>
              </tr>
            ) : (
              sortedAvailability.map((a) => {
                let content;
                if (a.times.length > 0) {
                  // Sort times in case they're not sorted
                  const sortedTimes = a.times.slice().sort();
                  const first = sortedTimes[0];
                  const last = sortedTimes[sortedTimes.length - 1];
                  content = (
                    <span className="flex items-center gap-2 font-semibold text-[#366760]">
                      <Clock className="w-4 h-4 text-[#366760] flex-shrink-0" aria-hidden="true" />
                      <span>
                        {formatTime(first)}{" "}
                        <span className="mx-1.5 text-[#BFA181] font-normal">–</span>{" "}
                        {formatTime(last)}
                      </span>
                    </span>
                  );
                } else {
                  content = (
                    <span className="italic text-[#CC4B37] flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#CC4B37] animate-pulse" aria-hidden="true"></span>
                      Unavailable
                    </span>
                  );
                }
                return (
                  <tr
                    key={a.day}
                    className={`rounded-xl transition-all duration-200 ${
                      a.times.length > 0
                        ? "bg-gradient-to-r from-[#F5E8D3] to-[#EAD7B7]/60 hover:from-[#EAD7B7] hover:to-[#E0C9A0] hover:shadow-sm"
                        : "bg-gray-50/50 hover:bg-gray-100/50"
                    }`}
                  >
                    <td className="px-3 py-2.5 font-semibold text-[#7C5E3C] whitespace-nowrap rounded-l-xl">
                      {dayLabel(a.day)}
                    </td>
                    <td className="px-3 py-2.5 rounded-r-xl">{content}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}