"use client";

import Link from "next/link";
import { useProviderServices } from "@/app/hooks/provider/useProviderServices";
import { useServiceHandlers } from "@/app/hooks/provider/useServiceHandlers";
import { ServicesForm } from "@/components/provider/ServicesForm";
import { AvailabilitySection } from "@/components/provider/AvailabilitySection";
import { FaArrowRight, FaRocket } from "react-icons/fa";

export default function ServicesPage() {
  const {
    profile,
    user,
    providerServices,
    setProviderServices,
    availability,
    setAvailability,
    services,
    loading,
    saving: hookSaving,
    saveMsg,
    setSaveMsg,
    handleSaveProviderServices,
  } = useProviderServices();

  const { saving: handlerSaving, handleProviderServiceToggle, handleSubServiceToggle, handleSubServicePriceChange } =
    useServiceHandlers(
      user,
      services,
      providerServices,
      setProviderServices,
      setSaveMsg
    );

  const saving = hookSaving || handlerSaving;
  const hasSelectedServices = providerServices.length > 0;

  if (loading || services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E8D3] via-[#FFF7E6] to-[#fcf5eb]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#BFA181] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-[#7C5E3C] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-center">
            <p className="text-[#7C5E3C] text-2xl font-bold mb-2">
              Setting up your services...
            </p>
            <p className="text-[#7C5E3C]/60 text-sm">
              We&apos;re loading everything you need
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E8D3] via-[#FFF7E6] to-[#fcf5eb] p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl px-8 py-12 flex flex-col items-center max-w-md mx-auto border border-[#E5D3B3]/50">
          <div className="w-24 h-24 bg-gradient-to-br from-[#BFA181] to-[#7C5E3C] rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#7C5E3C] mb-3 text-center">
            Authentication Required
          </h2>
          <p className="text-[#7C5E3C]/70 text-center mb-8 leading-relaxed">
            Please log in to manage your provider services and set your availability schedule.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#BFA181] to-[#7C5E3C] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span>Go to Login</span>
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] via-[#FFF7E6] to-[#fcf5eb] py-6 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#7C5E3C] mb-1">
                Provider Services
              </h1>
              <p className="text-[#7C5E3C]/70 text-sm">
                Manage your services and availability
              </p>
            </div>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7C5E3C] to-[#BFA181] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span>Dashboard</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Welcome Banner - Compact */}
          {!hasSelectedServices && (
            <div className="bg-gradient-to-r from-[#BFA181] to-[#7C5E3C] rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <FaRocket className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  Get started by selecting services below. You can customize pricing and set your availability.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Services (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <ServicesForm
              services={services}
              providerServices={providerServices}
              onServiceToggle={handleProviderServiceToggle}
              onSubServiceToggle={handleSubServiceToggle}
              onSubServicePriceChange={handleSubServicePriceChange}
              onSave={handleSaveProviderServices}
              saving={saving}
              saveMsg={saveMsg}
            />
          </div>

          {/* Right Column - Availability + Quick Actions (1/3 width on desktop) */}
          <div className="lg:col-span-1 space-y-6">
            <AvailabilitySection
              availability={availability}
              onChange={setAvailability}
            />

            {/* Quick Actions Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D3B3]/50 p-5">
              <h3 className="text-lg font-bold text-[#7C5E3C] mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-[#7C5E3C] to-[#BFA181] text-white rounded-lg font-semibold text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  Go to Dashboard
                </Link>
                {hasSelectedServices && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800 font-medium">
                      ✓ {providerServices.length} {providerServices.length === 1 ? 'service' : 'services'} configured
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
