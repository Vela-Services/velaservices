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
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <span className="text-[#7C5E3C] text-xl font-semibold">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <span className="text-[#7C5E3C] text-xl font-semibold">
          Please log in to continue.
        </span>
      </div>
    );
  }

  if (profile.role === "customer") {
    return selectedProvider ? (
      <ServiceSelection
        provider={selectedProvider}
        services={services}
        addToCart={addToCart}
        onBack={() => setSelectedProvider(null)}
      />
    ) : (
      <ProviderSelection
        providers={filteredProviders}
        services={services}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        onSelectProvider={setSelectedProvider}
      />
    );
  }

  return null;
}