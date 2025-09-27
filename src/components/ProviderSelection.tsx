import { Provider, Service } from "@/types/types";
import { ProviderCard } from "@/components/ProviderCard";
import { Search } from "lucide-react";
import { useState } from "react";

interface ProviderSelectionProps {
  providers: Provider[];
  services: Service[];
  selectedFilters: string[];
  toggleFilter: (serviceId: string) => void;
  onSelectProvider: (provider: Provider) => void;
}

export default function ProviderSelection({
  providers,
  services,
  selectedFilters,
  toggleFilter,
  onSelectProvider,
}: ProviderSelectionProps) {
  // Search state for provider name
  const [search, setSearch] = useState("");

  // Filter providers by selected services and search
  const filteredProviders = providers.filter((provider) => {
    // Service filter
    if (selectedFilters.length > 0) {
      if (!provider.services || provider.services.length === 0) return false;
      if (selectedFilters.length === 1) {
        if (!provider.services.some((s) => s.serviceId === selectedFilters[0])) return false;
      } else {
        if (!selectedFilters.every((f) => provider.services!.some((s) => s.serviceId === f))) return false;
      }
    }
    // Search filter
    if (search.trim()) {
      const name = provider.displayName?.toLowerCase() || "";
      if (!name.includes(search.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] via-[#F9F6F1] to-[#EAD7B7] py-12 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#7C5E3C] mb-4 tracking-tight drop-shadow-sm">
          Choose a Provider
        </h1>
        <p className="text-center text-[#7C5E3C]/80 mb-8 text-lg">
          Filter by service and search for a provider to get started.
        </p>

        {/* Service Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {services.map((service) => {
            const checked = selectedFilters.includes(service.id);
            return (
              <label
                key={service.id}
                className={`group flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer border-2 transition-all duration-200 shadow-sm font-medium text-base
                  ${
                    checked
                      ? "bg-gradient-to-r from-[#BFA181] to-[#EAD7B7] border-[#BFA181] shadow-lg text-[#7C5E3C]"
                      : "bg-white border-[#E5E7EB] hover:bg-[#F5E8D3] hover:border-[#BFA181] text-[#BFA181] hover:text-[#7C5E3C]"
                  }
                `}
                style={{
                  minWidth: "fit-content",
                  userSelect: "none",
                }}
              >
                <span
                  className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200
                    ${
                      checked
                        ? "bg-[#7C5E3C] border-[#7C5E3C]"
                        : "bg-white border-[#BFA181] group-hover:border-[#7C5E3C]"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleFilter(service.id)}
                    className="appearance-none w-4 h-4 rounded-full focus:ring-2 focus:ring-[#BFA181] checked:bg-[#BFA181] checked:border-[#BFA181] transition"
                    style={{
                      outline: "none",
                    }}
                    aria-checked={checked}
                  />
                  {checked && (
                    <svg
                      className="w-3 h-3 text-white pointer-events-none absolute"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 8.5l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span
                  className={`transition-colors duration-200 ${
                    checked ? "text-[#7C5E3C]" : "text-[#BFA181] group-hover:text-[#7C5E3C]"
                  }`}
                >
                  {service.name}
                </span>
              </label>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BFA181] w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search provider by name..."
              className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-[#E5E7EB] focus:border-[#BFA181] bg-white text-[#7C5E3C] placeholder-[#BFA181] shadow-sm transition-all duration-200 outline-none"
              aria-label="Search providers by name"
            />
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <button
                key={provider.id}
                className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA181] rounded-xl transition-shadow"
                onClick={() => onSelectProvider(provider)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                aria-label={`Select provider ${provider.displayName}`}
                tabIndex={0}
              >
                <ProviderCard provider={provider} />
              </button>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <svg
                width={64}
                height={64}
                fill="none"
                viewBox="0 0 64 64"
                className="mb-4 text-[#BFA181]"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="30" stroke="#BFA181" strokeWidth="4" fill="#F5E8D3" />
                <path d="M20 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#BFA181" strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="28" r="6" stroke="#BFA181" strokeWidth="3" />
              </svg>
              <div className="text-center text-[#7C5E3C] text-lg font-medium">
                No providers match your filters or search.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}