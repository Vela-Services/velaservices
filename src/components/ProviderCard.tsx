import { Card, CardContent } from "@/components/ui/card";
import { Provider } from "@/types/types";
import { COLORS } from "../lib/color";
import { dayLabel } from "../lib/utils";
import ServicesInfo from "../components/ProviderCard/ServicesInfo";
import AvailabilityInfo from "../components/ProviderCard/AvailabilityInfo";
import { User, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const profilePicUrl = provider.photoURL ?? null;
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  return (
    <Card
      className={`group relative rounded-2xl shadow-md border-2 ${COLORS.primaryBorder} bg-gradient-to-br from-white to-[#F9F9F9] w-full h-full max-w-[400px] mx-auto flex flex-col font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-[#366760] focus-within:shadow-2xl focus-within:scale-[1.02] focus-within:border-[#366760] overflow-hidden`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      aria-label={`Provider card for ${provider.displayName}`}
      tabIndex={0}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#366760]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="p-6 flex flex-col gap-6 h-full relative z-10">
        {/* Header with improved styling */}
        <div className="flex items-start gap-4 pb-4 border-b border-[#366760]/10">
          <div 
            className="relative bg-gradient-to-br from-[#366760]/10 to-[#366760]/5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:ring-4 group-hover:ring-[#366760]/20 group-hover:scale-105 shadow-md"
            aria-hidden="true"
            style={{ width: 90, height: 90, minWidth: 90, minHeight: 90 }}
          >
            {profilePicUrl ? (
              <Image
                src={profilePicUrl}
                alt={`${provider.displayName}'s profile`}
                width={90}
                height={90}
                className="rounded-full object-cover w-full h-full border-2 border-white shadow-sm"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#366760]/20 to-[#366760]/10 flex items-center justify-center">
                <User className="h-10 w-10 text-[#366760]" aria-label="Provider icon" />
              </div>
            )}
          </div>
          <div className="flex-1 pt-1">
            <h2
              className={`text-xl sm:text-2xl font-bold ${COLORS.headerText} break-words tracking-tight mb-2 group-hover:text-[#2d524d] transition-colors`}
              tabIndex={0}
            >
              {provider.displayName}
            </h2>

          </div>
        </div>
        
        {/* Bio section with consistent height - expands on hover */}
        <div className="min-h-[60px] flex items-start">
          {provider.why ? (
            <div 
              className="group/bio bg-gradient-to-r from-[#F5E8D3]/30 to-transparent rounded-lg p-3 border-l-2 border-[#BFA181]/40 w-full flex items-start gap-2.5 transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r hover:from-[#F5E8D3]/40 hover:to-[#F5E8D3]/20"
              onMouseEnter={() => setIsBioExpanded(true)}
              onMouseLeave={() => setIsBioExpanded(false)}
            >
              <Sparkles className="h-4 w-4 text-[#BFA181] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 relative overflow-hidden">
                <p 
                  className={`text-sm text-[#7C5E3C]/90 leading-relaxed italic transition-all duration-300 ${
                    isBioExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {provider.why}
                </p>
                {/* Gradient fade indicator when text is truncated */}
                {!isBioExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F5E8D3]/30 via-[#F5E8D3]/20 to-transparent pointer-events-none" />
                )}
              </div>
            </div>
          ) : (
            <div className="w-full" aria-hidden="true" />
          )}
        </div>

        {/* Content sections with better spacing */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <ServicesInfo provider={provider} />
          <AvailabilityInfo provider={provider} dayLabel={dayLabel} />
        </div>
      </CardContent>
    </Card>
  );
}