import { Briefcase } from "lucide-react";
import { Provider } from "@/types/types";
import { COLORS } from "@/lib/color";

interface ServicesInfoProps {
  provider: Provider;
}

export default function ServicesInfo({ provider }: ServicesInfoProps) {
  return (
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
                        `${sub.name}${typeof sub.price === "number" ? `: ${sub.price}NOK/h` : ""}`
                    )
                    .join(", ")}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}