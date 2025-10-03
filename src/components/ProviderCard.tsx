import { Card, CardContent } from "@/components/ui/card";
import { Provider } from "@/types/types";
import { COLORS } from "../lib/color";
import { dayLabel } from "../lib/utils";
import ServicesInfo from "../components/ProviderCard/ServicesInfo";
import AvailabilityInfo from "../components/ProviderCard/AvailabilityInfo";
import { User } from "lucide-react";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const profilePicUrl = provider.photoURL ?? null;

  return (
    <Card
      className={`group rounded-xl shadow-lg border ${COLORS.primaryBorder} bg-white w-full h-full max-w-[400px] mx-auto flex flex-col font-sans transition-all duration-300 hover:shadow-xl hover:scale-[1.01] focus-within:shadow-xl focus-within:scale-[1.01]`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      aria-label={`Provider card for ${provider.displayName}`}
      tabIndex={0}
    >
      <CardContent className="p-6 flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div 
            className="bg-[#366760]/10 rounded-full flex items-center justify-center transition-colors hover:bg-[#FF6B6B]/20 focus:bg-[#FF6B6B]/20"
            aria-hidden="true"
            style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}
          >
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={`${provider.displayName}'s profile`}
                className="rounded-full object-cover w-full h-full"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User className="h-12 w-12 text-[#8B4513]" aria-label="Provider icon" />
            )}
          </div>
          <div className="flex-1">
            <h2
              className={`text-lg sm:text-xl font-semibold ${COLORS.headerText} break-words tracking-tight`}
              tabIndex={0}
            >
              {provider.displayName}
            </h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <ServicesInfo provider={provider} />
          <AvailabilityInfo provider={provider} dayLabel={dayLabel} />
        </div>
      </CardContent>
    </Card>
  );
}