import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Briefcase, CalendarDays, User } from "lucide-react";
import { Provider } from "@/types/types"; // Adjust the import path as necessary

// Warm, earthy color palette to complement #F5E8D3 background
const COLORS = {
  primaryBg: "bg-[#d7d6ca]",
  primaryBorder: "border-[#366760]/50",
  headerText: "text-[#366760]",
  subText: "text-[#366760]",
  accent: "text-[#618173]",
  accentBg: "bg-[#366760]/10",
  accentBorder: "border-[#366760]/30",
  muted: "text-[#999999]",
  unavailable: "text-[#CC4B37]",
  available: "text-[#366760]",
  availableBg: "bg-[#366760]/10",
  availableBorder: "border-[#A8D5BA]/30",
  hoverShadow: "hover:shadow-[#FF6B6B]/20",
};

// Matching Gradient
// #f9f5ef
// #d7d6ca
// #b2b8a8
// #8a9c8a
// #618173
// #366760


export function ProviderCard({ provider }: { provider: Provider }) {
  // Helper for accessible day names
  const dayLabel = (day: string) => {
    switch (day.toLowerCase()) {
      case "mon":
      case "monday":
        return "Monday";
      case "tue":
      case "tuesday":
        return "Tuesday";
      case "wed":
      case "wednesday":
        return "Wednesday";
      case "thu":
      case "thursday":
        return "Thursday";
      case "fri":
      case "friday":
        return "Friday";
      case "sat":
      case "saturday":
        return "Saturday";
      case "sun":
      case "sunday":
        return "Sunday";
      default:
        return day;
    }
  };

  return (
    <Card
      className={`rounded-2xl shadow-md border ${COLORS.primaryBorder} ${COLORS.primaryBg} transition-all duration-300 ${COLORS.hoverShadow} hover:scale-[1.02] w-full h-full max-w-md mx-auto flex flex-col min-h-[520px] max-h-[620px] font-sans`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      aria-label={`Provider card for ${provider.displayName}`}
    >
      <CardContent className="p-5 flex flex-col gap-5 h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-[#366760]/20 rounded-full p-2.5 flex items-center justify-center transition-colors hover:bg-[#FF6B6B]/30" aria-hidden="true">
              <User className="h-7 w-7 text-[#8B4513]" aria-label="Provider" />
            </div>
            <div>
              <h2
                className={`text-xl font-bold ${COLORS.headerText} break-words tracking-tight`}
                tabIndex={0}
              >
                {provider.displayName}
              </h2>
            </div>
          </div>
        </div>

        {/* Contact */}
        <section
          className={`flex flex-col gap-3 text-sm ${COLORS.subText} ${COLORS.accentBg} rounded-xl px-4 py-3 backdrop-blur-sm`}
          aria-label="Contact information"
        >
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
            <span className="sr-only">Email: </span>
            <a
              href={`mailto:${provider.email}`}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] truncate transition-colors"
              tabIndex={0}
            >
              {provider.email}
            </a>
          </div>
          {provider.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Phone: </span>
              <a
                href={`tel:${provider.phone}`}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] truncate transition-colors"
                tabIndex={0}
              >
                {provider.phone}
              </a>
            </div>
          )}
        </section>

        {/* Services */}
        <section aria-label="Services offered" className="flex-1 overflow-y-auto">
          <h3
            className={`text-sm font-semibold flex items-center gap-2 mb-3 ${COLORS.headerText} tracking-tight`}
          >
            <Briefcase className="h-5 w-5 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
            <span>Services</span>
          </h3>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {!provider.services || provider.services.length === 0 ? (
              <span className="text-xs text-[#999999] italic">
                No services listed
              </span>
            ) : (
              provider.services.map((service) => (
                <div
                  key={service.serviceId}
                  className={`bg-[#366760]/10 border ${COLORS.accentBorder} rounded-full px-3 py-1.5 text-xs ${COLORS.headerText} min-w-[100px] max-w-full break-words transition-colors hover:bg-[#FF6B6B]/20`}
                  tabIndex={0}
                >
                  {service.subServices && service.subServices.length > 0 && (
                    <span className="text-[11px] text-[#8B4513] mt-0.5 break-words">
                      {service.subServices
                        .map(
                          (sub) =>
                            `${sub.name}${
                              typeof sub.price === "number"
                                ? `: ${sub.price}NOK/h`
                                : ""
                            }`
                        )
                        .join(", ")}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Motivation */}
        {provider.why && (
          <section
            className={`${COLORS.accentBg} rounded-xl px-4 py-3 backdrop-blur-sm`}
            aria-label="Provider motivation"
          >
            <p className={`text-xs italic ${COLORS.headerText} text-center break-words line-clamp-3 tracking-wide`}>
              “{provider.why}”
            </p>
          </section>
        )}

        {/* Availability */}
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
      </CardContent>
    </Card>
  );
}