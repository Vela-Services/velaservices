"use client";

import AvailabilitySelector, { Availability } from "@/components/AvailabilitySelector";
import { MdSchedule } from "react-icons/md";

type AvailabilitySectionProps = {
  availability: Availability[];
  onChange: (availability: Availability[]) => void;
};

export function AvailabilitySection({
  availability,
  onChange,
}: AvailabilitySectionProps) {
  const totalHours = availability.reduce((sum, day) => sum + day.times.length, 0);
  const availableDays = availability.filter(day => day.times.length > 0).length;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D3B3]/50 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[#7C5E3C] to-[#BFA181] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <MdSchedule className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Availability</h2>
            {(totalHours > 0 || availableDays > 0) && (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {availableDays} {availableDays === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {totalHours} {totalHours === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* Availability Selector - More compact */}
        <div className="bg-gradient-to-br from-[#F5E8D3] to-[#FFF7E6] rounded-xl p-2 border border-[#BFA181]/20">
          <AvailabilitySelector
            initialAvailability={availability}
            onChange={onChange}
          />
        </div>

        {/* Info Note - Compact */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Tip:</strong> Your availability auto-saves as you make changes. Set accurate hours to receive relevant requests.
          </p>
        </div>
      </div>
    </div>
  );
}
