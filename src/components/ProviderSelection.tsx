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
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {services.map((service) => (
          <label key={service.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFilters.includes(service.id)}
              onChange={() => toggleFilter(service.id)}
              className="h-4 w-4 text-[#BFA181] border-gray-300 rounded focus:ring-[#BFA181]"
            />
            <span className="text-[#7C5E3C] font-medium">{service.name}</span>
          </label>
        ))}
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