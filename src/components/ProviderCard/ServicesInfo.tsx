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
      className={`bg-white rounded-lg shadow-sm ${
        hasServices
          ? "flex-1 overflow-y-auto p-4"
          : "p-2"
      }`}
    >
      <h3
        className={`flex items-center gap-2 mb-4 text-base font-semibold ${COLORS.headerText} tracking-tight`}
      >
        <Briefcase className="h-6 w-6 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
        <span>Services Offered</span>
      </h3>
      <div className={hasServices ? "space-y-3" : ""}>
        {!hasServices ? (
          <p className="text-sm text-[#999999] italic text-center py-1">
            No services listed
          </p>
        ) : (
          provider.services.map((service) => (
            <div
              key={service.serviceId}
              className={`bg-[#366760]/5 border ${COLORS.accentBorder} rounded-lg p-3 text-sm ${COLORS.headerText} transition-colors hover:bg-[#FF6B6B]/10 focus:bg-[#FF6B6B]/10 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] cursor-pointer`}
              tabIndex={0}
              role="button"
              aria-label={`Service: ${service.serviceId}`}
            >
              {/* <span className="font-medium block mb-1">{service.serviceId}</span> */}
              {service.subServices && service.subServices.length > 0 && (
                <ul className="space-y-1">
                  {service.subServices.map((sub, index) => (
                    <li
                      key={index}
                      className="text-xs text-[#8B4513] flex justify-between items-center"
                    >
                      <span className="font-medium block mb-1">{sub.name}</span>
                      {typeof sub.price === "number" && (
                        <span className="font-semibold">{sub.price} NOK/h</span>
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