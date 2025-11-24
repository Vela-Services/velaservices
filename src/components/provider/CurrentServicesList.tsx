"use client";

import { ProviderService, Service } from "@/types/types";
import { capitalize } from "@/utils/string/capitalize";
import { ServiceIcon } from "./ServiceIcon";

type CurrentServicesListProps = {
  providerServices: ProviderService[];
  services: Service[];
};

export function CurrentServicesList({
  providerServices,
  services,
}: CurrentServicesListProps) {
  if (providerServices.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-xs">
          No services selected yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {providerServices.map((svc) => {
        const serviceName =
          services.find((s) => s.id === svc.serviceId)?.name ||
          "Unknown Service";
        const hasPricing = svc.subServices?.some((sub) => sub.price);

        return (
          <div
            key={svc.serviceId}
            className="group relative bg-gradient-to-br from-[#BFA181] to-[#7C5E3C] text-white p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
              <ServiceIcon serviceName={serviceName} size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">
                {capitalize(serviceName)}
              </div>
              {hasPricing && (
                <div className="text-[10px] text-white/80 mt-0.5">
                  {svc.subServices?.filter((sub) => sub.price).length} priced
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
