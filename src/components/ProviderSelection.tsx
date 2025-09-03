import { Provider, Service } from "@/types/types";
import { ProviderCard } from "@/components/ProviderCard";

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
  // Ensure providers with undefined services are handled
  const filteredProviders = providers.filter((provider) => {
    if (selectedFilters.length === 0) return true;
    // Return false if services is undefined or empty
    if (!provider.services || provider.services.length === 0) return false;
    return selectedFilters.length === 1
      ? provider.services.some((s) => s.serviceId === selectedFilters[0])
      : selectedFilters.every((f) =>
          provider.services!.some((s) => s.serviceId === f)
        ); // Non-null assertion after check
  });

  return (
    <div className="min-h-screen bg-[#F5E8D3] py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-[#7C5E3C] mb-10">
        Choose a Provider
      </h1>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {services.map((service) => {
          const checked = selectedFilters.includes(service.id);
          return (
            <label
              key={service.id}
              className={`group flex items-center space-x-2 px-5 py-2 rounded-full cursor-pointer border-2 transition-all duration-200 shadow-sm
                ${
                  checked
                    ? "bg-gradient-to-r from-[#BFA181] to-[#EAD7B7] border-[#BFA181] shadow-lg"
                    : "bg-white border-[#E5E7EB] hover:bg-[#F5E8D3] hover:border-[#BFA181]"
                }
              `}
              style={{
                minWidth: "fit-content",
              }}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200
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
                className={`font-semibold text-base transition-colors duration-200 ${
                  checked ? "text-[#7C5E3C]" : "text-[#BFA181] group-hover:text-[#7C5E3C]"
                }`}
              >
                {service.name}
              </span>
            </label>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <button
              key={provider.id}
              className="text-left w-full"
              onClick={() => onSelectProvider(provider)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              aria-label={`Select provider ${provider.displayName}`}
            >
              <ProviderCard provider={provider} />
            </button>
          ))
        ) : (
          <div className="col-span-full text-center text-[#7C5E3C] text-lg">
            No providers match your filters.
          </div>
        )}
      </div>
    </div>
  );
}