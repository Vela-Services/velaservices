"use client";

import { Service, ProviderService } from "@/types/types";
import { ServiceCard } from "./ServiceCard";
import { CurrentServicesList } from "./CurrentServicesList";
import { FaCheckCircle, FaSpinner, FaLightbulb } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { useState, useEffect } from "react";

type ServicesFormProps = {
  services: Service[];
  providerServices: ProviderService[];
  onServiceToggle: (serviceId: string) => void;
  onSubServiceToggle: (serviceId: string, subServiceId: string) => void;
  onSubServicePriceChange: (serviceId: string, subId: string, price: number) => void;
  onSave: () => void;
  saving: boolean;
  saveMsg: string | null;
};

export function ServicesForm({
  services,
  providerServices,
  onServiceToggle,
  onSubServiceToggle,
  onSubServicePriceChange,
  onSave,
  saving,
  saveMsg,
}: ServicesFormProps) {
  const hasSelectedServices = providerServices.length > 0;
  const isSuccess = saveMsg?.includes("success") || saveMsg?.includes("updated");
  const [showTip, setShowTip] = useState(!hasSelectedServices);
  const totalSubServices = providerServices.reduce((acc, ps) => acc + (ps.subServices?.length || 0), 0);

  useEffect(() => {
    if (hasSelectedServices) {
      setShowTip(false);
    }
  }, [hasSelectedServices]);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D3B3]/50 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[#BFA181] to-[#7C5E3C] p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MdBusinessCenter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your Services</h2>
              {hasSelectedServices && (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    {providerServices.length} Active
                  </span>
                  {totalSubServices > 0 && (
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {totalSubServices} Subservices
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Important Pricing Notice */}
        <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900 mb-1">
                Important: Pricing Information
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                The price you set for your services should <strong>include the 10% platform fee</strong>. 
                This means Véla will deduct 10% from the price you set. For example, if you set 100 NOK/hour, 
                you will receive 90 NOK/hour, and 10 NOK/hour goes to Véla.
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {saveMsg && (
          <div
            className={`mb-4 p-3 rounded-lg border flex items-center gap-2 text-sm ${
              isSuccess
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className={`flex-shrink-0 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              {isSuccess ? (
                <FaCheckCircle className="w-4 h-4" />
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="font-medium">{saveMsg}</p>
          </div>
        )}

        {/* Helpful Tip - Compact */}
        {showTip && !hasSelectedServices && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FaLightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-800 text-xs leading-relaxed">
                  Select at least one service to begin. You can customize pricing for each subservice.
                </p>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Dismiss tip"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          {/* Services Section */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-[#7C5E3C] mb-3 flex items-center gap-2">
              <FaCheckCircle className="text-[#BFA181] w-4 h-4" />
              Available Services
            </h3>
            
            <div className="space-y-2.5">
              {services.map((service) => {
                const providerService = providerServices.find(
                  (s) => s.serviceId === service.id
                );
                const serviceSelected = !!providerService;

                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    providerService={providerService}
                    isSelected={serviceSelected}
                    onToggle={onServiceToggle}
                    onSubServiceToggle={onSubServiceToggle}
                    onSubServicePriceChange={onSubServicePriceChange}
                  />
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || !hasSelectedServices}
            className={`w-full py-3 px-4 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              saving || !hasSelectedServices
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
            } ${
              hasSelectedServices
                ? "bg-gradient-to-r from-[#BFA181] to-[#7C5E3C] text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin w-4 h-4" />
                <span>Saving...</span>
              </span>
            ) : hasSelectedServices ? (
              <span className="flex items-center justify-center gap-2">
                <FaCheckCircle className="w-4 h-4" />
                <span>Save Services</span>
              </span>
            ) : (
              <span>Select at least one service</span>
            )}
          </button>
        </form>

        {/* Current Services Summary - Compact */}
        {hasSelectedServices && (
          <div className="mt-5 pt-5 border-t border-[#E5D3B3]/50">
            <h3 className="text-sm font-bold text-[#7C5E3C] mb-3">
              Active Services
            </h3>
            <CurrentServicesList
              providerServices={providerServices}
              services={services}
            />
          </div>
        )}
      </div>
    </div>
  );
}
