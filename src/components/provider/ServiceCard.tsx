"use client";

import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Service, ProviderService } from "@/types/types";
import { capitalize } from "@/utils/string/capitalize";
import { SubServiceItem } from "./SubServiceItem";
import { ServiceIcon } from "./ServiceIcon";
import { useState } from "react";

type ServiceCardProps = {
  service: Service;
  providerService: ProviderService | undefined;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
  onSubServiceToggle: (serviceId: string, subServiceId: string) => void;
  onSubServicePriceChange: (serviceId: string, subId: string, price: number) => void;
};

export function ServiceCard({
  service,
  providerService,
  isSelected,
  onToggle,
  onSubServiceToggle,
  onSubServicePriceChange,
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const hasSubServices = service.subServices && service.subServices.length > 0;
  const selectedSubServicesCount = providerService?.subServices?.length || 0;
  const totalSubServices = service.subServices?.length || 0;

  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-br from-[#F5E8D3] to-white border-[#BFA181] shadow-md"
          : "bg-white border-gray-200 hover:border-[#BFA181]/50"
      }`}
    >
      {/* Main service row */}
      <div
        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
          isSelected ? "bg-[#BFA181]/5" : "hover:bg-gray-50"
        }`}
        onClick={() => {
          onToggle(service.id);
          if (!isSelected && hasSubServices) {
            setIsExpanded(true);
          }
        }}
      >
        {/* Service Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
          isSelected 
            ? "bg-gradient-to-br from-[#BFA181] to-[#7C5E3C] shadow-sm" 
            : "bg-[#F5E8D3]"
        }`}>
          <ServiceIcon serviceName={service.name} size={20} className={isSelected ? "text-white" : ""} />
        </div>

        {/* Service name and info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`service-checkbox-${service.id}`}
              className="cursor-pointer"
            >
              <span className={`text-sm font-semibold transition-colors ${
                isSelected ? "text-[#7C5E3C]" : "text-gray-800"
              }`}>
                {capitalize(service.name)}
              </span>
            </label>
            {isSelected && (
              <span className="px-2 py-0.5 bg-[#BFA181] text-white text-xs font-bold rounded-full">
                Active
              </span>
            )}
          </div>
          {hasSubServices && isSelected && (
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedSubServicesCount}/{totalSubServices} selected
            </p>
          )}
        </div>

        {/* Custom Checkbox */}
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {
              onToggle(service.id);
              if (!isSelected && hasSubServices) {
                setIsExpanded(true);
              }
            }}
            className="sr-only"
            id={`service-checkbox-${service.id}`}
          />
          <label
            htmlFor={`service-checkbox-${service.id}`}
            className={`flex items-center justify-center w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 ${
              isSelected
                ? "bg-[#BFA181] border-[#BFA181]"
                : "bg-white border-gray-300 group-hover:border-[#BFA181]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {isSelected && (
              <FaCheckCircle className="w-3.5 h-3.5 text-white" />
            )}
          </label>
        </div>

        {/* Expand/Collapse button */}
        {hasSubServices && isSelected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex-shrink-0 p-1.5 rounded hover:bg-[#BFA181]/10 transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <FaChevronUp className="w-3.5 h-3.5 text-[#BFA181]" />
            ) : (
              <FaChevronDown className="w-3.5 h-3.5 text-[#BFA181]" />
            )}
          </button>
        )}
      </div>

      {/* Subservices - Compact */}
      {isSelected && hasSubServices && (
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-3 pb-3 pt-2 border-t border-[#BFA181]/20 bg-white/50">
            <div className="space-y-1.5 pl-12">
              {service.subServices?.map((sub) => (
                <SubServiceItem
                  key={sub.id}
                  subService={sub}
                  serviceId={service.id}
                  providerService={providerService}
                  onToggle={onSubServiceToggle}
                  onPriceChange={onSubServicePriceChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
