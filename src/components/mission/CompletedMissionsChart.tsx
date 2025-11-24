"use client";

import { DocumentData } from "firebase/firestore";
import { getServiceIcon } from "@/utils/mission/getServiceIcon";

type CompletedMissionsChartProps = {
  completedMissions: DocumentData[];
};

export function CompletedMissionsChart({ completedMissions }: CompletedMissionsChartProps) {
  const counts: { [service: string]: number } = {};
  completedMissions.forEach((m) => {
    const name = m.serviceName || "Other";
    counts[name] = (counts[name] || 0) + 1;
  });
  const maxCount = Math.max(1, ...Object.values(counts));
  const services = Object.keys(counts);

  if (services.length === 0) {
    return (
      <div className="text-[#7C5E3C] text-center py-8">
        No completed missions yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {services.map((service) => (
          <div key={service} className="flex items-center gap-2">
            <div className="w-32 flex items-center gap-2">
              {getServiceIcon(service)}
              <span className="text-[#7C5E3C] text-sm">{service}</span>
            </div>
            <div className="flex-1 h-5 bg-[#F5E8D3] rounded">
              <div
                className="h-5 bg-[#BFA181] rounded"
                style={{
                  width: `${(counts[service] / maxCount) * 100}%`,
                  minWidth: "2rem",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <span className="ml-2 text-[#7C5E3C] font-semibold">
              {counts[service]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

