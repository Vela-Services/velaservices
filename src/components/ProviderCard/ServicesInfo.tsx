import { Briefcase } from "lucide-react";
import { Provider } from "@/types/types";
import { COLORS } from "@/lib/color";

interface ServicesInfoProps {
  provider: Provider;
}

export default function ServicesInfo({ provider }: ServicesInfoProps) {
  const hasServices = provider.services && provider.services.length > 0;

  return (
    <section
      aria-label="Services offered"
      className={`bg-gradient-to-br from-white to-[#F9F9F9] rounded-xl shadow-sm border border-[#366760]/10 ${
        hasServices
          ? "flex-1 overflow-y-auto p-5"
          : "p-4"
      }`}
    >
      <h3
        className={`flex items-center gap-2.5 mb-4 text-base font-bold ${COLORS.headerText} tracking-tight`}
      >
        <div className="p-1.5 bg-[#366760]/10 rounded-lg">
          <Briefcase className="h-5 w-5 text-[#366760] flex-shrink-0" aria-hidden="true" />
        </div>
        <span>Services Offered</span>
      </h3>
      <div className={hasServices ? "space-y-3" : ""}>
        {!hasServices ? (
          <p className="text-sm text-[#999999] italic text-center py-2">
            No services listed
          </p>
        ) : (
          provider.services.map((service) => (
            <div
              key={service.serviceId}
              className={`bg-gradient-to-br from-[#366760]/5 to-[#366760]/3 border border-[#366760]/20 rounded-xl p-4 text-sm ${COLORS.headerText} transition-all duration-200 hover:bg-gradient-to-br hover:from-[#366760]/10 hover:to-[#366760]/5 hover:border-[#366760]/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#366760]/30 cursor-pointer`}
              tabIndex={0}
              role="button"
              aria-label={`Service: ${service.serviceId}`}
            >
              {service.subServices && service.subServices.length > 0 && (
                <ul className="space-y-2.5">
                  {service.subServices.map((sub, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-1.5 border-b border-[#366760]/5 last:border-0"
                    >
                      <span className="font-semibold text-[#366760] text-sm">{sub.name}</span>
                      {typeof sub.price === "number" && (
                        <span className="font-bold text-[#7C5E3C] bg-[#BFA181]/10 px-2.5 py-1 rounded-md text-xs">
                          {sub.price} NOK/h
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}