"use client";

import { SubService, ProviderService } from "@/types/types";
import { capitalize } from "@/utils/string/capitalize";
import { FaCheckCircle, FaInfoCircle, FaCoins } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

type SubServiceItemProps = {
  subService: SubService;
  serviceId: string;
  providerService: ProviderService | undefined;
  onToggle: (serviceId: string, subServiceId: string) => void;
  onPriceChange: (serviceId: string, subId: string, price: number) => void;
};

export function SubServiceItem({
  subService,
  serviceId,
  providerService,
  onToggle,
  onPriceChange,
}: SubServiceItemProps) {
  const subSelected = providerService?.subServices?.some(
    (ss) => ss.id === subService.id
  );

  const currentPrice =
    providerService?.subServices?.find((ss) => ss.id === subService.id)
      ?.price ?? subService.price ?? 20;

  const [priceInput, setPriceInput] = useState(currentPrice.toString());
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  const handlePriceBlur = () => {
    const numPrice = Number(priceInput);
    if (numPrice >= 1 && numPrice <= 1000) {
      onPriceChange(serviceId, subService.id, numPrice);
    } else {
      setPriceInput(currentPrice.toString());
    }
  };

  useEffect(() => {
    if (showTooltip && infoButtonRef.current) {
      const rect = infoButtonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Position above the button
        left: rect.left + rect.width / 2, // Center horizontally
      });
    }
  }, [showTooltip]);

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-150 ${
      subSelected 
        ? "bg-[#BFA181]/10 border border-[#BFA181]/30" 
        : "bg-gray-50/50 hover:bg-gray-50"
    }`}>
      {/* Checkbox */}
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={!!subSelected}
          onChange={() => onToggle(serviceId, subService.id)}
          className="sr-only"
          id={`subservice-${subService.id}`}
        />
        <label
          htmlFor={`subservice-${subService.id}`}
          className={`flex items-center justify-center w-4 h-4 rounded border cursor-pointer transition-all duration-150 ${
            subSelected
              ? "bg-[#BFA181] border-[#BFA181]"
              : "bg-white border-gray-300 hover:border-[#BFA181]"
          }`}
        >
          {subSelected && <FaCheckCircle className="w-2.5 h-2.5 text-white" />}
        </label>
      </div>

      {/* Label */}
      <label
        htmlFor={`subservice-${subService.id}`}
        className="cursor-pointer flex-1 min-w-0 flex items-center gap-1.5"
      >
        <span className={`text-xs font-medium transition-colors ${
          subSelected ? "text-[#7C5E3C]" : "text-gray-700"
        }`}>
          {capitalize(subService.name)}
        </span>
        {subService.description && (
          <>
            <button
              ref={infoButtonRef}
              type="button"
              className="focus:outline-none flex-shrink-0"
              aria-label={`Info about ${subService.name}`}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <FaInfoCircle className="w-3 h-3 text-[#BFA181] hover:text-[#7C5E3C] transition-colors" />
            </button>
            {showTooltip && (
              <div
                className="fixed w-64 max-w-[90vw] bg-white border border-[#BFA181]/30 rounded-lg shadow-xl p-3 text-xs text-[#7C5E3C] z-[9999] pointer-events-none"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-8px',
                }}
              >
                <p className="leading-relaxed">{subService.description}</p>
                {/* Arrow pointing down */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#BFA181]/30"></div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-[1px] w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            )}
          </>
        )}
      </label>

      {/* Price Input - Compact */}
      {subSelected && (
        <div className="flex items-center gap-1.5 flex-shrink-0 bg-white rounded border border-[#BFA181]/20 px-1.5 py-1">
          <FaCoins className="w-3 h-3 text-[#BFA181]" />
          <input
            type="number"
            min={1}
            max={1000}
            step={10}
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePriceBlur();
                e.currentTarget.blur();
              }
            }}
            className="w-16 px-1.5 py-0.5 rounded border border-gray-200 focus:border-[#BFA181] focus:outline-none focus:ring-1 focus:ring-[#BFA181]/20 text-right font-bold text-xs text-[#7C5E3C]"
            placeholder="Price"
          />
          <span className="text-[#BFA181] font-bold text-xs">
            NOK/h
          </span>
        </div>
      )}
    </div>
  );
}
