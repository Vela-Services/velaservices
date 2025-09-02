import { Card, CardContent } from "@/components/ui/card";
import { Provider } from "@/types/types";
import { COLORS } from "../lib/color";
import { dayLabel } from "../lib/utils";
import ContactInfo from "../components/ProviderCard/ContactInfo";
import ServicesInfo from "../components/ProviderCard/ServicesInfo";
import MotivationInfo from "../components/ProviderCard/MotivationInfo";
import AvailabilityInfo from "../components/ProviderCard/AvailabilityInfo";
import { User } from "lucide-react";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card
      className={`rounded-2xl shadow-md border ${COLORS.primaryBorder} ${COLORS.primaryBg} transition-all duration-300 ${COLORS.hoverShadow} hover:scale-[1.02] w-full h-full max-w-md mx-auto flex flex-col min-h-[520px] max-h-[620px] font-sans`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      aria-label={`Provider card for ${provider.displayName}`}
    >
      <CardContent className="p-5 flex flex-col gap-5 h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-[#366760]/20 rounded-full p-2.5 flex items-center justify-center transition-colors hover:bg-[#FF6B6B]/30" aria-hidden="true">
              <User className="h-7 w-7 text-[#8B4513]" aria-label="Provider" />
            </div>
            <div>
              <h2
                className={`text-xl font-bold ${COLORS.headerText} break-words tracking-tight`}
                tabIndex={0}
              >
                {provider.displayName}
              </h2>
            </div>
          </div>
        </div>

        <ContactInfo provider={provider} />
        <ServicesInfo provider={provider} />
        <MotivationInfo provider={provider} />
        <AvailabilityInfo provider={provider} dayLabel={dayLabel} />
      </CardContent>
    </Card>
  );
}