"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/app/hooks/useAuth";
import { useServices } from "@/app/hooks/useServices";
import { useProviders } from "@/app/hooks/useProviders";
import ProviderSelection from "@/components/ProviderSelection";
import ServiceSelection from "@/components/ServiceSelection";
import { Provider } from "@/types/types";

export default function ServicesPage() {
  const { profile, loading } = useAuth();
  const { services } = useServices();
  const { providers, loading: providersLoading } = useProviders();
  const { addToCart } = useCart();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (serviceId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredProviders = providers.filter((provider) => {
    if (selectedFilters.length === 0) return true;
    if (!provider.services || provider.services.length === 0) return false;
    return selectedFilters.length === 1
      ? provider.services.some((s) => s.serviceId === selectedFilters[0])
      : selectedFilters.every((f) => provider.services.some((s) => s.serviceId === f));
  });

  if (loading || providersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E8D3] via-[#F9F6F1] to-[#EAD7B7]">
        <div className="flex items-center gap-3 text-[#7C5E3C]">
          <span className="inline-block w-6 h-6 border-2 border-[#BFA181] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="text-xl font-semibold">Loading your experience…</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E8D3] via-[#F9F6F1] to-[#EAD7B7]">
        <div className="bg-white/70 backdrop-blur-sm border border-[#E5E7EB] rounded-2xl px-6 py-5 shadow-sm">
          <span className="text-[#7C5E3C] text-lg sm:text-xl font-semibold">Please log in to continue.</span>
        </div>
      </div>
    );
  }

  if (profile.role === "customer") {
    const onBackToProviders = () => setSelectedProvider(null);
    return (
      <div className="min-h-screen bg-[#F5E8D3]">
        {/* Step Header */}
        <div className="sticky top-0 z-40 border-b border-[#E5E7EB]/70 bg-white/70 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full grid place-items-center text-sm font-bold ${!selectedProvider ? "bg-[#7C5E3C] text-white" : "bg-[#EAD7B7] text-[#7C5E3C]"}`}>1</span>
                  <span className={`text-sm font-medium ${!selectedProvider ? "text-[#7C5E3C]" : "text-[#7C5E3C]/70"}`}>Select a provider</span>
                </div>
                <span className="text-[#BFA181]">→</span>
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full grid place-items-center text-sm font-bold ${selectedProvider ? "bg-[#7C5E3C] text-white" : "bg-[#EAD7B7] text-[#7C5E3C]"}`}>2</span>
                  <span className={`text-sm font-medium ${selectedProvider ? "text-[#7C5E3C]" : "text-[#7C5E3C]/70"}`}>Choose service & time</span>
                </div>
              </div>
              {selectedProvider && (
                <button
                  onClick={onBackToProviders}
                  className="text-sm font-semibold text-[#7C5E3C] underline underline-offset-4 hover:text-[#5f462c]"
                >
                  Change provider
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-2 sm:px-6">
          {selectedProvider ? (
            <ServiceSelection
              provider={selectedProvider}
              services={services}
              addToCart={addToCart}
              onBack={onBackToProviders}
            />
          ) : (
            <ProviderSelection
              providers={filteredProviders}
              services={services}
              selectedFilters={selectedFilters}
              toggleFilter={toggleFilter}
              onSelectProvider={setSelectedProvider}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}